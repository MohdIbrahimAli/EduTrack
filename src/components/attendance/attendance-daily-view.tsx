'use client';

import { useState } from 'react';
import type { AttendanceRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

interface AttendanceDailyViewProps {
  records: AttendanceRecord[];
  childName: string;
}

export function AttendanceDailyView({ records, childName }: AttendanceDailyViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const filteredRecords = selectedDate 
    ? records.filter(record => isSameDay(parseISO(record.date), selectedDate))
    : [];

  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-primary">Daily Attendance for {childName}</CardTitle>
            <CardDescription>
              {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : "Select a date"}
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        {filteredRecords.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <Badge variant={
                      record.status === 'Present' ? 'default' : 
                      record.status === 'Absent' ? 'destructive' : 'secondary'
                    }>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.notes || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            No attendance records for {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : "the selected date"}.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
