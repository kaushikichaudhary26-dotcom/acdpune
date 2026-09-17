import { useCallback, useEffect, useState } from 'react';
import { databases, APPWRITE_DATABASE_ID, COLLECTIONS, Query, isAppwriteConfigured, getFilePreview } from '@/lib/appwrite';
import logoPlaceholder from '@/assets/logo_placeholder.jpg';

// ── Single source of truth for all sponsor tiers ──
export const SPONSOR_TIERS = [
  { value: 'title',     label: 'Title Sponsor',      emoji: '✨', badgeColor: 'bg-slate-200 text-slate-800' },
  { value: 'gold',      label: 'Gold Sponsors',       emoji: '🥇', badgeColor: 'bg-amber-200 text-amber-800' },
  { value: 'silver',    label: 'Silver Sponsors',      emoji: '🥈', badgeColor: 'bg-gray-300 text-gray-800' },
  { value: 'bronze',    label: 'Bronze Sponsors',      emoji: '🥉', badgeColor: 'bg-orange-200 text-orange-800' },
  { value: 'community', label: 'Community Partners',   emoji: '🤝', badgeColor: 'bg-green-200 text-green-800' },
  { value: 'kind', label: 'Kind Sponsors',   emoji: '💖', badgeColor: 'bg-pink-200 text-pink-800' },
  { value: 'talent', label: 'Talent Partners',   emoji: '🎓', badgeColor: 'bg-blue-200 text-blue-800' },
  { value: 'studentcom', label: 'Student Community Partner', emoji: '🎒', badgeColor: 'bg-purple-200 text-purple-800' }  ,
] as const;

export type SponsorTier = (typeof SPONSOR_TIERS)[number]['value'];

// Derived helpers
export const TIER_VALUES: SponsorTier[] = SPONSOR_TIERS.map(t => t.value);
export const TIER_LABELS: Record<SponsorTier, string> = Object.fromEntries(
  SPONSOR_TIERS.map(t => [t.value, `${t.emoji} ${t.label}`])
) as Record<SponsorTier, string>;
export const TIER_BADGE_COLORS: Record<SponsorTier, string> = Object.fromEntries(
  SPONSOR_TIERS.map(t => [t.value, t.badgeColor])
) as Record<SponsorTier, string>;

export interface Sponsor {
  $id?: string;
  name: string;
  logo?: string;
  logoId?: string;
  logoUrl?: string;
  website?: string;
  tier: SponsorTier;
  order?: number;
  isActive?: boolean;
}

export type SponsorTiers = Record<SponsorTier, Sponsor[]>;

// Build placeholder sponsors dynamically from TIER_VALUES
const placeholderCounts: Record<string, number> = { title: 1, gold: 2, silver: 3, bronze: 4, community: 6 };
const placeholderSponsors: SponsorTiers = Object.fromEntries(
  TIER_VALUES.map(tier => [
    tier,
    Array.from({ length: placeholderCounts[tier] || 2 }, () => ({
      name: tier === 'community' ? 'COMMUNITY' : 'COMPANY NAME',
      logoUrl: logoPlaceholder,
      tier,
    })),
  ])
) as SponsorTiers;

export function useSponsors() {
  const [tiers, setTiers] = useState<SponsorTiers>(placeholderSponsors);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSponsors = useCallback(async () => {
    setLoading(true);
    const appwriteUnavailable = !isAppwriteConfigured || !APPWRITE_DATABASE_ID;

    if (appwriteUnavailable) {
      setTiers(placeholderSponsors);
      setLoading(false);
      return;
    }

    try {
      const response = await databases.listDocuments({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTIONS.SPONSORS,
        queries: [
          Query.limit(100),
          Query.orderAsc('order'),
          Query.equal('isActive', [true]),
          Query.equal('tier', [...TIER_VALUES]),
        ],
      });

      // Build grouped object dynamically from TIER_VALUES
      const grouped: SponsorTiers = Object.fromEntries(
        TIER_VALUES.map(tier => [tier, []])
      ) as SponsorTiers;

      response.documents.forEach((doc: any) => {
        const tier: SponsorTier = doc.tier || 'gold';
        if (grouped[tier]) {
          grouped[tier].push({
            ...doc,
            logoUrl: doc.logoId ? getFilePreview(doc.logoId) : (doc.logo || ''),
          });
        }
      });

      setTiers(grouped);
    } catch (err: any) {
      setError(err);
      setTiers(placeholderSponsors);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  return { tiers, loading, error, refresh: fetchSponsors };
}
