import { useEffect, useState } from 'react';
import { databases, APPWRITE_DATABASE_ID, COLLECTIONS, Query, isAppwriteConfigured, getImageUrl } from '@/lib/appwrite';

// Import panelist images
import drSunitaImage from '@/assets/panelist/Dr Sunita M Karad.jpeg';
import rahulSurekaImage from '@/assets/panelist/Rahul Sureka.jpeg';
import savindarPuriImage from '@/assets/panelist/Savindar Puri.png';
import priyankaSolankiImage from '@/assets/panelist/Priyanka Singh Solanki.jpeg';
import afreenBanoImage from '@/assets/panelist/Afreen Bano.jpeg';

export interface Panelist {
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

// Fallback data for demonstration when Appwrite is not configured
const fallbackPanelists: Panelist[] = [
    {
        name: 'Prof. Dr. Sunita M. Karad',
        title: 'Executive Director',
        company: 'MIT ADT University',
        photoUrl: drSunitaImage,
        order: 1,
        isModerator: false,
    },
    {
        name: 'Rahul Sureka',
        title: 'Enterprise Solution Architect',
        company: 'Amazon Web Services',
        photoUrl: rahulSurekaImage,
        order: 2,
        isModerator: false,
    },
    {
        name: 'Savindar Puri',
        title: 'Associate VP - DevSecOps and SRE',
        company: 'Zensar Technologies',
        photoUrl: savindarPuriImage,
        order: 3,
        isModerator: false,
    },
    {
        name: 'Priyanka Singh Solanki',
        title: 'Vice President, Cloud Architecture',
        company: 'DWS',
        photoUrl: priyankaSolankiImage,
        order: 4,
        isModerator: false,
    },
    {
        name: 'Afreen Bano',
        title: 'Cloud Tech Lead',
        company: 'AWS Community',
        bio: 'Moderator',
        photoUrl: afreenBanoImage,
        order: 5,
        isModerator: true,
    },
];

export default function usePanelists() {
    const [panelists, setPanelists] = useState<Panelist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchPanelists = async () => {
            setLoading(true);

            if (!isAppwriteConfigured || !APPWRITE_DATABASE_ID) {
                // Use fallback if Appwrite isn't configured
                if (mounted) {
                    setPanelists(fallbackPanelists);
                    setLoading(false);
                }
                return;
            }

            try {
                const response = await databases.listDocuments({
                    databaseId: APPWRITE_DATABASE_ID,
                    collectionId: COLLECTIONS.PANELISTS,
                    queries: [
                        Query.limit(100),
                        Query.equal('isActive', true),
                        Query.orderAsc('order'),
                    ],
                });

                const mapped = response.documents.map((doc: any) => ({
                    ...doc,
                    photoUrl: doc.photoId ? getImageUrl(doc.photoId) : '',
                })) as Panelist[];

                if (mounted) setPanelists(mapped);
            } catch (err: any) {
                // If collection doesn't exist yet, use fallback
                console.warn('Panelists collection not found, using fallback data:', err.message);
                if (mounted) {
                    setPanelists(fallbackPanelists);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchPanelists();

        return () => {
            mounted = false;
        };
    }, []);

    const moderator = panelists.find(p => p.isModerator);
    const regular = panelists.filter(p => !p.isModerator);

    return { panelists, moderator, regular, loading, error };
}
