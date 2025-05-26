'use client';

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { createUserProfile } from '@/app/actions/create-profile';
import { usePathname } from 'next/navigation';

export function AuthCheck() {
  const { isLoaded: isAuthLoaded, userId } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    async function initializeProfile() {
      if (!userId || !user) return;

      // Skip profile creation check for event viewing paths
      if (pathname?.startsWith('/events/')) {
        return;
      }

      // Only check profile on specific pages that need it
      const pagesNeedingProfile = ['/', '/create', '/profile', '/pricing'];
      if (!pagesNeedingProfile.includes(pathname || '')) {
        return;
      }

      console.log('🔍 AuthCheck: Attempting to create profile for user:', {
        userId,
        email: user.primaryEmailAddress?.emailAddress,
        path: pathname
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
      hasUser: !!user,
      path: pathname
    });

    if (isAuthLoaded && isUserLoaded && userId && user) {
      initializeProfile();
    }
  }, [isAuthLoaded, isUserLoaded, userId, user, pathname]);

  return null;
} 
