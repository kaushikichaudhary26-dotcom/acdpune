import { useEffect, useState } from 'react';
import { databases, APPWRITE_DATABASE_ID, COLLECTIONS, Query, isAppwriteConfigured, getImageUrl } from '@/lib/appwrite';

export interface TeamMember {
  $id?: string;
  name: string;
  linkedin?: string;
  email?: string;
  twitter?: string;
  photoId?: string;
  photoUrl?: string;
  category?: 'core' | 'volunteer' | 'speaker';
  role?: string;
  isActive?: boolean;
  order?: number;
}

// Fallback data used when Appwrite is not configured (keeps existing site behavior)
const fallbackCore: TeamMember[] = [
  { name: 'Toshal Khawale', linkedin: 'https://linkedin.com/in/toshal-khawale/', email: '', twitter: '', category: 'core' },
  { name: 'Ameya Vaidya', linkedin: 'https://linkedin.com/in/ameya-vaidya-9a164317/', email: 'amyvaidya@gmail.com', twitter: '', category: 'core' },
  { name: 'Vipul Chaudhary', linkedin: 'https://linkedin.com/in/v-chaudhary/', email: '', twitter: '', category: 'core' },
  { name: 'Pulkit Kshirsagar', linkedin: 'https://linkedin.com/in/pulkit-kshirsagar/', email: '', twitter: '', category: 'core' },
  { name: 'AFREEN BANO', linkedin: 'https://linkedin.com/in/afreen-bano/', email: 'banoafreen786@gmail.com', twitter: '', category: 'core' },
];

const fallbackVolunteers: TeamMember[] = [
  { name: 'Aditya Kulkarni', linkedin: 'https://linkedin.com/in/aditya-kulkarni-b37b25200/', email: 'atharvapaithankar.rmdstic.entc@gmail.com', twitter: '', category: 'volunteer' },
  { name: 'Akanksha Jadhao', linkedin: 'https://linkedin.com/in/akanksha-jadhao/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Amlan Mohapatra', linkedin: 'https://linkedin.com/in/amlan-mohapatra/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Anjali Mishra', linkedin: 'https://linkedin.com/in/anjali-mishra-b221a01ba/', email: 'anjalimishra3969@gmail.com', twitter: '', category: 'volunteer' },
  { name: 'Atul Chaudhary', linkedin: 'https://linkedin.com/in/atul-chaudhary-5a6a30257/', email: 'atulchaudhary1210@gmail.com', twitter: '', category: 'volunteer' },
  { name: 'Corey Strausman', linkedin: 'https://linkedin.com/in/coreystrausman/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Dr. Bishwajit Mohapatra', linkedin: 'https://linkedin.com/in/biswajitmohapatra/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Gourav Singar', linkedin: 'https://linkedin.com/in/gourav-singar-31971b242/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Janhavi Ajmire', linkedin: 'https://linkedin.com/in/janhavi-ajmire-772415177/', email: 'ajmirejanhavi15@gmail.com', twitter: '', category: 'volunteer' },
  { name: 'María Encinar', linkedin: 'https://linkedin.com/in/mariaencinar/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Mukund Kulkarni', linkedin: 'https://linkedin.com/in/mukund-kulkarni-b43ba7249/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Mouna Neelakanta', linkedin: 'https://linkedin.com/in/mneelakanta/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Nikhil Ganorkar', linkedin: 'https://linkedin.com/in/nikhil-ganorkar-48351a191/', email: 'nikhilganorkar0@gmail.com', twitter: '', category: 'volunteer' },
  { name: 'Omkar Avasare', linkedin: 'https://linkedin.com/in/omkar-avasare/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Omshree Butani', linkedin: 'https://linkedin.com/in/omshree-butani/', email: 'omshreepatel.999@gmail.com', twitter: '', category: 'volunteer' },
  { name: 'Ridhima Kapoor', linkedin: 'https://linkedin.com/in/kapoor-ridhima/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Rohit Chavan', linkedin: 'https://linkedin.com/in/rohit-chavan03/', email: 'codewithrohitc@gmail.com', twitter: '', category: 'volunteer' },
  { name: 'Sanskruti Pawar', linkedin: 'https://linkedin.com/in/sanskrutiparmeshwarpawar/', email: 'sanskrutipawar00@gmail.com', twitter: '', category: 'volunteer' },
  { name: 'Shafraz Rahim', linkedin: 'https://linkedin.com/in/shafrazrahim/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Shobhit Verma', linkedin: 'https://linkedin.com/in/vershobhit/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Shubham Londhe', linkedin: 'https://linkedin.com/in/shubhamlondhe1996/', email: '', twitter: '', category: 'volunteer' },
  { name: 'Suhas Nidgundi', linkedin: 'https://linkedin.com/in/suhasnidgundi/', email: 'suhasnidgundi@gmail.com', twitter: '', category: 'volunteer' },
  { name: 'Swaati Deshmukh', linkedin: 'https://linkedin.com/in/swaati-deshmukh/', email: 'dswati.119@gmail.com', twitter: '', category: 'volunteer' },
  { name: 'Taylor Jacobsen', linkedin: 'https://linkedin.com/in/taylorjacobsen/', email: '', twitter: '', category: 'volunteer' },
];

export default function useTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchTeam = async () => {
      setLoading(true);

      if (!isAppwriteConfigured || !APPWRITE_DATABASE_ID) {
        // Use fallback if Appwrite isn't configured
        if (mounted) {
          setTeam([...fallbackCore, ...fallbackVolunteers]);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await databases.listDocuments({
          databaseId: APPWRITE_DATABASE_ID,
          collectionId: COLLECTIONS.TEAM,
          queries: [Query.limit(100), Query.orderAsc('order')],
        });

        const mapped = response.documents.map((doc: any) => ({
          ...doc,
          photoUrl: doc.photoId ? getImageUrl(doc.photoId) : '',
        })) as TeamMember[];

        if (mounted) setTeam(mapped);
      } catch (err: any) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTeam();

    return () => {
      mounted = false;
    };
  }, []);

  const core = team.filter(m => m.category === 'core');
  const volunteers = team.filter(m => m.category === 'volunteer');
  const speakers = team.filter(m => m.category === 'speaker');

  return { team, core, volunteers, speakers, loading, error };
}
