import { useEffect, useState } from 'react';
import { databases, APPWRITE_DATABASE_ID, COLLECTIONS, Query, isAppwriteConfigured } from '@/lib/appwrite';

export interface FAQItem {
  $id?: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}

export default function useFAQs() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFaqs = async () => {
      setLoading(true);

      if (!isAppwriteConfigured || !APPWRITE_DATABASE_ID) {
        if (mounted) {
          setError(new Error('Appwrite is not configured'));
          setFaqs([]);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await databases.listDocuments({
          databaseId: APPWRITE_DATABASE_ID,
          collectionId: COLLECTIONS.FAQ,
          queries: [Query.limit(100), Query.orderAsc('order')],
        });

        const mapped = (response.documents as FAQItem[]).filter(item => item.isActive ?? true);

        if (mounted) setFaqs(mapped);
      } catch (err: any) {
        if (mounted) {
          setError(err);
          setFaqs([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFaqs();

    return () => {
      mounted = false;
    };
  }, []);

  return { faqs, loading, error };
}
