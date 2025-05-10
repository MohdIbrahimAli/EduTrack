
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { UserRoleProvider } from '@/context/UserRoleContext';

export const metadata: Metadata = {
  title: 'EduAttend - School Attendance & Communication',
  description: 'Streamline school attendance tracking and parent-teacher communication with EduAttend.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="antialiased font-sans">
        <UserRoleProvider>
          {children}
          <Toaster />
        </UserRoleProvider>
      </body>
    </html>
  );
}
