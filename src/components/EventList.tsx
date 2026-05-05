'use client';

import { ChristianEvent } from '@/types';
import { EventCard } from './EventCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Search, Filter, Sparkles, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { differenceInDays, isToday, isFuture, parseISO, format } from 'date-fns';
import { useState } from 'react';

interface EventListProps {
  events: ChristianEvent[];
}

export function EventList({ events }: EventListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filtering logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Sorting logic: Closest to today first
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    const now = new Date();

    const diffA = Math.abs(differenceInDays(dateA, now));
    const diffB = Math.abs(differenceInDays(dateB, now));

    return diffA - diffB;
  });

  const categories = ['All', 'Revival', 'Conference', 'Youth', 'Worship', 'Prayer'];

  const featuredEvent = sortedEvents.find(e => e.interestCount > 100) || sortedEvents[0];
  const otherEvents = sortedEvents.filter(e => e.id !== featuredEvent?.id);

  return (
    <div className="space-y-12">


      {/* Modern Filter Tabs (Airbnb Style) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 sticky top-24 z-40 bg-white/80 backdrop-blur-xl py-4 -mx-4 px-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${activeCategory === cat
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {sortedEvents.length} Results
          </p>
          <div className="h-4 w-[1px] bg-slate-200" />
          <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group">
            Latest First
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Event Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {featuredEvent && (
          <div className="md:col-span-2 lg:col-span-3 mb-4">
            <FeaturedEventCard event={featuredEvent} />
          </div>
        )}

        {otherEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {sortedEvents.length === 0 && (
        <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">No events found yet.</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">
            We couldn't find any events matching your current filters. Try adjusting your search or category.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="mt-8 text-primary font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

// Side component for the featured item
function FeaturedEventCard({ event }: { event: ChristianEvent }) {
  const eventDate = new Date(event.date);
  return (
    <div className="group relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-2xl transition-all hover:shadow-primary/10">
      <img src={event.imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80" />

      <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end text-white space-y-6">
        <div className="flex items-center gap-3">
          <Badge className="bg-primary hover:bg-primary border-none text-white px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">Featured Event</Badge>
          <Badge className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">{event.category}</Badge>
        </div>

        <div className="max-w-4xl space-y-4">
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors cursor-pointer capitalize">
            {event.title}
          </h3>
          <p className="text-white/70 text-lg md:text-xl font-medium line-clamp-2 max-w-2xl leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-primary">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">When</p>
              <p className="font-bold">{format(eventDate, 'EEEE, MMM dd')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Where</p>
              <p className="font-bold line-clamp-1">{event.location}</p>
            </div>
          </div>
          <div className="flex-grow md:flex md:justify-end">
            <Link href={`/events/${event.id}`}>
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-white text-slate-900 hover:bg-primary hover:text-white font-black text-lg transition-all shadow-xl shadow-black/20 group/btn">
                Reserve My Spot
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
