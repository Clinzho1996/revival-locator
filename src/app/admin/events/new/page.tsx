'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ChevronLeft,
  Save,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  MapPin,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Event created successfully!');
      router.push('/admin/events');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Create New Event</h1>
          <p className="text-muted-foreground">Fill in the details to publish a new Christian gathering.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-primary/5 shadow-xl">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" placeholder="e.g. City-Wide Revival 2026" required className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe the event..."
                    className="min-h-[100px] rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longDescription">Full Details / Program</Label>
                  <Textarea
                    id="longDescription"
                    placeholder="Provide full details, speakers, and schedule..."
                    className="min-h-[200px] rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/5 shadow-xl">
              <CardHeader>
                <CardTitle>Location & Venue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Venue Name</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="location" placeholder="e.g. Central Plaza" className="pl-10 h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input id="address" placeholder="123 Faith Street, Grace City" className="h-12 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-primary/5 shadow-xl">
              <CardHeader>
                <CardTitle>Schedule & Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="date" className="pl-10 h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="time" className="pl-10 h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Revival</option>
                    <option>Worship</option>
                    <option>Conference</option>
                    <option>Youth</option>
                    <option>Prayer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Hero Image URL</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="https://unsplash.com/..." className="pl-10 h-12 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button type="submit" disabled={loading} className="w-full h-14 bg-primary text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 gap-2">
                <Save className="w-5 h-5" />
                {loading ? 'Publishing...' : 'Publish Event'}
              </Button>
              <Link href="/admin/events" className="block">
                <Button type="button" variant="outline" className="w-full h-14 text-lg rounded-2xl border-primary/20">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
