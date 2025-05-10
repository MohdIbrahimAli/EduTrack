'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getChildrenForParentUID } from "@/lib/placeholder-data";
import type { Child } from '@/types';
import { CheckCircle, XCircle, Clock, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useContext, useEffect, useState } from 'react';
import { UserRoleContext } from '@/context/UserRoleContext';

function AttendanceStatusIcon({ status }: { status: Child['currentAttendanceStatus'] }) {
  switch (status) {
    case 'Present':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'Absent':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'Late':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    default:
      return null;
  }
}

export default function DashboardPage() {
  const context = useContext(UserRoleContext);
  const [parentChildren, setParentChildren] = useState<Child[]>([]);

  useEffect(() => {
    if (context && !context.isLoadingRole && context.currentUser?.role === 'parent') {
      setParentChildren(getChildrenForParentUID(context.currentUser.id));
    }
  }, [context]); // Re-fetch/re-filter if context changes (e.g., user logs in/out, or for future data refresh triggers)


  if (!context || context.isLoadingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const { currentUser } = context;

  if (!currentUser || currentUser.role !== 'parent') {
     return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/> Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page is for parents only. Your role is: {currentUser?.role || 'undefined'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Parent Dashboard</h1>
      {parentChildren.length === 0 ? (
         <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                No children are currently associated with your account.
            </CardContent>
         </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parentChildren.map((child) => (
            <Card key={child.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
                <CardHeader className="bg-secondary/50 p-4">
                <div className="flex items-center gap-4">
                    {child.avatarUrl && (
                    <Image
                        src={child.avatarUrl}
                        alt={child.name}
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-primary"
                        data-ai-hint={child.dataAiHint || "child portrait"}
                    />
                    )}
                    <div>
                    <CardTitle className="text-xl font-semibold text-primary">{child.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{child.gradeLevel || 'N/A'}</CardDescription>
                    </div>
                </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Current Status:</span>
                    <div className="flex items-center gap-2">
                    <AttendanceStatusIcon status={child.currentAttendanceStatus} />
                    <Badge variant={
                        child.currentAttendanceStatus === 'Present' ? 'default' : 
                        child.currentAttendanceStatus === 'Absent' ? 'destructive' : 'secondary'
                    } className="bg-opacity-75">
                        {child.currentAttendanceStatus || 'Unknown'}
                    </Badge>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Absences This Month:</span>
                    <Badge variant="outline" className="text-primary border-primary">
                    {child.absenceCountThisMonth ?? 0}
                    </Badge>
                </div>
                </CardContent>
                <CardFooter className="p-4 bg-muted/30">
                <Link href={`/attendance/${child.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
                </CardFooter>
            </Card>
            ))}
        </div>
      )}
       <Card className="mt-8 shadow-lg rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/report-absence">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Report an Absence</Button>
          </Link>
          <Link href="/messages">
            <Button variant="outline" className="w-full">Contact Teachers</Button>
          </Link>
          <Link href="/notifications">
            <Button variant="outline" className="w-full">View Announcements</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}