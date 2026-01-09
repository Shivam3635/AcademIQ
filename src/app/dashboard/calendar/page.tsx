'use client';

import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { academicEvents } from '@/lib/academic-data';
import type { AcademicEvent } from '@/lib/types';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const eventsForMonth = useMemo(() => {
    return academicEvents.filter(event => isSameMonth(event.date, currentMonth));
  }, [currentMonth]);

  const eventsForSelectedDay = useMemo(() => {
    if (!date) return [];
    return eventsForMonth.filter(event => isSameDay(event.date, date));
  }, [date, eventsForMonth]);

  const eventDates = useMemo(() => eventsForMonth.map(event => event.date), [eventsForMonth]);

  const getEventTypeStyles = (type: AcademicEvent['type']) => {
    switch (type) {
      case 'holiday': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
      case 'deadline': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
      case 'event': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700';
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Academic Calendar</h1>
        <p className="text-muted-foreground">Important dates, deadlines, and events.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              onMonthChange={setCurrentMonth}
              className="p-3"
              modifiers={{ event: eventDates }}
              modifiersClassNames={{
                event: "relative",
              }}
              components={{
                DayContent: ({ date, ...props }) => {
                  const isEvent = eventDates.some(eventDate => isSameDay(date, eventDate));
                  return (
                    <div className="relative h-full w-full">
                      <p>{date.getDate()}</p>
                      {isEvent && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />}
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Events for {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventsForMonth.length > 0 ? (
                eventsForMonth
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        'flex items-center gap-4 rounded-lg border p-4 transition-all',
                        date && isSameDay(event.date, date) && 'bg-primary/10 ring-2 ring-primary'
                      )}
                    >
                      <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
                        <span className="text-sm text-muted-foreground">{format(event.date, 'MMM')}</span>
                        <span className="text-xl font-bold">{format(event.date, 'dd')}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{event.title}</p>
                      </div>
                      <Badge className={cn('capitalize', getEventTypeStyles(event.type))}>
                        {event.type}
                      </Badge>
                    </div>
                  ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No events for this month.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
