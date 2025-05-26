'use client';

import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

interface UserCredits {
  credits: number;
}

async function fetchUserCredits(userId: string): Promise<UserCredits> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('event_credits')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user credits:', error);
    throw new Error('Failed to load user credits');
  }

  return { credits: data?.event_credits || 0 };
}

export function useCredits() {
  const { user } = useUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ['credits', user?.id],
    queryFn: () => fetchUserCredits(user?.id || ''),
    enabled: !!user?.id,
  });

  return {
    credits: data?.credits || 0,
    isLoading,
    error,
  };
}
