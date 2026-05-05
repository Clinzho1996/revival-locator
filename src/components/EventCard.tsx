'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Star } from 'lucide-react';
import { ChristianEvent } from '@/types';
import { format } from 'date-fns';

interface EventCardProps {
  event: ChristianEvent;
}

export function EventCard({ event }: EventCardProps) {
  const averageRating = event.reviews.length > 0
    ? event.reviews.reduce((acc, r) => acc + r.rating, 0) / event.reviews.length
    : 0;

  const eventDate = new Date(event.date);

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(185,28,28,0.2)] border-primary/10 bg-card hover:-translate-y-2 rounded-[2rem]">
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000"
        />

        {/* Modern Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Link href={`/events/category/${event.category.toLowerCase()}`}>
            <Badge className="w-fit bg-white/20 backdrop-blur-xl text-white border-white/20 hover:bg-white/30 transition-colors px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer">
              {event.category}
            </Badge>
          </Link>
          {event.interestCount > 50 && (
            <Badge className="w-fit bg-orange-500/80 backdrop-blur-md text-white border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
              Trending
            </Badge>
          )}
        </div>

        {/* Dynamic Date Overlay */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 px-4 text-center shadow-2xl transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 group-hover:bg-primary group-hover:text-white">
          <p className="text-[10px] font-black uppercase text-primary leading-none group-hover:text-white/80 transition-colors">{format(eventDate, 'MMM')}</p>
          <p className="text-2xl font-black text-slate-900 leading-none mt-1 group-hover:text-white transition-colors">{format(eventDate, 'dd')}</p>
        </div>
      </div>

      <CardHeader className="p-6 pb-2 space-y-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors cursor-pointer">
            {event.title}
          </CardTitle>
          {averageRating > 0 && (
            <div className="flex items-center bg-amber-500/10 px-2.5 py-1.5 rounded-xl text-amber-600 font-black text-sm border border-amber-500/20 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-current mr-1.5" />
              <span>{averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center text-slate-500 text-sm font-semibold">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <span>{format(eventDate, 'EEEE, p')}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm font-semibold">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-4">
        <p className="text-[15px] text-slate-600 line-clamp-2 leading-relaxed font-medium">
          {event.description}
        </p>
      </CardContent>

      <CardFooter className="px-6 py-5 flex justify-between items-center border-t border-slate-100 bg-linear-to-b from-transparent to-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 transition-space duration-500 group-hover:-space-x-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden ring-1 ring-slate-100">
                <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="avatar" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {event.interestCount}+ Going
          </div>
        </div>
        <Link href={`/events/${event.id}`}>
          <Button size="lg" className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all">
            Join
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
