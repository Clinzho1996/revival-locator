'use client';

import { use } from 'react';
import { MOCK_EVENTS } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Share2, Heart, Info, Clock, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ReviewSystem } from '@/components/ReviewSystem';
import { CommunityForum } from '@/components/CommunityForum';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = MOCK_EVENTS.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  const handleInterest = () => {
    toast.success("Awesome! We'll notify you about updates for this event.", {
      description: `You've expressed interest in ${event.title}.`,
      action: {
        label: 'Add to Calendar',
        onClick: () => toast.info('Integration coming soon!'),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="container mx-auto px-4 absolute bottom-0 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4 max-w-2xl">
              <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 text-sm rounded-full">
                {event.category}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {format(new Date(event.date), 'MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  {event.startTime}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {event.location}
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button onClick={handleInterest} className="flex-grow md:flex-grow-0 h-14 px-8 bg-primary hover:bg-primary/90 text-lg rounded-2xl shadow-lg shadow-primary/20 gap-2">
                <Heart className="w-5 h-5 fill-current" />
                I'm Interested
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-primary/20 hover:bg-primary/5">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-3xl font-bold border-l-4 border-primary pl-4">About the Event</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground text-lg leading-relaxed">
                <p>{event.longDescription || event.description}</p>
              </div>
            </section>

            <section className="bg-primary/5 rounded-[2rem] p-8 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="font-bold text-xl uppercase tracking-wider">Note to attendees</h3>
              </div>
              <p className="text-muted-foreground opacity-90">
                This event is open to everyone. Please arrive at least 30 minutes before the start time to ensure proper seating and preparation. Registration is free but highly encouraged.
              </p>
            </section>

            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="bg-primary/5 p-1 mb-6 rounded-2xl w-full justify-start sm:w-auto">
                <TabsTrigger value="reviews" className="rounded-xl px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Experience & Reviews
                </TabsTrigger>
                <TabsTrigger value="forum" className="rounded-xl px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Community Chat
                </TabsTrigger>
              </TabsList>
              <TabsContent value="reviews">
                <ReviewSystem reviews={event.reviews} eventId={event.id} />
              </TabsContent>
              <TabsContent value="forum">
                <CommunityForum messages={event.forumMessages} eventId={event.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="rounded-[2rem] border-primary/10 shadow-xl overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xl font-bold">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Level</p>
                      <p className="font-bold">{event.interestCount.toLocaleString()} Worshippers</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Full Address</p>
                      <p className="font-bold">{event.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Organizer</p>
                      <p className="font-bold">{event.organizer}</p>
                    </div>
                  </div>
                </div>
                <hr className="border-primary/5" />
                <Button variant="outline" className="w-full h-12 rounded-xl group hover:border-primary">
                  Contact Organizer
                </Button>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-[2rem] border border-primary/10 space-y-4">
              <h4 className="font-bold text-lg">Proximity Check</h4>
              <p className="text-sm text-muted-foreground">
                This event is happening in <strong>{event.location}</strong>.
                Based on your current location, it is one of the closest gatherings this week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
