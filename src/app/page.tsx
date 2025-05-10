
import { redirect } from 'next/navigation';
import { MOCK_LOGGED_IN_USER } from '@/lib/placeholder-data';

export default function HomePage() {
  // In a real app, you would get the user's role from your authentication context
  if (MOCK_LOGGED_IN_USER.role === 'teacher') {
    redirect('/teacher/dashboard');
  } else {
    redirect('/dashboard'); // Parent dashboard
  }
  // return null; // redirect will handle this
}
