'use client'; // This page is interactive, so client component

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMockAttendanceRecords, getMockChildById } from "@/lib/placeholder-data";
import { AttendanceCalendarView } from "@/components/attendance/attendance-calendar-view";
import { AttendanceDailyView } from "@/components/attendance/attendance-daily-view";
import { AttendanceMonthlySummary } from "@/components/attendance/attendance-monthly-summary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX, Loader2 } from "lucide-react";
import type { Child, AttendanceRecord as AttendanceRecordType } from "@/types";
import { useState, useEffect } from "react";

export default function AttendancePage({ params }: { params: { childId: string } }) {
  const [child, setChild] = useState<Child | null | undefined>(undefined); // undefined for initial loading state
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecordType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const foundChild = getMockChildById(params.childId);
    setChild(foundChild); // This can be null if not found
    if (foundChild) {
      setAttendanceRecords(getMockAttendanceRecords(params.childId));
    }
    setIsLoading(false);
  }, [params.childId]); // Re-fetch if childId changes

  if (isLoading || child === undefined) { // Show loader if still loading or child state is initial undefined
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!child) { // Child is null, meaning not found after attempting to load
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <UserX className="h-4 w-4" />
          <AlertTitle>Child Not Found</AlertTitle>
          <AlertDescription>
            The child with ID "{params.childId}" could not be found. Please check the ID or select a child from the dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-primary">Attendance for {child.name}</h1>
      <p className="text-muted-foreground mb-8">{child.gradeLevel}</p>
      
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6 rounded-lg">
          <TabsTrigger value="calendar" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Calendar View</TabsTrigger>
          <TabsTrigger value="daily" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Daily Log</TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Monthly Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <AttendanceCalendarView records={attendanceRecords} childName={child.name} />
        </TabsContent>
        <TabsContent value="daily">
          <AttendanceDailyView records={attendanceRecords} childName={child.name} />
        </TabsContent>
        <TabsContent value="monthly">
          <AttendanceMonthlySummary records={attendanceRecords} childName={child.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}