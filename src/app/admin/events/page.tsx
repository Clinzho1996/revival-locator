'use client';

import { MOCK_EVENTS } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Plus, Search, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminEventsPage() {
  const handleDelete = (title: string) => {
    toast.error(`Event "${title}" has been deleted.`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Manage Events</h1>
          <p className="text-muted-foreground">Add, edit, or remove Christian events from the platform.</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-primary hover:bg-primary/90 rounded-xl px-6 gap-2 h-12 shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            Create New Event
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Filter events..."
            className="pl-10 h-11 bg-background border-primary/10 focus-visible:ring-primary/20 rounded-xl"
          />
        </div>
        <Button variant="outline" className="h-11 rounded-xl border-primary/20">Filter</Button>
        <Button variant="outline" className="h-11 rounded-xl border-primary/20">Export</Button>
      </div>

      <div className="bg-card rounded-2xl border border-primary/5 shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent border-primary/10">
              <TableHead className="w-[300px] font-bold py-4">Event Details</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Date & Time</TableHead>
              <TableHead className="font-bold">Interested</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_EVENTS.map((event) => (
              <TableRow key={event.id} className="hover:bg-primary/[0.02] border-primary/5">
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={event.imageUrl}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover border border-primary/10"
                    />
                    <div>
                      <p className="font-bold text-sm leading-none mb-1">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full border-primary/20 text-primary bg-primary/5">
                    {event.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{format(new Date(event.date), 'MMM d, yyyy')}</p>
                  <p className="text-xs text-muted-foreground">{event.startTime}</p>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {event.interestCount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium uppercase tracking-wider">Live</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/events/${event.id}`} target="_blank">
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(event.title)}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
