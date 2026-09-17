import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import MemberDashboard from '@/components/MemberDashboard';
import {
  databases,
  storage,
  APPWRITE_DATABASE_ID,
  APPWRITE_BUCKET_ID,
  COLLECTIONS,
  getFilePreview,
  Query,
  ID
} from '@/lib/appwrite';
import {
  type SponsorTier,
  SPONSOR_TIERS,
  TIER_VALUES,
  TIER_LABELS,
  TIER_BADGE_COLORS
} from '@/hooks/use-sponsors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Trash2,
  Edit,
  Save,
  LogOut,
  Image as ImageIcon,
  Camera,
  Video,
  Users,
  Users2,
  Star,
  MessageSquare,
  Info,
  HelpCircle,
  Shield,
  Home,
  Loader2,
  Mic2,
  Megaphone,
  GripVertical,
  HandHeart,
  Phone,
  Linkedin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
} from 'lucide-react';
import {
  type ApplicationRole,
  type ApplicationStatus,
  type CommunityApplication,
  useApplications,
  updateApplicationStatus,
} from '@/hooks/use-community-applications';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

// ============ DnD Sortable Helpers ============

// A draggable card wrapper that shows a grip handle on hover
const SortableCardItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/sortable">
      <button
        className="absolute left-2 top-2 z-10 p-1.5 rounded-md bg-background/80 backdrop-blur-sm border shadow-sm opacity-0 group-hover/sortable:opacity-100 cursor-grab active:cursor-grabbing transition-opacity duration-150"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {children}
    </div>
  );
};

// A draggable list-row wrapper that shows a grip handle inline
const SortableListItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative flex items-stretch gap-2 group/sortable">
      <button
        className="flex items-center px-1 rounded-l-md hover:bg-accent cursor-grab active:cursor-grabbing transition-colors shrink-0"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
};

// Shared sensors for all sortable contexts
const useDragSensors = () => {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
};

// Types for each collection
interface Highlight {
  $id?: string;
  type: 'photo' | 'video';
  mediaId: string;
  mediaUrl?: string;
  order: number;
  isActive: boolean;
}

interface Sponsor {
  $id?: string;
  name: string;
  logoId: string;
  logoUrl?: string;
  website: string;
  tier: SponsorTier;
  order: number;
  isActive: boolean;
}

interface TeamMember {
  $id?: string;
  name: string;
  role: string;
  bio: string;
  photoId: string;
  photoUrl?: string;
  linkedin?: string;
  twitter?: string;
  category: 'core' | 'volunteer';
  order: number;
  isActive: boolean;
}

interface Testimonial {
  $id?: string;
  name: string;
  role: string;
  company: string;
  content: string;
  photoId: string;
  photoUrl?: string;
  rating: number;
  isActive: boolean;
}

interface AboutContent {
  $id?: string;
  title: string;
  description: string;
  mission: string;
  vision: string;
  eventDate: string;
  eventVenue: string;
  expectedAttendees: number;
}

interface SitePhoto {
  $id?: string;
  title: string;
  photoId: string;
  photoUrl?: string;
  section: 'hero' | 'about' | 'both';
  order: number;
  isActive: boolean;
}

interface FAQItem {
  $id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}


interface Speaker {
  $id?: string;
  name: string;
  title: string;
  company: string;
  bio?: string;
  topic?: string;
  photoId?: string;
  photoUrl?: string;
  linkedin?: string;
  twitter?: string;
  order?: number;
  isKeynote?: boolean;
  isActive?: boolean;
}

interface Panelist {
  $id?: string;
  name: string;
  title: string;
  company: string;
  bio?: string;
  photoId?: string;
  photoUrl?: string;
  linkedin?: string;
  twitter?: string;
  order?: number;
  isModerator?: boolean;
  isActive?: boolean;
}

interface CommunityApplicationItem {
  $id?: string;
  role: ApplicationRole;
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  experience?: string;
  motivation: string;
  availability?: string;
  topicTitle?: string;
  topicAbstract?: string;
  sessionType?: string;
  priorSpeaking?: string;
  userId?: string;
  status: ApplicationStatus;
  submittedAt: string;
}

interface AnnouncementItem {
  $id?: string;
  message: string;
  meetupLink: string;
  isActive: boolean;
  order: number;
}

const Dashboard = () => {
  const { user, logout, loading: authLoading, isAdmin, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('highlights');

  // Data states
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [panelists, setPanelists] = useState<Panelist[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [sitePhotos, setSitePhotos] = useState<SitePhoto[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);

  // Loading states
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch data when admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      fetchAllData();
    }
  }, [user, authLoading, isAdmin]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/dashboard/login');
    }
  }, [user, authLoading, navigate]);

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      await Promise.all([
        fetchHighlights(),
        fetchSponsors(),
        fetchTeam(),
        fetchSpeakers(),
        fetchPanelists(),
        fetchTestimonials(),
        fetchAbout(),
        fetchSitePhotos(),
        fetchFAQs(),
        fetchAnnouncements()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchHighlights = async () => {
    try {
      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.HIGHLIGHTS,
        queries: [Query.limit(100), Query.orderAsc('order')]
      });
      setHighlights(response.documents.map(doc => ({
        ...doc,
        mediaUrl: doc.mediaId ? getFilePreview(doc.mediaId) : ''
      })) as unknown as Highlight[]);
    } catch (error) {
      console.error('Error fetching highlights:', error);
    }
  };

  const fetchSponsors = async () => {
    try {
      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.SPONSORS,
        queries: [
          Query.limit(100),
          Query.orderAsc('order'),
          Query.equal('tier', [...TIER_VALUES])
        ]
      });
      setSponsors(response.documents.map(doc => ({
        ...doc,
        logoUrl: doc.logoId ? getFilePreview(doc.logoId) : ''
      })) as unknown as Sponsor[]);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    }
  };

  const fetchTeam = async () => {
    try {
      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.TEAM,
        queries: [Query.limit(100), Query.orderAsc('order')]
      });
      setTeam(response.documents.map(doc => ({
        ...doc,
        photoUrl: doc.photoId ? getFilePreview(doc.photoId) : ''
      })) as unknown as TeamMember[]);
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  const fetchSpeakers = async () => {
    try {
      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.SPEAKERS,
        queries: [Query.limit(100), Query.orderAsc('order')]
      });
      setSpeakers(response.documents.map(doc => ({
        ...doc,
        photoUrl: doc.photoId ? getFilePreview(doc.photoId) : ''
      })) as unknown as Speaker[]);
    } catch (error) {
      console.error('Error fetching speakers:', error);
    }
  };

  const fetchPanelists = async () => {
    try {
      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.PANELISTS,
        queries: [Query.limit(100), Query.orderAsc('order')]
      });
      setPanelists(response.documents.map(doc => ({
        ...doc,
        photoUrl: doc.photoId ? getFilePreview(doc.photoId) : ''
      })) as unknown as Panelist[]);
    } catch (error) {
      console.error('Error fetching panelists:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.TESTIMONIALS,
        queries: [Query.limit(100)]
      });
      setTestimonials(response.documents.map(doc => ({
        ...doc,
        photoUrl: doc.photoId ? getFilePreview(doc.photoId) : ''
      })) as unknown as Testimonial[]);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const fetchAbout = async () => {
    try {
      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.ABOUT,
        queries: [Query.limit(1)]
      });
      if (response.documents.length > 0) {
        setAbout(response.documents[0] as unknown as AboutContent);
      }
    } catch (error) {
      console.error('Error fetching about:', error);
    }
  };

  const fetchFAQs = async () => {
    try {
      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.FAQ,
        queries: [Query.limit(100), Query.orderAsc('order')]
      });
      setFaqs(response.documents as unknown as FAQItem[]);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.ANNOUNCEMENTS,
        queries: [Query.limit(100), Query.orderAsc('order')]
      });
      setAnnouncements(response.documents as unknown as AnnouncementItem[]);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchSitePhotos = async () => {
    try {
      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.SITE_PHOTOS,
        queries: [Query.limit(200), Query.orderAsc('order')]
      });
      setSitePhotos(response.documents.map(doc => ({
        ...doc,
        photoUrl: doc.photoId ? getFilePreview(doc.photoId) : ''
      })) as unknown as SitePhoto[]);
    } catch (error) {
      console.error('Error fetching site photos:', error);
      setSitePhotos([]);
    }
  };


  // File upload helper
  const uploadFile = async (file: File): Promise<string> => {
    const response = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);
    return response.$id;
  };

  // Generic CRUD operations
  const createDocument = async (collectionId: string, data: any, file?: File, fileField?: string) => {
    setSaving(true);
    try {
      let fileId = '';
      if (file && fileField) {
        fileId = await uploadFile(file);
        data[fileField] = fileId;
      }

      await databases.createDocument({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: collectionId,
        documentId: ID.unique(),
        data: data
      });
      toast({ title: 'Success', description: 'Item created successfully' });
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateDocument = async (collectionId: string, documentId: string, data: any, file?: File, fileField?: string) => {
    setSaving(true);
    try {
      if (file && fileField) {
        const fileId = await uploadFile(file);
        data[fileField] = fileId;
      }

      // Remove system fields
      const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...cleanData } = data;

      await databases.updateDocument({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: collectionId,
        documentId: documentId,
        data: cleanData
      });
      toast({ title: 'Success', description: 'Item updated successfully' });
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteDocument = async (collectionId: string, documentId: string) => {
    setSaving(true);
    try {
      await databases.deleteDocument({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: collectionId,
        documentId: documentId
      });
      toast({ title: 'Success', description: 'Item deleted successfully' });
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Batch-update order for items after drag reorder
  const reorderDocuments = useCallback(async (
    collectionId: string,
    items: { $id?: string; order: number }[]
  ) => {
    try {
      await Promise.all(
        items.map((item, index) => {
          if (!item.$id) return Promise.resolve();
          return databases.updateDocument({
            databaseId: APPWRITE_DATABASE_ID,
            collectionId,
            documentId: item.$id,
            data: { order: index }
          });
        })
      );
      toast({ title: 'Reordered', description: 'Order saved successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to save order: ' + error.message, variant: 'destructive' });
    }
  }, [toast]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/dashboard/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Loading states
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return <MemberDashboard />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">AWS User Group Pune</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              View Site
            </Button>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.name || user.email}</p>
              <Badge variant="secondary" className="text-xs capitalize">{role}</Badge>
            </div>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-full sm:w-auto">
              <TabsTrigger value="highlights" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Highlights</span>
              </TabsTrigger>
              <TabsTrigger value="site-photos" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Site Photos</span>
              </TabsTrigger>
              {/* <TabsTrigger value="sponsors" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Sponsors</span>
              </TabsTrigger> */}
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
              {/* <TabsTrigger value="speakers" className="flex items-center gap-2">
                <Mic2 className="h-4 w-4" />
                <span className="hidden sm:inline">Speakers</span>
              </TabsTrigger>
              <TabsTrigger value="panelists" className="flex items-center gap-2">
                <Users2 className="h-4 w-4" />
                <span className="hidden sm:inline">Panelists</span>
              </TabsTrigger> */}
              <TabsTrigger value="testimonials" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Testimonials</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">About</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="announcements" className="flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                <span className="hidden sm:inline">Announcements</span>
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <HandHeart className="h-4 w-4" />
                <span className="hidden sm:inline">Applications</span>
              </TabsTrigger>

            </TabsList>
          </ScrollArea>

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Highlights Tab */}
              <TabsContent value="highlights">
                <HighlightsManager
                  highlights={highlights}
                  onRefresh={fetchHighlights}
                  onCreate={createDocument}
                  onUpdate={updateDocument}
                  onDelete={deleteDocument}
                  onReorder={reorderDocuments}
                  saving={saving}
                />
              </TabsContent>

              <TabsContent value="site-photos">
                <SitePhotosManager
                  sitePhotos={sitePhotos}
                  onRefresh={fetchSitePhotos}
                  onCreate={createDocument}
                  onUpdate={updateDocument}
                  onDelete={deleteDocument}
                  onReorder={reorderDocuments}
                  saving={saving}
                />
              </TabsContent>

              {/* Sponsors Tab
              <TabsContent value="sponsors">
                <SponsorsManager
                  sponsors={sponsors}
                  onRefresh={fetchSponsors}
                  onCreate={createDocument}
                  onUpdate={updateDocument}
                  onDelete={deleteDocument}
                  onReorder={reorderDocuments}
                  saving={saving}
                />
              </TabsContent> */}

              {/* Team Tab */}
              <TabsContent value="team">
                <TeamManager
                  team={team}
                  onRefresh={fetchTeam}
                  onCreate={createDocument}
                  onUpdate={updateDocument}
                  onDelete={deleteDocument}
                  onReorder={reorderDocuments}
                  saving={saving}
                />
              </TabsContent>

              {/* Speakers Tab
              <TabsContent value="speakers">
                <SpeakersManager
                  speakers={speakers}
                  onRefresh={fetchSpeakers}
                  onCreate={createDocument}
                  onUpdate={updateDocument}
                  onDelete={deleteDocument}
                  onReorder={reorderDocuments}
                  saving={saving}
                />
              </TabsContent> */}

              {/* Panelists Tab
              <TabsContent value="panelists">
                <PanelistsManager
                  panelists={panelists}
                  onRefresh={fetchPanelists}
                  onCreate={createDocument}
                  onUpdate={updateDocument}
                  onDelete={deleteDocument}
                  onReorder={reorderDocuments}
                  saving={saving}
                />
              </TabsContent> */}

              {/* Testimonials Tab */}
              <TabsContent value="testimonials">
                <TestimonialsManager
                  testimonials={testimonials}
                  onRefresh={fetchTestimonials}
                  onCreate={createDocument}
                  onUpdate={updateDocument}
                  onDelete={deleteDocument}
                  onReorder={reorderDocuments}
                  saving={saving}
                />
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about">
                <AboutManager
                  about={about}
                  onRefresh={fetchAbout}
                  onCreate={createDocument}
                  onUpdate={updateDocument}
                  saving={saving}
                />
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq">
                <FAQManager
                  faqs={faqs}
                  onRefresh={fetchFAQs}
                  onCreate={createDocument}
                  onUpdate={updateDocument}
                  onDelete={deleteDocument}
                  onReorder={reorderDocuments}
                  saving={saving}
                />
              </TabsContent>

              {/* Announcements Tab */}
              <TabsContent value="announcements">
                <AnnouncementsManager
                  announcements={announcements}
                  onRefresh={fetchAnnouncements}
                  onCreate={createDocument}
                  onUpdate={updateDocument}
                  onDelete={deleteDocument}
                  onReorder={reorderDocuments}
                  saving={saving}
                />
              </TabsContent>

              {/* Community Applications Tab */}
              <TabsContent value="applications">
                <CommunityApplicationsManager />
              </TabsContent>

            </>
          )}
        </Tabs>
      </main>
    </div>
  );
};

// ============ Manager Components ============

interface ManagerProps<T> {
  onRefresh: () => Promise<void>;
  onCreate: (collectionId: string, data: any, file?: File, fileField?: string) => Promise<boolean>;
  onUpdate: (collectionId: string, documentId: string, data: any, file?: File, fileField?: string) => Promise<boolean>;
  onDelete: (collectionId: string, documentId: string) => Promise<boolean>;
  onReorder: (collectionId: string, items: { $id?: string; order: number }[]) => Promise<void>;
  saving: boolean;
}

// Highlights Manager
const HighlightsManager = ({ highlights, onRefresh, onCreate, onUpdate, onDelete, onReorder, saving }: ManagerProps<Highlight> & { highlights: Highlight[] }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Highlight | null>(null);
  const [formData, setFormData] = useState<Partial<Highlight>>({ type: 'photo', order: 0, isActive: true });
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState(highlights);
  const sensors = useDragSensors();

  useEffect(() => { setItems(highlights); }, [highlights]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.$id === active.id);
    const newIndex = items.findIndex(i => i.$id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    await onReorder(COLLECTIONS.HIGHLIGHTS, newItems as any);
    await onRefresh();
  };

  const handleSubmit = async () => {
    const success = editItem?.$id
      ? await onUpdate(COLLECTIONS.HIGHLIGHTS, editItem.$id, { ...formData }, file || undefined, 'mediaId')
      : await onCreate(COLLECTIONS.HIGHLIGHTS, { ...formData }, file || undefined, 'mediaId');

    if (success) {
      setDialogOpen(false);
      setEditItem(null);
      setFormData({ type: 'photo', order: 0, isActive: true });
      setFile(null);
      await onRefresh();
    }
  };

  const openEdit = (item: Highlight) => {
    setEditItem(item);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await onDelete(COLLECTIONS.HIGHLIGHTS, id);
    if (success) await onRefresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Event Highlights
          </CardTitle>
          <CardDescription>Manage photos and videos from past events. Drag to reorder.</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditItem(null); setFormData({ type: 'photo', order: 0, isActive: true }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Highlight
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit Highlight' : 'Add Highlight'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v: 'photo' | 'video') => setFormData({ ...formData, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Media File</Label>
                <Input type="file" accept={formData.type === 'video' ? 'video/*' : 'image/*'} onChange={e => setFile(e.target.files?.[0] || null)} />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={v => setFormData({ ...formData, isActive: v })} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.$id!)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => (
                <SortableCardItem key={item.$id} id={item.$id!}>
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      {item.mediaUrl ? (
                        item.type === 'video' ? (
                          <Video className="h-12 w-12 text-muted-foreground" />
                        ) : (
                          <img src={item.mediaUrl} alt="Highlight" className="w-full h-full object-cover" />
                        )
                      ) : (
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={item.type === 'video' ? 'secondary' : 'default'}>{item.type}</Badge>
                            {!item.isActive && <Badge variant="outline">Inactive</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Highlight?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item.$id!)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SortableCardItem>
              ))}
              {items.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No highlights yet. Add your first one!
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

// Site Photos Manager (used by Hero + About)
const SitePhotosManager = ({ sitePhotos, onRefresh, onCreate, onUpdate, onDelete, onReorder, saving }: ManagerProps<SitePhoto> & { sitePhotos: SitePhoto[] }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<SitePhoto | null>(null);
  const [formData, setFormData] = useState<Partial<SitePhoto>>({
    title: '',
    section: 'both',
    order: 0,
    isActive: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState(sitePhotos);
  const sensors = useDragSensors();

  useEffect(() => { setItems(sitePhotos); }, [sitePhotos]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.$id === active.id);
    const newIndex = items.findIndex(i => i.$id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    await onReorder(COLLECTIONS.SITE_PHOTOS, newItems as any);
    await onRefresh();
  };

  const handleSubmit = async () => {
    const success = editItem?.$id
      ? await onUpdate(COLLECTIONS.SITE_PHOTOS, editItem.$id, { ...formData }, file || undefined, 'photoId')
      : await onCreate(COLLECTIONS.SITE_PHOTOS, { ...formData }, file || undefined, 'photoId');

    if (success) {
      setDialogOpen(false);
      setEditItem(null);
      setFormData({ title: '', section: 'both', order: 0, isActive: true });
      setFile(null);
      await onRefresh();
    }
  };

  const openEdit = (item: SitePhoto) => {
    setEditItem(item);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await onDelete(COLLECTIONS.SITE_PHOTOS, id);
    if (success) await onRefresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Site Photos
          </CardTitle>
          <CardDescription>Manage photos used by Hero and About sections</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditItem(null); setFormData({ title: '', section: 'both', order: 0, isActive: true }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit Site Photo' : 'Add Site Photo'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Community Meetup Moment" />
              </div>
              <div>
                <Label>Section</Label>
                <Select
                  value={formData.section || 'both'}
                  onValueChange={(v: 'hero' | 'about' | 'both') => setFormData({ ...formData, section: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both</SelectItem>
                    <SelectItem value="hero">Hero Only</SelectItem>
                    <SelectItem value="about">About Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Photo</Label>
                <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={v => setFormData({ ...formData, isActive: v })} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.$id!)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <SortableCardItem key={item.$id} id={item.$id!}>
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      {item.photoUrl ? (
                        <img src={item.photoUrl} alt={item.title || 'Site Photo'} className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-sm">{item.title || 'Untitled'}</h4>
                          <Badge variant="outline" className="mt-2 capitalize">{item.section || 'both'}</Badge>
                          {!item.isActive && <Badge variant="secondary" className="mt-2 ml-2">Inactive</Badge>}
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Site Photo?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item.$id!)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SortableCardItem>
              ))}
              {items.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No site photos yet. Upload photos for Hero and About sections.
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

// Sponsors Manager
const SponsorsManager = ({ sponsors, onRefresh, onCreate, onUpdate, onDelete, onReorder, saving }: ManagerProps<Sponsor> & { sponsors: Sponsor[] }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Sponsor | null>(null);
  const [formData, setFormData] = useState<Partial<Sponsor>>({ name: '', website: '', tier: 'gold', order: 0, isActive: true });
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState(sponsors);
  const sensors = useDragSensors();

  useEffect(() => { setItems(sponsors); }, [sponsors]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.$id === active.id);
    const newIndex = items.findIndex(i => i.$id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    await onReorder(COLLECTIONS.SPONSORS, newItems as any);
    await onRefresh();
  };

  const tierColors = TIER_BADGE_COLORS;

  const handleSubmit = async () => {
    const success = editItem?.$id
      ? await onUpdate(COLLECTIONS.SPONSORS, editItem.$id, { ...formData }, file || undefined, 'logoId')
      : await onCreate(COLLECTIONS.SPONSORS, { ...formData }, file || undefined, 'logoId');

    if (success) {
      setDialogOpen(false);
      setEditItem(null);
      setFormData({ name: '', website: '', tier: 'gold', order: 0, isActive: true });
      setFile(null);
      await onRefresh();
    }
  };

  const openEdit = (item: Sponsor) => {
    setEditItem(item);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await onDelete(COLLECTIONS.SPONSORS, id);
    if (success) await onRefresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Sponsors
          </CardTitle>
          <CardDescription>Manage event sponsors and partners</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditItem(null); setFormData({ name: '', website: '', tier: 'gold', order: 0, isActive: true }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit Sponsor' : 'Add Sponsor'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <Label>Website</Label>
                <Input value={formData.website || ''} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://" />
              </div>
              <div>
                <Label>Tier</Label>
                <Select value={formData.tier} onValueChange={(v: SponsorTier) => setFormData({ ...formData, tier: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SPONSOR_TIERS.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.emoji} {t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Logo</Label>
                <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={v => setFormData({ ...formData, isActive: v })} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.$id!)} strategy={rectSortingStrategy}>
            {(() => {
              const tierOrder = TIER_VALUES;
              const tierLabels = TIER_LABELS;
              const grouped = tierOrder.map(tier => ({
                tier,
                label: tierLabels[tier],
                tierItems: items.filter(s => s.tier === tier),
              }));

              return items.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No sponsors yet. Add your first one!
                </div>
              ) : (
                <div className="space-y-8">
                  {grouped.map(({ tier, label, tierItems }) =>
                    tierItems.length > 0 ? (
                      <div key={tier}>
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${tierColors[tier]} text-sm px-3 py-1`}>{label}</Badge>
                          <span className="text-xs text-muted-foreground">({tierItems.length})</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {tierItems.map(item => (
                            <SortableCardItem key={item.$id} id={item.$id!}>
                              <Card className="overflow-hidden">
                                <div className="aspect-[2/1] bg-muted flex items-center justify-center p-4">
                                  {item.logoUrl ? (
                                    <img src={item.logoUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                                  ) : (
                                    <Star className="h-8 w-8 text-muted-foreground" />
                                  )}
                                </div>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-medium">{item.name}</h4>
                                      {!item.isActive && <Badge variant="outline" className="mt-1">Inactive</Badge>}
                                    </div>
                                    <div className="flex gap-1">
                                      <Button size="icon" variant="ghost" onClick={() => openEdit(item)}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button size="icon" variant="ghost" className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Sponsor?</AlertDialogTitle>
                                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(item.$id!)}>Delete</AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </SortableCardItem>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              );
            })()}
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

// Team Manager
const TeamManager = ({ team, onRefresh, onCreate, onUpdate, onDelete, onReorder, saving }: ManagerProps<TeamMember> & { team: TeamMember[] }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({ name: '', role: '', bio: '', category: 'core', order: 0, isActive: true });
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState(team);
  const sensors = useDragSensors();

  useEffect(() => { setItems(team); }, [team]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.$id === active.id);
    const newIndex = items.findIndex(i => i.$id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    await onReorder(COLLECTIONS.TEAM, newItems as any);
    await onRefresh();
  };

  const handleSubmit = async () => {
    const success = editItem?.$id
      ? await onUpdate(COLLECTIONS.TEAM, editItem.$id, { ...formData }, file || undefined, 'photoId')
      : await onCreate(COLLECTIONS.TEAM, { ...formData }, file || undefined, 'photoId');

    if (success) {
      setDialogOpen(false);
      setEditItem(null);
      setFormData({ name: '', role: '', bio: '', category: 'core', order: 0, isActive: true });
      setFile(null);
      await onRefresh();
    }
  };

  const openEdit = (item: TeamMember) => {
    setEditItem(item);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await onDelete(COLLECTIONS.TEAM, id);
    if (success) await onRefresh();
  };

  const groupedTeam = {
    core: team.filter(m => m.category === 'core'),
    volunteer: team.filter(m => m.category === 'volunteer'),
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>Manage organizers and volunteers</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditItem(null); setFormData({ name: '', role: '', bio: '', category: 'core', order: 0, isActive: true }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit Member' : 'Add Member'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g., Lead Organizer" />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea value={formData.bio || ''} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v: TeamMember['category']) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core">Core Team</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Photo</Label>
                <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input value={formData.linkedin || ''} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} />
                </div>
                <div>
                  <Label>Twitter URL</Label>
                  <Input value={formData.twitter || ''} onChange={e => setFormData({ ...formData, twitter: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={v => setFormData({ ...formData, isActive: v })} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.$id!)} strategy={rectSortingStrategy}>
            {(['core', 'volunteer'] as const).map(category => {
              const categoryItems = items.filter(m => m.category === category);
              return (
                <div key={category}>
                  <h3 className="font-semibold mb-3 capitalize">{category === 'core' ? 'Core Team' : 'Volunteers'}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categoryItems.map(member => (
                      <SortableCardItem key={member.$id} id={member.$id!}>
                        <Card className="overflow-hidden">
                          <div className="aspect-square bg-muted flex items-center justify-center">
                            {member.photoUrl ? (
                              <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <Users className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm truncate">{member.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                            <div className="flex gap-1 mt-2">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(member)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Member?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(member.$id!)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      </SortableCardItem>
                    ))}
                    {categoryItems.length === 0 && (
                      <div className="col-span-full text-center py-6 text-muted-foreground text-sm">
                        No {category} members yet
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

// Speakers Manager
const SpeakersManager = ({ speakers, onRefresh, onCreate, onUpdate, onDelete, onReorder, saving }: ManagerProps<Speaker> & { speakers: Speaker[] }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Speaker | null>(null);
  const [formData, setFormData] = useState<Partial<Speaker>>({
    name: '',
    title: '',
    company: '',
    bio: '',
    topic: '',
    linkedin: '',
    twitter: '',
    order: 0,
    isKeynote: false,
    isActive: true
  });
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState(speakers);
  const sensors = useDragSensors();

  useEffect(() => { setItems(speakers); }, [speakers]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.$id === active.id);
    const newIndex = items.findIndex(i => i.$id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    await onReorder(COLLECTIONS.SPEAKERS, newItems as any);
    await onRefresh();
  };

  const handleSubmit = async () => {
    const success = editItem?.$id
      ? await onUpdate(COLLECTIONS.SPEAKERS, editItem.$id, { ...formData }, file || undefined, 'photoId')
      : await onCreate(COLLECTIONS.SPEAKERS, { ...formData }, file || undefined, 'photoId');

    if (success) {
      setDialogOpen(false);
      setEditItem(null);
      setFormData({ name: '', title: '', company: '', bio: '', topic: '', linkedin: '', twitter: '', order: 0, isKeynote: false, isActive: true });
      setFile(null);
      await onRefresh();
    }
  };

  const openEdit = (item: Speaker) => {
    setEditItem(item);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await onDelete(COLLECTIONS.SPEAKERS, id);
    if (success) await onRefresh();
  };

  const keynoteSpeakers = items.filter(s => s.isKeynote);
  const regularSpeakers = items.filter(s => !s.isKeynote);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Mic2 className="h-5 w-5" />
            Speakers
          </CardTitle>
          <CardDescription>Manage keynote and session speakers</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditItem(null);
              setFormData({ name: '', title: '', company: '', bio: '', topic: '', linkedin: '', twitter: '', order: 0, isKeynote: false, isActive: true });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Speaker
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit Speaker' : 'Add Speaker'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Dr. Werner Vogels" />
                </div>
                <div>
                  <Label>Title *</Label>
                  <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="VP & CTO" />
                </div>
              </div>
              <div>
                <Label>Company *</Label>
                <Input value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="Amazon Web Services" />
              </div>
              <div>
                <Label>Topic</Label>
                <Input value={formData.topic || ''} onChange={e => setFormData({ ...formData, topic: e.target.value })} placeholder="Building for the Future: AI-Driven Cloud Architecture" />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={formData.bio || ''}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Speaker biography..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Photo</Label>
                <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input value={formData.linkedin || ''} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <Label>Twitter Handle</Label>
                  <Input value={formData.twitter || ''} onChange={e => setFormData({ ...formData, twitter: e.target.value })} placeholder="@username" />
                </div>
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={formData.isKeynote} onCheckedChange={v => setFormData({ ...formData, isKeynote: v })} />
                  <Label>Keynote Speaker</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.isActive} onCheckedChange={v => setFormData({ ...formData, isActive: v })} />
                  <Label>Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.$id!)} strategy={rectSortingStrategy}>
        {/* Keynote Speakers */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Badge variant="default" className="bg-amber-500">Keynote</Badge>
            Keynote Speakers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keynoteSpeakers.map(speaker => (
              <SortableCardItem key={speaker.$id} id={speaker.$id!}>
                <Card className="overflow-hidden border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {speaker.photoUrl ? (
                        <img src={speaker.photoUrl} alt={speaker.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Mic2 className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{speaker.name}</h4>
                          <p className="text-sm text-muted-foreground">{speaker.title}</p>
                          <p className="text-sm text-primary">@ {speaker.company}</p>
                          {speaker.topic && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">"{speaker.topic}"</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(speaker)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Speaker?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(speaker.$id!)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {!speaker.isActive && <Badge variant="outline">Inactive</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </SortableCardItem>
            ))}
            {keynoteSpeakers.length === 0 && (
              <div className="col-span-full text-center py-6 text-muted-foreground text-sm">
                No keynote speakers yet
              </div>
            )}
          </div>
        </div>

        {/* Session Speakers */}
        <div>
          <h3 className="font-semibold mb-3">Session Speakers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {regularSpeakers.map(speaker => (
              <SortableCardItem key={speaker.$id} id={speaker.$id!}>
                <Card className="overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {speaker.photoUrl ? (
                    <img src={speaker.photoUrl} alt={speaker.name} className="w-full h-full object-cover" />
                  ) : (
                    <Mic2 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm truncate">{speaker.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{speaker.title}</p>
                  <p className="text-xs text-primary truncate">@ {speaker.company}</p>
                  <div className="flex gap-1 mt-2">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(speaker)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Speaker?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(speaker.$id!)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
              </SortableCardItem>
            ))}
            {regularSpeakers.length === 0 && (
              <div className="col-span-full text-center py-6 text-muted-foreground text-sm">
                No session speakers yet
              </div>
            )}
          </div>
        </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

// Panelists Manager
const PanelistsManager = ({ panelists, onRefresh, onCreate, onUpdate, onDelete, onReorder, saving }: ManagerProps<Panelist> & { panelists: Panelist[] }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Panelist | null>(null);
  const [formData, setFormData] = useState<Partial<Panelist>>({
    name: '',
    title: '',
    company: '',
    bio: '',
    linkedin: '',
    twitter: '',
    order: 0,
    isModerator: false,
    isActive: true
  });
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState(panelists);
  const sensors = useDragSensors();

  useEffect(() => { setItems(panelists); }, [panelists]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.$id === active.id);
    const newIndex = items.findIndex(i => i.$id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    await onReorder(COLLECTIONS.PANELISTS, newItems as any);
    await onRefresh();
  };

  const handleSubmit = async () => {
    const success = editItem?.$id
      ? await onUpdate(COLLECTIONS.PANELISTS, editItem.$id, { ...formData }, file || undefined, 'photoId')
      : await onCreate(COLLECTIONS.PANELISTS, { ...formData }, file || undefined, 'photoId');

    if (success) {
      setDialogOpen(false);
      setEditItem(null);
      setFormData({ name: '', title: '', company: '', bio: '', linkedin: '', twitter: '', order: 0, isModerator: false, isActive: true });
      setFile(null);
      await onRefresh();
    }
  };

  const openEdit = (item: Panelist) => {
    setEditItem(item);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await onDelete(COLLECTIONS.PANELISTS, id);
    if (success) await onRefresh();
  };

  const moderators = items.filter(p => p.isModerator);
  const regularPanelists = items.filter(p => !p.isModerator);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="h-5 w-5" />
            Panelists
          </CardTitle>
          <CardDescription>Manage panel moderator and members</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditItem(null);
              setFormData({ name: '', title: '', company: '', bio: '', linkedin: '', twitter: '', order: 0, isModerator: false, isActive: true });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Panelist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit Panelist' : 'Add Panelist'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Afreen Bano" />
                </div>
                <div>
                  <Label>Title *</Label>
                  <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Cloud Tech Lead" />
                </div>
              </div>
              <div>
                <Label>Company *</Label>
                <Input value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="AWS Community" />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={formData.bio || ''}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Panelist biography..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Photo</Label>
                <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input value={formData.linkedin || ''} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <Label>Twitter Handle</Label>
                  <Input value={formData.twitter || ''} onChange={e => setFormData({ ...formData, twitter: e.target.value })} placeholder="@username" />
                </div>
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={formData.isModerator} onCheckedChange={v => setFormData({ ...formData, isModerator: v })} />
                  <Label>Panel Moderator</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.isActive} onCheckedChange={v => setFormData({ ...formData, isActive: v })} />
                  <Label>Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.$id!)} strategy={rectSortingStrategy}>
        {/* Moderators */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Badge variant="default" className="bg-cyan-500">Moderator</Badge>
            Panel Moderators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moderators.map(panelist => (
              <SortableCardItem key={panelist.$id} id={panelist.$id!}>
                <Card className="overflow-hidden border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {panelist.photoUrl ? (
                        <img src={panelist.photoUrl} alt={panelist.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Users2 className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{panelist.name}</h4>
                          <p className="text-sm text-muted-foreground">{panelist.title}</p>
                          <p className="text-sm text-primary">@ {panelist.company}</p>
                          {panelist.bio && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">{panelist.bio}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(panelist)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Panelist?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(panelist.$id!)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {!panelist.isActive && <Badge variant="outline">Inactive</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </SortableCardItem>
            ))}
            {moderators.length === 0 && (
              <div className="col-span-full text-center py-6 text-muted-foreground text-sm">
                No moderators yet
              </div>
            )}
          </div>
        </div>

        {/* Regular Panelists */}
        <div>
          <h3 className="font-semibold mb-3">Panel Members</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {regularPanelists.map(panelist => (
              <SortableCardItem key={panelist.$id} id={panelist.$id!}>
                <Card className="overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {panelist.photoUrl ? (
                    <img src={panelist.photoUrl} alt={panelist.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users2 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm truncate">{panelist.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{panelist.title}</p>
                  <p className="text-xs text-primary truncate">@ {panelist.company}</p>
                  <div className="flex gap-1 mt-2">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(panelist)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Panelist?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(panelist.$id!)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
              </SortableCardItem>
            ))}
            {regularPanelists.length === 0 && (
              <div className="col-span-full text-center py-6 text-muted-foreground text-sm">
                No panelists yet
              </div>
            )}
          </div>
        </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

// Testimonials Manager
const TestimonialsManager = ({ testimonials, onRefresh, onCreate, onUpdate, onDelete, onReorder, saving }: ManagerProps<Testimonial> & { testimonials: Testimonial[] }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({ name: '', role: '', company: '', content: '', rating: 5, isActive: true });
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState(testimonials);
  const sensors = useDragSensors();

  useEffect(() => { setItems(testimonials); }, [testimonials]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.$id === active.id);
    const newIndex = items.findIndex(i => i.$id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    await onReorder(COLLECTIONS.TESTIMONIALS, newItems as any);
    await onRefresh();
  };

  const handleSubmit = async () => {
    const success = editItem?.$id
      ? await onUpdate(COLLECTIONS.TESTIMONIALS, editItem.$id, { ...formData }, file || undefined, 'photoId')
      : await onCreate(COLLECTIONS.TESTIMONIALS, { ...formData }, file || undefined, 'photoId');

    if (success) {
      setDialogOpen(false);
      setEditItem(null);
      setFormData({ name: '', role: '', company: '', content: '', rating: 5, isActive: true });
      setFile(null);
      await onRefresh();
    }
  };

  const openEdit = (item: Testimonial) => {
    setEditItem(item);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await onDelete(COLLECTIONS.TESTIMONIALS, id);
    if (success) await onRefresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Testimonials
          </CardTitle>
          <CardDescription>Manage attendee testimonials and reviews</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditItem(null); setFormData({ name: '', role: '', company: '', content: '', rating: 5, isActive: true }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Role</Label>
                  <Input value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g., DevOps Engineer" />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Testimonial</Label>
                <Textarea value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={4} />
              </div>
              <div>
                <Label>Photo</Label>
                <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
              </div>
              <div>
                <Label>Rating (1-5)</Label>
                <Input type="number" min={1} max={5} value={formData.rating || 5} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={v => setFormData({ ...formData, isActive: v })} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.$id!)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(item => (
                <SortableCardItem key={item.$id} id={item.$id!}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.photoUrl ? (
                            <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                      <Users className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.role} at {item.company}</p>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < item.rating ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.$id!)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <p className="text-sm mt-2 line-clamp-3">{item.content}</p>
                  </div>
                </div>
              </CardContent>
                  </Card>
                </SortableCardItem>
              ))}
              {items.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No testimonials yet. Add your first one!
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

// About Manager
const AboutManager = ({ about, onRefresh, onCreate, onUpdate, saving }: Omit<ManagerProps<AboutContent>, 'onDelete'> & { about: AboutContent | null }) => {
  const [formData, setFormData] = useState<Partial<AboutContent>>({
    title: '',
    description: '',
    mission: '',
    vision: '',
    eventDate: '',
    eventVenue: '',
    expectedAttendees: 0
  });

  useEffect(() => {
    if (about) {
      setFormData(about);
    }
  }, [about]);

  const handleSubmit = async () => {
    const success = about?.$id
      ? await onUpdate(COLLECTIONS.ABOUT, about.$id, { ...formData })
      : await onCreate(COLLECTIONS.ABOUT, { ...formData });

    if (success) {
      await onRefresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          About Event
        </CardTitle>
        <CardDescription>Manage event information and details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-w-2xl">
          <div>
            <Label>Event Title</Label>
            <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="AWS Community Day Pune 2026" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Mission</Label>
              <Textarea value={formData.mission || ''} onChange={e => setFormData({ ...formData, mission: e.target.value })} rows={3} />
            </div>
            <div>
              <Label>Vision</Label>
              <Textarea value={formData.vision || ''} onChange={e => setFormData({ ...formData, vision: e.target.value })} rows={3} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Event Date</Label>
              <Input type="date" value={formData.eventDate || ''} onChange={e => setFormData({ ...formData, eventDate: e.target.value })} />
            </div>
            <div>
              <Label>Venue</Label>
              <Input value={formData.eventVenue || ''} onChange={e => setFormData({ ...formData, eventVenue: e.target.value })} />
            </div>
            <div>
              <Label>Expected Attendees</Label>
              <Input type="number" value={formData.expectedAttendees || 0} onChange={e => setFormData({ ...formData, expectedAttendees: parseInt(e.target.value) })} />
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// FAQ Manager
const FAQManager = ({ faqs, onRefresh, onCreate, onUpdate, onDelete, onReorder, saving }: ManagerProps<FAQItem> & { faqs: FAQItem[] }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<FAQItem | null>(null);
  const [formData, setFormData] = useState<Partial<FAQItem>>({ question: '', answer: '', category: 'General', order: 0, isActive: true });
  const [items, setItems] = useState(faqs);
  const sensors = useDragSensors();

  useEffect(() => { setItems(faqs); }, [faqs]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.$id === active.id);
    const newIndex = items.findIndex(i => i.$id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    await onReorder(COLLECTIONS.FAQ, newItems as any);
    await onRefresh();
  };

  const handleSubmit = async () => {
    const success = editItem?.$id
      ? await onUpdate(COLLECTIONS.FAQ, editItem.$id, { ...formData })
      : await onCreate(COLLECTIONS.FAQ, { ...formData });

    if (success) {
      setDialogOpen(false);
      setEditItem(null);
      setFormData({ question: '', answer: '', category: 'General', order: 0, isActive: true });
      await onRefresh();
    }
  };

  const openEdit = (item: FAQItem) => {
    setEditItem(item);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await onDelete(COLLECTIONS.FAQ, id);
    if (success) await onRefresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            FAQ
          </CardTitle>
          <CardDescription>Manage frequently asked questions</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditItem(null); setFormData({ question: '', answer: '', category: 'General', order: 0, isActive: true }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Question</Label>
                <Input value={formData.question || ''} onChange={e => setFormData({ ...formData, question: e.target.value })} />
              </div>
              <div>
                <Label>Answer</Label>
                <Textarea value={formData.answer || ''} onChange={e => setFormData({ ...formData, answer: e.target.value })} rows={4} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., General, Tickets, Venue" />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={v => setFormData({ ...formData, isActive: v })} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.$id!)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map(item => (
                <SortableListItem key={item.$id} id={item.$id!}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{item.category}</Badge>
                            {!item.isActive && <Badge variant="secondary">Inactive</Badge>}
                          </div>
                          <h4 className="font-medium">{item.question}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item.$id!)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SortableListItem>
              ))}
              {items.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No FAQs yet. Add your first one!
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};


// Announcements Manager
const AnnouncementsManager = ({ announcements, onRefresh, onCreate, onUpdate, onDelete, onReorder, saving }: ManagerProps<AnnouncementItem> & { announcements: AnnouncementItem[] }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<AnnouncementItem | null>(null);
  const [formData, setFormData] = useState<Partial<AnnouncementItem>>({
    message: '',
    meetupLink: '',
    isActive: true,
    order: 0,
  });
  const [items, setItems] = useState(announcements);
  const sensors = useDragSensors();

  useEffect(() => { setItems(announcements); }, [announcements]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.$id === active.id);
    const newIndex = items.findIndex(i => i.$id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    await onReorder(COLLECTIONS.ANNOUNCEMENTS, newItems as any);
    await onRefresh();
  };

  const handleSubmit = async () => {
    const success = editItem?.$id
      ? await onUpdate(COLLECTIONS.ANNOUNCEMENTS, editItem.$id, { ...formData })
      : await onCreate(COLLECTIONS.ANNOUNCEMENTS, { ...formData });

    if (success) {
      setDialogOpen(false);
      setEditItem(null);
      setFormData({ message: '', meetupLink: '', isActive: true, order: 0 });
      await onRefresh();
    }
  };

  const openEdit = (item: AnnouncementItem) => {
    setEditItem(item);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await onDelete(COLLECTIONS.ANNOUNCEMENTS, id);
    if (success) await onRefresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Event Announcements
          </CardTitle>
          <CardDescription>Manage marquee announcements shown on the homepage. Paste your Meetup event link and a short message.</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditItem(null); setFormData({ message: '', meetupLink: '', isActive: true, order: 0 }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Announcement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit Announcement' : 'Add Announcement'}</DialogTitle>
              <DialogDescription>Create a scrolling announcement that links to your Meetup event.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Message</Label>
                <Input
                  placeholder="🚀 Next Meetup: AWS GenAI Workshop — June 14, 2026"
                  value={formData.message || ''}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <div>
                <Label>Meetup Link</Label>
                <Input
                  placeholder="https://www.meetup.com/aws-user-group-pune/events/..."
                  value={formData.meetupLink || ''}
                  onChange={e => setFormData({ ...formData, meetupLink: e.target.value })}
                />
              </div>
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  value={formData.order || 0}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={v => setFormData({ ...formData, isActive: v })} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saving || !formData.message || !formData.meetupLink}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.$id!)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map(item => (
                <SortableListItem key={item.$id} id={item.$id!}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.message}</p>
                          <a
                            href={item.meetupLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#FF9900] hover:underline truncate block mt-1"
                          >
                            {item.meetupLink}
                          </a>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={item.isActive ? 'default' : 'outline'}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="secondary">Order: {item.order}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item.$id!)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SortableListItem>
              ))}
              {items.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No announcements yet. Add your first one to display the marquee on the homepage!
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

// ============ Community Applications Manager ============

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const STATUS_ICONS: Record<ApplicationStatus, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5" />,
  approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  rejected: <XCircle className="h-3.5 w-3.5" />,
};

const CommunityApplicationsManager = () => {
  const { toast } = useToast();
  const [roleFilter, setRoleFilter] = useState<ApplicationRole | undefined>();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | undefined>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { applications, loading, refetch } = useApplications({
    role: roleFilter,
    status: statusFilter,
  });

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      toast({ title: 'Updated', description: `Application ${newStatus}` });
      refetch();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HandHeart className="h-5 w-5" /> Community Applications
            </CardTitle>
            <CardDescription>
              Volunteer and speaker applications from Her Tech Era
            </CardDescription>
          </div>
          <Badge variant="secondary">{applications.length} total</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={roleFilter || 'all'}
              onValueChange={(v) => setRoleFilter(v === 'all' ? undefined : v as ApplicationRole)}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="speaker">Speaker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select
            value={statusFilter || 'all'}
            onValueChange={(v) => setStatusFilter(v === 'all' ? undefined : v as ApplicationStatus)}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No applications found.
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.$id}
                className="border rounded-lg overflow-hidden"
              >
                {/* Header row */}
                <button
                  onClick={() => toggleExpand(app.$id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{app.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${app.role === 'speaker' ? 'border-purple-500/30 text-purple-500' : 'border-blue-500/30 text-blue-500'}`}
                      >
                        {app.role === 'speaker' ? <Mic2 className="h-3 w-3 mr-1" /> : <HandHeart className="h-3 w-3 mr-1" />}
                        {app.role}
                      </Badge>
                      <Badge variant="outline" className={`text-xs capitalize ${STATUS_COLORS[app.status]}`}>
                        {STATUS_ICONS[app.status]}
                        <span className="ml-1">{app.status}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {app.email} · {new Date(app.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  {expandedId === app.$id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>

                {/* Expanded details */}
                {expandedId === app.$id && (
                  <div className="px-4 pb-4 border-t space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div>
                        <Label className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</Label>
                        <p className="text-sm mt-0.5">{app.phone || '—'}</p>
                      </div>
                      {app.linkedin && (
                        <div>
                          <Label className="text-xs text-muted-foreground flex items-center gap-1"><Linkedin className="h-3 w-3" /> LinkedIn</Label>
                          <a href={app.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-primary mt-0.5 flex items-center gap-1 hover:underline">
                            Profile <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {app.experience && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Experience</Label>
                        <p className="text-sm mt-0.5 whitespace-pre-wrap">{app.experience}</p>
                      </div>
                    )}

                    <div>
                      <Label className="text-xs text-muted-foreground">Motivation</Label>
                      <p className="text-sm mt-0.5 whitespace-pre-wrap">{app.motivation}</p>
                    </div>

                    {/* Volunteer-specific */}
                    {app.role === 'volunteer' && app.availability && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Availability</Label>
                        <p className="text-sm mt-0.5">{app.availability}</p>
                      </div>
                    )}

                    {/* Speaker-specific */}
                    {app.role === 'speaker' && (
                      <div className="space-y-3 rounded-md bg-accent/30 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Session Details</p>
                        {app.topicTitle && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Topic</Label>
                            <p className="text-sm font-medium mt-0.5">{app.topicTitle}</p>
                          </div>
                        )}
                        {app.topicAbstract && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Abstract</Label>
                            <p className="text-sm mt-0.5 whitespace-pre-wrap">{app.topicAbstract}</p>
                          </div>
                        )}
                        {app.sessionType && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Preferred Format</Label>
                            <p className="text-sm mt-0.5 capitalize">{app.sessionType}</p>
                          </div>
                        )}
                        {app.priorSpeaking && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Prior Experience</Label>
                            <p className="text-sm mt-0.5 whitespace-pre-wrap">{app.priorSpeaking}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs text-muted-foreground mr-2">Set status:</span>
                      {app.status !== 'approved' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 border-emerald-600/30 hover:bg-emerald-50" onClick={() => handleStatusChange(app.$id, 'approved')}>
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                        </Button>
                      )}
                      {app.status !== 'rejected' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-600/30 hover:bg-red-50" onClick={() => handleStatusChange(app.$id, 'rejected')}>
                          <XCircle className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      )}
                      {app.status !== 'pending' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs text-amber-600 border-amber-600/30 hover:bg-amber-50" onClick={() => handleStatusChange(app.$id, 'pending')}>
                          <Clock className="h-3 w-3 mr-1" /> Pending
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;