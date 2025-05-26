import { supabase, getSupabaseAdmin } from './supabase';
import type { Database } from '@/types/supabase';

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserProfileInsert =
  Database['public']['Tables']['user_profiles']['Insert'];
export type UserProfileUpdate =
  Database['public']['Tables']['user_profiles']['Update'];

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // PGRST116 means no rows found, which is a valid case
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function createUserProfile(
  userId: string,
  email?: string | null
): Promise<UserProfile | null> {
  console.log('🚀 Starting profile creation for user:', { userId, email });

  try {
    // First check if profile exists
    console.log('🔍 Checking for existing profile...');
    const existingProfile = await getUserProfile(userId);

    if (existingProfile) {
      console.log('✅ Profile already exists:', existingProfile);
      return existingProfile;
    }

    console.log('➕ No existing profile found, creating new profile...');

    // Try with regular client first
    console.log('📝 Attempting to create profile with RPC...');
    const { data: profileId, error: rpcError } = await supabase.rpc(
      'create_user_profile',
      {
        p_user_id: userId,
        p_email: email ?? null,
      }
    );

    if (rpcError) {
      console.error('❌ RPC call failed:', rpcError);
      return null;
    }

    // Fetch the newly created profile
    console.log('🔍 Fetching newly created profile...');
    return getUserProfile(userId);
  } catch (err) {
    console.error('❌ Exception in createUserProfile:', err);
    return null;
  }
}

export async function updateUserCredits(
  userId: string,
  credits: number,
  description?: string,
  eventId?: string
): Promise<boolean> {
  // Use admin client for credit updates
  const adminClient = getSupabaseAdmin();

  try {
    // Call the RPC function to modify credits
    const { data, error } = await adminClient.rpc('modify_user_credits', {
      target_user_id: userId,
      credit_change: credits,
      description,
      event_id: eventId,
    });

    if (error) {
      console.error('Error updating user credits:', error);
      return false;
    }

    // The function now returns a boolean indicating success
    return data === true;
  } catch (err) {
    console.error('Exception updating user credits:', err);
    return false;
  }
}

export async function deductEventCredit(
  userId: string,
  eventId: string
): Promise<boolean> {
  try {
    // Directly attempt to deduct the credit
    // The database function will handle the check and update atomically
    return await updateUserCredits(
      userId,
      -1,
      'Credit deducted for event creation',
      eventId
    );
  } catch (err) {
    console.error('Error deducting event credit:', err);
    return false;
  }
}

export async function getUserTransactions(userId: string) {
  const { data, error } = await supabase.rpc('get_user_transactions', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching user transactions:', error);
    return [];
  }

  return data;
}
