import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMockAttendanceRecords, getMockChildById } from "@/lib/placeholder-data";
import { AttendanceCalendarView } from "@/components/attendance/attendance-calendar-view";
import { AttendanceDailyView } from "@/components/attendance/attendance-daily-view";
import { AttendanceMonthlySummary } from "@/components/attendance/attendance-monthly-summary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX } from "lucide-react";

export default function AttendancePage({ params }: { params: { childId: string } }) {
  const child = getMockChildById(params.childId);
  
  if (!child) {
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

  const attendanceRecords = getMockAttendanceRecords(params.childId);

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
