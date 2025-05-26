'use client';

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { createUserProfile } from '@/app/actions/create-profile';

export function AuthCheck() {
  const { isLoaded: isAuthLoaded, userId } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

  useEffect(() => {
    async function initializeProfile() {
      if (!userId || !user) return;

      console.log('🔍 AuthCheck: Attempting to create profile for user:', {
        userId,
        email: user.primaryEmailAddress?.emailAddress
      });

      try {
        const result = await createUserProfile(userId);
        
        if (result.error) {
          console.error('❌ AuthCheck: Failed to create profile:', result.error);
        } else {
          console.log('✅ AuthCheck: Profile initialization complete:', result);
        }
      } catch (err) {
        console.error('❌ AuthCheck: Error initializing profile:', err);
      }
    }

    console.log('ℹ️ AuthCheck: Auth state:', {
      isAuthLoaded,
      isUserLoaded,
      hasUserId: !!userId,
      hasUser: !!user
    });

    if (isAuthLoaded && isUserLoaded && userId && user) {
      initializeProfile();
    }
  }, [isAuthLoaded, isUserLoaded, userId, user]);

  return null;
} 
