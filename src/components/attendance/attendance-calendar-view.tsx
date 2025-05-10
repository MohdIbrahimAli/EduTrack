'use client';

import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import type { AttendanceRecord } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { eachDayOfInterval, format, parseISO, startOfMonth, endOfMonth, isSameDay } from 'date-fns';

interface AttendanceCalendarViewProps {
  records: AttendanceRecord[];
  childName: string;
}

export function AttendanceCalendarView({ records, childName }: AttendanceCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDateRecords, setSelectedDateRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (selectedDate) {
      const dayRecords = records.filter(record => isSameDay(parseISO(record.date), selectedDate));
      setSelectedDateRecords(dayRecords);
    } else {
      setSelectedDateRecords([]);
    }
  }, [selectedDate, records]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const modifiers = daysInMonth.reduce((acc, day) => {
    const dayRecords = records.filter(record => isSameDay(parseISO(record.date), day));
    if (dayRecords.length > 0) {
      const primaryStatus = dayRecords[0].status; // Simplified: take the first record's status for the day
      acc[format(day, 'yyyy-MM-dd')] = primaryStatus.toLowerCase();
    }
    return acc;
  }, {} as Record<string, string>);

  const modifierStyles = {
    present: { backgroundColor: 'hsl(var(--accent) / 0.2)', color: 'hsl(var(--accent-foreground))' },
    absent: { backgroundColor: 'hsl(var(--destructive) / 0.2)', color: 'hsl(var(--destructive-foreground))' },
    late: { backgroundColor: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary-foreground))' }, // Using primary for late for variety
    excused: { backgroundColor: 'hsl(var(--secondary) / 0.5)', color: 'hsl(var(--secondary-foreground))' },
  };
  
  const customModifiers = Object.keys(modifiers).reduce((acc, dateStr) => {
    const status = modifiers[dateStr];
    if (!acc[status]) acc[status] = [];
    acc[status].push(parseISO(dateStr));
    return acc;
  }, {} as Record<string, Date[]>);


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Attendance Calendar for {childName}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={customModifiers}
              modifiersStyles={modifierStyles}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        {selectedDate && (
          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">Details for {format(selectedDate, 'MMMM dd, yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateRecords.length > 0 ? (
                <ul className="space-y-2">
                  {selectedDateRecords.map(record => (
                    <li key={record.id} className="p-2 border rounded-md bg-muted/50">
                      <Badge 
                        variant={record.status === 'Present' ? 'default' : record.status === 'Absent' ? 'destructive' : 'secondary'}
                        className="mr-2"
                      >
                        {record.status}
                      </Badge>
                      {record.notes && <span className="text-sm text-muted-foreground">{record.notes}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No attendance record for this day.</p>
              )}
            </CardContent>
          </Card>
        )}
         <Card className="mt-4 shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-primary">Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-sm" style={modifierStyles.present}></span> Present</div>
            <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-sm" style={modifierStyles.absent}></span> Absent</div>
            <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-sm" style={modifierStyles.late}></span> Late</div>
            <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-sm" style={modifierStyles.excused}></span> Excused</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
