/**
 * Umami Analytics API helper.
 *
 * Reads config from Vite env vars and exposes typed fetch wrappers
 * for the endpoints we need on the client side.
 */

const UMAMI_API_URL = import.meta.env.VITE_PUBLIC_UMAMI_API_URL || '';
const UMAMI_WEBSITE_ID = import.meta.env.VITE_PUBLIC_UMAMI_WEBSITE_ID || '';
const UMAMI_API_KEY = import.meta.env.VITE_PUBLIC_UMAMI_API_KEY || '';

export const isUmamiConfigured = !!(UMAMI_API_URL && UMAMI_WEBSITE_ID && UMAMI_API_KEY);

// ── Types ────────────────────────────────────────────────────────────

export interface UmamiRealtimeData {
  countries: Record<string, number>;
  urls: Record<string, number>;
  referrers: Record<string, number>;
  events: Array<{
    __type: string;
    sessionId: string;
    eventName: string;
    createdAt: string;
    browser: string;
    os: string;
    device: string;
    country: string;
    urlPath: string;
    referrerDomain: string;
  }>;
  series: {
    views: Array<{ x: string; y: number }>;
    visitors: Array<{ x: string; y: number }>;
  };
  totals: {
    views: number;
    visitors: number;
    events: number;
    countries: number;
  };
  timestamp: number;
}

export interface UmamiActiveData {
  visitors: number;
}

export interface UmamiStatsData {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
}

// ── Helpers ──────────────────────────────────────────────────────────

async function umamiGet<T>(path: string): Promise<T | null> {
  if (!isUmamiConfigured) return null;

  try {
    const res = await fetch(`${UMAMI_API_URL}${path}`, {
      headers: {
        Accept: 'application/json',
        'x-umami-api-key': UMAMI_API_KEY,
      },
    });

    if (!res.ok) {
      console.error(`Umami API ${path} returned ${res.status}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error(`Umami API ${path} fetch error:`, err);
    return null;
  }
}

// ── Public API ───────────────────────────────────────────────────────

/** Realtime stats (last 30 min) — active visitors, countries, totals */
export function fetchRealtime() {
  return umamiGet<UmamiRealtimeData>(
    `/realtime/${UMAMI_WEBSITE_ID}`,
  );
}

/** Active visitor count (last 5 min) */
export function fetchActive() {
  return umamiGet<UmamiActiveData>(
    `/websites/${UMAMI_WEBSITE_ID}/active`,
  );
}

/** Summarised stats for a date range */
export function fetchStats(startAt: number, endAt: number) {
  return umamiGet<UmamiStatsData>(
    `/websites/${UMAMI_WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`,
  );
}
