
'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRoleContext } from '@/context/UserRoleContext';
import { User, Users } from 'lucide-react';

export default function LoginAsPage() {
  const context = useContext(UserRoleContext);
  const router = useRouter();

  if (!context) {
    // This should ideally not happen if the layout wraps pages with the provider
    return <p>Error: UserRoleContext not found.</p>;
  }

  const { loginAs } = context;

  const handleLogin = (role: 'parent' | 'teacher') => {
    loginAs(role);
    if (role === 'parent') {
      router.push('/dashboard');
    } else {
      router.push('/teacher/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Users className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-bold">Choose Your Role</CardTitle>
          <CardDescription>Select how you want to experience EduAttend.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleLogin('parent')}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <User className="mr-2 h-5 w-5" />
            Login as Parent
          </Button>
          <Button
            onClick={() => handleLogin('teacher')}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            <User className="mr-2 h-5 w-5" />
            Login as Teacher
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
