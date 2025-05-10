'use client';

import type { AttendanceRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval, format } from 'date-fns';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AttendanceMonthlySummaryProps {
  records: AttendanceRecord[];
  childName: string;
}

export function AttendanceMonthlySummary({ records, childName }: AttendanceMonthlySummaryProps) {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const firstDayCurrentMonth = startOfMonth(currentMonthDate);
  const lastDayCurrentMonth = endOfMonth(currentMonthDate);

  const monthlyRecords = records.filter(record => 
    isWithinInterval(parseISO(record.date), { start: firstDayCurrentMonth, end: lastDayCurrentMonth })
  );

  const summary = monthlyRecords.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const presentPercentage = summary.total > 0 ? ((summary.Present || 0) / summary.total) * 100 : 0;

  const chartData = [
    { name: 'Present', count: summary.Present || 0, fill: 'hsl(var(--primary))' },
    { name: 'Absent', count: summary.Absent || 0, fill: 'hsl(var(--destructive))' },
    { name: 'Late', count: summary.Late || 0, fill: 'hsl(var(--accent))' },
    { name: 'Excused', count: summary.Excused || 0, fill: 'hsl(var(--secondary))' },
  ];

  const goToPreviousMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };


  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold text-primary">Monthly Summary for {childName}</CardTitle>
            <CardDescription>{format(currentMonthDate, "MMMM yyyy")}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">Overall Presence</span>
            <span className="text-sm font-medium text-primary">{presentPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={presentPercentage} className="w-full h-3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{summary.Present || 0}</p>
            <p className="text-sm text-muted-foreground">Present</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-destructive">{summary.Absent || 0}</p>
            <p className="text-sm text-muted-foreground">Absent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{summary.Late || 0}</p>
            <p className="text-sm text-muted-foreground">Late</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary-foreground">{summary.Excused || 0}</p>
            <p className="text-sm text-muted-foreground">Excused</p>
          </div>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-2 text-center text-primary">Attendance Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false}/>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="count" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
