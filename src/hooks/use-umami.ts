import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchRealtime,
  fetchActive,
  isUmamiConfigured,
  type UmamiRealtimeData,
} from '@/lib/umami';

type ServiceStatus = 'operational' | 'degraded' | 'down';

interface UmamiStats {
  activeVisitors: number;
  totalPageviews: number;
  totalVisitors: number;
  topCountry: string;
  serviceStatus: ServiceStatus;
  loading: boolean;
}

const POLL_INTERVAL = 60_000; // 60 seconds

export function useUmami(): UmamiStats {
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [totalPageviews, setTotalPageviews] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [topCountry, setTopCountry] = useState('');
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>(
    isUmamiConfigured ? 'operational' : 'down',
  );
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    if (!isUmamiConfigured) {
      setServiceStatus('down');
      setLoading(false);
      return;
    }

    try {
      // Fetch both endpoints in parallel
      const [realtime, active] = await Promise.all([
        fetchRealtime(),
        fetchActive(),
      ]);

      if (realtime) {
        setTotalPageviews(realtime.totals.views);
        setTotalVisitors(realtime.totals.visitors);

        // Derive top country from the countries map
        const countries = realtime.countries;
        const entries = Object.entries(countries);
        if (entries.length > 0) {
          const [code] = entries.reduce((best, cur) =>
            cur[1] > best[1] ? cur : best,
          );
          setTopCountry(code);
        } else {
          setTopCountry('');
        }

        setServiceStatus('operational');
      } else {
        setServiceStatus('degraded');
      }

      if (active) {
        setActiveVisitors(active.visitors);
      }
    } catch {
      setServiceStatus('degraded');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    refresh();

    timerRef.current = setInterval(refresh, POLL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refresh]);

  return {
    activeVisitors,
    totalPageviews,
    totalVisitors,
    topCountry,
    serviceStatus,
    loading,
  };
}
