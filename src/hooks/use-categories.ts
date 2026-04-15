import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}
