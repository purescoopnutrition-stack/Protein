import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Setting } from '@/lib/supabase-types';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      const map: Record<string, string> = {};
      (data as Setting[] | null)?.forEach((s) => { map[s.key] = s.value; });
      return map;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSetting(key: string, fallback = '') {
  const { data } = useSettings();
  return data?.[key] ?? fallback;
}
