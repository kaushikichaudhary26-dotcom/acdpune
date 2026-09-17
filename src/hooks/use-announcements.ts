import { useQuery } from '@tanstack/react-query';
import {
  databases,
  APPWRITE_DATABASE_ID,
  COLLECTIONS,
  Query,
  isAppwriteConfigured,
} from '@/lib/appwrite';

export interface Announcement {
  $id: string;
  message: string;
  meetupLink: string;
  isActive: boolean;
  order: number;
}

async function fetchAnnouncements(): Promise<Announcement[]> {
  if (!isAppwriteConfigured) return [];

  const response = await databases.listDocuments({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: COLLECTIONS.ANNOUNCEMENTS,
    queries: [
      Query.equal('isActive', true),
      Query.orderAsc('order'),
      Query.limit(10),
    ],
  });

  return response.documents as unknown as Announcement[];
}

export function useAnnouncements() {
  const { data, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: fetchAnnouncements,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });

  return {
    announcements: data ?? [],
    loading: isLoading,
  };
}
