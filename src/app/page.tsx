
'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRoleContext } from '@/context/UserRoleContext';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const context = useContext(UserRoleContext);
  const router = useRouter();

  useEffect(() => {
    if (context) {
      const { currentUser, isLoadingRole } = context;
      if (!isLoadingRole) {
        if (currentUser) {
          if (currentUser.role === 'teacher') {
            router.replace('/teacher/dashboard');
          } else {
            router.replace('/dashboard');
          }
        } else {
          router.replace('/login-as');
        }
      }
    }
  }, [context, router]);

  // Display a loading indicator while context is loading or redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-lg text-muted-foreground">Loading EduAttend...</p>
    </div>
  );
}
