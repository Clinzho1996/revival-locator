'use client';

import { useParams } from 'next/navigation';
import { MOCK_EVENTS } from '@/lib/data';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Clean the slug (e.g., "youth-worship" -> "Youth")
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  const filteredEvents = MOCK_EVENTS.filter(
    (event) => event.category.toLowerCase() === slug.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Category Header */}
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to all events
          </Link>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <Sparkles className="w-3 h-3" />
              Category
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
              {categoryName} <span className="text-primary italic">Events</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl font-medium">
              Discover powerful {categoryName.toLowerCase()} gatherings, revivals, and community events near you.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
            </h2>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <h3 className="text-2xl font-bold text-slate-400">No events found in this category.</h3>
              <Link href="/">
                <Button className="mt-6 rounded-xl bg-primary px-8">Browse All Categories</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
