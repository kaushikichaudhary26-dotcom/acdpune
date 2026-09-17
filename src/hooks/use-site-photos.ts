import { useEffect, useState } from 'react';
import { APPWRITE_DATABASE_ID, COLLECTIONS, databases, getFilePreview, isAppwriteConfigured, Query } from '@/lib/appwrite';
import heroBackground from '@/assets/hero-bg.jpg';
import aboutPhotoOne from '@/assets/event-highlights/event_photo_1.jpg';
import aboutPhotoTwo from '@/assets/event-highlights/event_photo_4.jpg';
import aboutPhotoThree from '@/assets/event-highlights/event_photo_7.jpg';
import aboutPhotoFour from '@/assets/event-highlights/event_photo_10.jpeg';

export interface SitePhoto {
  $id?: string;
  title?: string;
  photoId: string;
  photoUrl?: string;
  section?: 'hero' | 'about' | 'both';
  order?: number;
  isActive?: boolean;
}

const isErrorWithCode = (value: unknown): value is Error & { code?: number; message?: string } =>
  value instanceof Error || (typeof value === 'object' && value !== null && ('code' in value || 'message' in value));

export const fallbackSitePhotos = [
  heroBackground,
  aboutPhotoOne,
  aboutPhotoTwo,
  aboutPhotoThree,
  aboutPhotoFour,
];

export default function useSitePhotos() {
  const [photos, setPhotos] = useState<SitePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchPhotos = async () => {
      if (!isAppwriteConfigured || !APPWRITE_DATABASE_ID) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const response = await databases.listDocuments({
          databaseId: APPWRITE_DATABASE_ID,
          collectionId: COLLECTIONS.SITE_PHOTOS,
          queries: [Query.limit(200), Query.orderAsc('order')],
        });

        const mapped = response.documents
          .filter((doc) => doc.isActive ?? true)
          .map((doc) => ({
            ...doc,
            photoUrl: doc.photoId ? getFilePreview(doc.photoId) : '',
          })) as unknown as SitePhoto[];

        if (mounted) setPhotos(mapped);
      } catch (err: unknown) {
        // Gracefully fallback when collection does not exist yet
        if (mounted) setPhotos([]);
        if (!isErrorWithCode(err) || err.code !== 404) {
          console.warn('Failed to fetch site photos:', isErrorWithCode(err) ? (err.message || err) : err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPhotos();
    return () => {
      mounted = false;
    };
  }, []);

  return { photos, loading };
}

