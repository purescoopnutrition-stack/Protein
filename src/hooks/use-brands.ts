import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}
