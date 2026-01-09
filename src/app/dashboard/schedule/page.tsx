import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { examSchedule } from '@/lib/academic-data';
import { Badge } from '@/components/ui/badge';

export default function SchedulePage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Exam Schedule</h1>
        <p className="text-muted-foreground">Find dates, times, and locations for your exams.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mid-Term Examinations</CardTitle>
          <CardDescription>
            Please arrive at the examination hall at least 15 minutes before the scheduled time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Course</TableHead>
                <TableHead>Course Code</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examSchedule.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.course}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{exam.code}</Badge>
                  </TableCell>
                  <TableCell>{exam.date}</TableCell>
                  <TableCell>{exam.time}</TableCell>
                  <TableCell className="text-right">{exam.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
