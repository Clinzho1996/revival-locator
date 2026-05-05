'use client';

import { Button } from '@/components/ui/button';
import { Mic, Play, ArrowLeft, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function PodcastsPage() {
  const episodes = [
    { title: 'The Sound of Reivval', host: 'John & Mary', duration: '45 mins' },
    { title: 'Leading in Times of Change', host: 'Pastor Chris', duration: '32 mins' },
    { title: 'Worship as a Lifestyle', host: 'Avery Mitchell', duration: '50 mins' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-[400px] overflow-hidden">
        <img src="/resources/podcasts.png" className="w-full h-full object-cover" alt="Podcasts" />
        <div className="absolute inset-0 bg-slate-900/60 flex flex-col justify-end p-12">
          <div className="container mx-auto">
            <Link href="/resources" className="text-white/60 hover:text-white flex items-center mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
            </Link>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Faith Talk Podcast</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {episodes.map((ep, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all">
              <div className="flex items-center gap-6">
                <Button size="icon" className="w-14 h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
                  <Play className="w-6 h-6 fill-current" />
                </Button>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{ep.title}</h3>
                  <p className="text-sm font-medium text-slate-400">Host: {ep.host} • {ep.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl hover:text-primary"><Heart className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-xl"><Share2 className="w-5 h-5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
