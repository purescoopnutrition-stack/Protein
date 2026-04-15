import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}
