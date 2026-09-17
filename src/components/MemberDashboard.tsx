import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { avatars } from '@/lib/appwrite';
import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  LogOut,
  Home,
  Save,
  Loader2,
  Bell,
  BellRing,
  Cake,
  User,
  Mail,
  CalendarDays,
  Edit,
  Check,
  X
} from 'lucide-react';

/**
 * Member dashboard — shown to logged-in users without the admin label.
 * Contains profile management and notification settings.
 */
const MemberDashboard = () => {
  const { user, logout, completeProfile, updateName } = useAuth();
  const { status: notifStatus, requestPermission } = useNotifications();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [editName, setEditName] = useState(user?.name || '');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');

  // Load existing prefs
  useEffect(() => {
    if (user) {
      const prefs = (user.prefs || {}) as Record<string, unknown>;
      setBirthday((prefs['birthday'] as string) || '');
      setGender((prefs['gender'] as string) || '');
      setEditName(user.name || '');
    }
  }, [user]);

  if (!user) return null;

  const prefs = (user.prefs || {}) as Record<string, unknown>;
  const avatarUrl = (prefs['picture'] as string)
    || avatars.getInitials(user.name || user.email, 120, 120).toString();

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Update name if changed
      if (editName !== user.name && editName.trim()) {
        await updateName(editName.trim());
      }

      // Update prefs (birthday, gender)
      await completeProfile({ birthday, gender });

      toast({ title: '✅ Profile updated', description: 'Your changes have been saved.' });
      setIsEditing(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/dashboard/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const memberSince = new Date(user.$createdAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">My Dashboard</h1>
            <p className="text-sm text-muted-foreground">AWS User Group Pune</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              View Site
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={avatarUrl}
                  alt={user.name || 'Member'}
                  className="w-16 h-16 rounded-full border-2 border-primary/20 object-cover"
                />
                <div>
                  <CardTitle className="text-lg">{user.name || 'Member'}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    Member since {memberSince}
                  </p>
                </div>
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          {isEditing ? (
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-1.5">
                  <User className="h-4 w-4 text-primary" />
                  Display Name
                </Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-1.5">
                  <Cake className="h-4 w-4 text-primary" />
                  Birthday
                </Label>
                <Input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-1.5">
                  <User className="h-4 w-4 text-primary" />
                  Gender
                </Label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </CardContent>
          ) : (
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Cake className="h-3 w-3" /> Birthday
                  </p>
                  <p className="text-sm font-medium">
                    {birthday
                      ? new Date(birthday).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'Not set'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> Gender
                  </p>
                  <p className="text-sm font-medium capitalize">{gender || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {notifStatus === 'granted'
                ? <BellRing className="h-5 w-5 text-green-500" />
                : <Bell className="h-5 w-5 text-muted-foreground" />
              }
              Notifications
            </CardTitle>
            <CardDescription>
              Manage how you receive community updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">
                  {notifStatus === 'granted'
                    ? 'You\'re receiving push notifications'
                    : notifStatus === 'denied'
                      ? 'Notifications are blocked in your browser'
                      : 'Enable to get meetup updates and announcements'
                  }
                </p>
              </div>
              {notifStatus === 'granted' ? (
                <Badge variant="outline" className="text-green-600 border-green-600/30 bg-green-500/10">
                  <Check className="h-3 w-3 mr-1" /> Enabled
                </Badge>
              ) : notifStatus === 'denied' ? (
                <Badge variant="outline" className="text-destructive">
                  Blocked
                </Badge>
              ) : (
                <Button size="sm" variant="outline" onClick={requestPermission}>
                  <Bell className="h-4 w-4 mr-1.5" />
                  Enable
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MemberDashboard;
