'use server';

import { getUserProfile, createUserProfile as createProfile } from '@/lib/user';

export async function createUserProfile(userId: string, email?: string | null) {
  console.log('🚀 Server Action: Starting profile creation for user:', userId);

  try {
    // First check if profile exists
    console.log('🔍 Server Action: Checking for existing profile...');
    const existingProfile = await getUserProfile(userId);

    if (existingProfile) {
      console.log('ℹ️ Server Action: Profile already exists:', existingProfile);
      return { success: true, profile: existingProfile };
    }

    // Create new profile
    console.log('➕ Server Action: Creating new profile...');
    const newProfile = await createProfile(userId, email);

    if (!newProfile) {
      console.error('❌ Server Action: Profile creation failed');
      return { error: 'Failed to create profile' };
    }

    console.log('✅ Server Action: Successfully created profile:', newProfile);
    return { success: true, profile: newProfile };
  } catch (err) {
    console.error('❌ Server Action: Unexpected error:', err);
    return {
      error: err instanceof Error ? err.message : 'Unexpected error occurred',
    };
  }
}
