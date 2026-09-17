import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  databases,
  APPWRITE_DATABASE_ID,
  COLLECTIONS,
  Query,
  ID,
  isAppwriteConfigured,
} from '@/lib/appwrite';

export type ApplicationRole = 'volunteer' | 'speaker';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type SessionType = 'offline' | 'online' | 'both';

export interface CommunityApplication {
  $id: string;
  role: ApplicationRole;
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  experience?: string;
  motivation: string;
  // Volunteer-specific
  availability?: string;
  // Speaker-specific
  topicTitle?: string;
  topicAbstract?: string;
  sessionType?: SessionType;
  priorSpeaking?: string;
  // Meta
  userId?: string;
  status: ApplicationStatus;
  submittedAt: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface ApplicationFormData {
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
  sessionType?: SessionType;
  priorSpeaking?: string;
  userId?: string;
}

/**
 * Submit a community application (volunteer or speaker).
 */
export async function submitApplication(data: ApplicationFormData): Promise<CommunityApplication> {
  if (!isAppwriteConfigured) {
    throw new Error('Appwrite is not configured');
  }

  const document = await databases.createDocument({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: COLLECTIONS.COMMUNITY_APPLICATIONS,
    documentId: ID.unique(),
    data: {
      ...data,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    },
  });

  return document as unknown as CommunityApplication;
}

/**
 * Hook for admins to fetch all community applications.
 */
export function useApplications(filters?: {
  role?: ApplicationRole;
  status?: ApplicationStatus;
}) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['community-applications', filters],
    queryFn: async () => {
      if (!isAppwriteConfigured) return [];

      const queries: string[] = [
        Query.limit(200),
        Query.orderDesc('submittedAt'),
      ];

      if (filters?.role) {
        queries.push(Query.equal('role', filters.role));
      }
      if (filters?.status) {
        queries.push(Query.equal('status', filters.status));
      }

      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.COMMUNITY_APPLICATIONS,
        queries,
      });

      return response.documents as unknown as CommunityApplication[];
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });

  return {
    applications: data ?? [],
    loading: isLoading,
    refetch,
  };
}

/**
 * Update the status of a community application.
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
): Promise<void> {
  if (!isAppwriteConfigured) {
    throw new Error('Appwrite is not configured');
  }

  await databases.updateDocument({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: COLLECTIONS.COMMUNITY_APPLICATIONS,
    documentId: applicationId,
    data: { status },
  });
}
