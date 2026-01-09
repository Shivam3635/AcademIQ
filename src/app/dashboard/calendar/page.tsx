'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { AcademicEvent } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Dummy data for January 2026
const academicEvents: AcademicEvent[] = [
  { id: '1', title: "New Year's Day", date: new Date('2026-01-01T00:00:00'), type: 'holiday' },
  { id: '2', title: "National Youth Day Seminar", date: new Date('2026-01-12T00:00:00'), type: 'event' },
  { id: '3', title: "Makar Sankranti", date: new Date('2026-01-14T00:00:00'), type: 'holiday' },
  { id: '4', title: "Mid-Semester Lab Exams", date: new Date('2026-01-20T00:00:00'), type: 'deadline' },
  { id: '5', title: "Mid-Semester Lab Exams", date: new Date('2026-01-21T00:00:00'), type: 'deadline' },
  { id: '6', title: "Mid-Semester Lab Exams", date: new Date('2026-01-22T00:00:00'), type: 'deadline' },
  { id: '7', title: "Republic Day Celebration", date: new Date('2026-01-26T00:00:00'), type: 'event' },
];


export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    // Initialize dates on the client to avoid hydration errors
    const now = new Date('2026-01-10'); // Set to Jan 2026 to show events
    setCurrentDate(now);
    setSelectedDate(now);
  }, []);

  if (!currentDate || !selectedDate) {
    // Render a loading state or null until the dates are initialized on the client
    return null; 
  }

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(lastDayOfMonth),
  });

  const getEventTypeStyles = (type: AcademicEvent['type']) => {
    switch (type) {
      case 'holiday':
        return 'bg-green-500 text-green-500';
      case 'deadline':
        return 'bg-red-500 text-red-500';
      case 'event':
        return 'bg-blue-500 text-blue-500';
      default:
        return '';
    }
  };
  
  const getEventBadgeStyles = (type: AcademicEvent['type']) => {
    switch (type) {
      case 'holiday':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
      case 'event':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700';
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const eventsForSelectedDate = academicEvents.filter(event =>
    isSameDay(event.date, selectedDate)
  );

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Academic Calendar
        </h1>
        <p className="text-muted-foreground">
          Important dates, deadlines, and events.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px text-xs text-center border-t border-l bg-border border-slate-700">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-2 font-medium bg-card border-r border-b border-slate-700">
                  {day}
                </div>
              ))}
              {daysInMonth.map((day, index) => {
                const dayEvents = academicEvents.filter(event =>
                  isSameDay(day, event.date)
                );
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'relative p-2 text-center bg-card cursor-pointer border-b border-r border-slate-700',
                      !isSameMonth(day, currentDate) && 'text-muted-foreground/50',
                      isToday(day) && 'bg-accent/50',
                      isSameDay(day, selectedDate) &&
                        'bg-primary text-primary-foreground'
                    )}
                  >
                    <span>{format(day, 'd')}</span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <Circle
                            key={event.id}
                            className={cn(
                              'h-1.5 w-1.5 fill-current',
                              getEventTypeStyles(event.type)
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Events for {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventsForSelectedDate.length > 0 ? (
                eventsForSelectedDate
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(event => (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 rounded-lg border p-4 transition-all"
                    >
                      <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md w-16">
                        <span className="text-sm text-muted-foreground">
                          {format(event.date, 'MMM')}
                        </span>
                        <span className="text-xl font-bold">
                          {format(event.date, 'dd')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{event.title}</p>
                      </div>
                      <Badge
                        className={cn(
                          'capitalize',
                          getEventBadgeStyles(event.type)
                        )}
                      >
                        {event.type}
                      </Badge>
                    </div>
                  ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No events for this day.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
