import { useCallback, useEffect, useState } from 'react';
import { databases, APPWRITE_DATABASE_ID, COLLECTIONS, Query, isAppwriteConfigured, getFilePreview } from '@/lib/appwrite';
import highlightOne from '@/assets/event-highlights/event_photo_1.jpg';
import highlightTwo from '@/assets/event-highlights/event_photo_3.jpg';
import highlightThree from '@/assets/event-highlights/event_photo_5.jpg';
import highlightFour from '@/assets/event-highlights/event_photo_8.jpg';
import highlightFive from '@/assets/event-highlights/event_photo_9.jpeg';
import highlightSix from '@/assets/event-highlights/event_photo_10.jpeg';

const FALLBACK_MEDIA = [
    highlightOne,
    highlightTwo,
    highlightThree,
    highlightFour,
    highlightFive,
    highlightSix,
];

export interface Highlight {
    $id?: string;
    type: 'photo' | 'video';
    mediaId: string;
    mediaUrl?: string;
    order: number;
    isActive: boolean;
}

const toError = (value: unknown) => value instanceof Error ? value : new Error('Unable to load highlights');

const fallbackHighlights: Highlight[] = Array.from({ length: FALLBACK_MEDIA.length }, (_, i) => ({
    type: 'photo' as const,
    mediaId: '',
    mediaUrl: FALLBACK_MEDIA[i],
    order: i + 1,
    isActive: true,
}));

export function useHighlights() {
    const [highlights, setHighlights] = useState<Highlight[]>(fallbackHighlights);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchHighlights = useCallback(async () => {
        setLoading(true);
        const appwriteUnavailable = !isAppwriteConfigured || !APPWRITE_DATABASE_ID;

        if (appwriteUnavailable) {
            setHighlights(fallbackHighlights);
            setLoading(false);
            return;
        }

        try {
            const response = await databases.listDocuments({
                databaseId: APPWRITE_DATABASE_ID,
                collectionId: COLLECTIONS.HIGHLIGHTS,
                queries: [
                    Query.limit(100),
                    Query.orderAsc('order'),
                    Query.equal('isActive', [true]),
                ],
            });

            const items: Highlight[] = response.documents.map((doc) => {
                const item = doc as unknown as Highlight;

                return {
                    ...item,
                    mediaUrl: item.mediaId ? getFilePreview(item.mediaId) : '',
                };
            });

            // If Appwrite returns results, use them; otherwise keep fallbacks
            setHighlights(items.length > 0 ? items : fallbackHighlights);
        } catch (err: unknown) {
            setError(toError(err));
            setHighlights(fallbackHighlights);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHighlights();
    }, [fetchHighlights]);

    return { highlights, loading, error, refresh: fetchHighlights };
}
