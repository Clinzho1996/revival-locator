'use client';

import { Button } from '@/components/ui/button';
import { BookOpen, Video, Music, Mic, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ResourcesPage() {
  const categories = [
    { title: 'Worship Tools', slug: 'worship-tools', icon: Music, count: '120+ Items', color: 'bg-blue-500' },
    { title: 'Sermon Archives', slug: 'sermon-archives', icon: Video, count: '500+ Videos', color: 'bg-purple-500' },
    { title: 'Prayer Guides', slug: 'prayer-guides', icon: BookOpen, count: '45 Booklets', color: 'bg-emerald-500' },
    { title: 'Podcasts', slug: 'podcasts', icon: Mic, count: '80 Episodes', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">
            Spiritual <span className="text-primary underline decoration-primary/20 underline-offset-8">Resources</span> Hub.
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Equipping you for every step of your spiritual journey. Browse our curated collection of worship music,
            teaching, and practical ministry tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {categories.map((cat, i) => (
            <Link key={i} href={`/resources/${cat.slug}`}>
              <div className="relative overflow-hidden group p-8 rounded-[2rem] border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl transition-all cursor-pointer h-full">
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{cat.count}</p>
                <div className="mt-8 flex items-center text-primary font-bold text-sm">
                  Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Weekly Revival Newsletter</h2>
            <p className="text-white/60 font-medium">Get the latest event news and spiritual resources delivered to your inbox.</p>
          </div>
          <div className="relative z-10 flex w-full md:w-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border border-white/20 rounded-xl px-6 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
            />
            <Button size="lg" className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
