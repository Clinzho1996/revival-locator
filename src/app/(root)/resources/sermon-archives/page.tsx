'use client';

import { Button } from '@/components/ui/button';
import { Video, Play, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function SermonArchivesPage() {
  const sermons = [
    { title: 'The Power of Pentecost', speaker: 'Pastor Marcus Johnson', date: 'Oct 12, 2025' },
    { title: 'Walking in Faith', speaker: 'Evangelist Sarah Williams', date: 'Oct 05, 2025' },
    { title: 'Modern Revival', speaker: 'Dr. David Smith', date: 'Sep 28, 2025' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-[400px] overflow-hidden">
        <img src="/resources/sermons.png" className="w-full h-full object-cover" alt="Sermon Archives" />
        <div className="absolute inset-0 bg-slate-900/60 flex flex-col justify-end p-12">
          <div className="container mx-auto">
            <Link href="/resources" className="text-white/60 hover:text-white flex items-center mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
            </Link>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Sermon Archives</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="space-y-6">
          {sermons.map((sermon, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-xl transition-all">
              <div className="flex items-center gap-8">
                <div className="relative w-40 aspect-video rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center group/play">
                  <Play className="w-10 h-10 text-slate-300 group-hover/play:text-primary transition-colors" />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/play:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{sermon.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-primary font-bold">{sermon.speaker}</p>
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <Calendar className="w-4 h-4" />
                      {sermon.date}
                    </div>
                  </div>
                </div>
              </div>
              <Button size="lg" className="rounded-xl bg-slate-900 hover:bg-primary font-bold">Watch Now</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
