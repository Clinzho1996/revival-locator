'use client';

import { Button } from '@/components/ui/button';
import { BookOpen, Download, ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';

export default function PrayerGuidesPage() {
  const guides = [
    { title: '21 Days of Fasting Guide', pages: '32 Pages', author: 'Revival Network' },
    { title: 'Morning Prayer Devotional', pages: '15 Pages', author: 'Prayer Warriors Int' },
    { title: 'Intercessory Prayer Manual', pages: '50 Pages', author: 'Holy Ground Ministry' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-[400px] overflow-hidden">
        <img src="/resources/prayer.png" className="w-full h-full object-cover" alt="Prayer Guides" />
        <div className="absolute inset-0 bg-slate-900/60 flex flex-col justify-end p-12">
          <div className="container mx-auto">
            <Link href="/resources" className="text-white/60 hover:text-white flex items-center mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
            </Link>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Prayer Guides</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between group hover:shadow-2xl transition-all">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{guide.title}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{guide.pages} • {guide.author}</p>
                </div>
              </div>
              <Button className="mt-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold w-full transition-all">
                Download PDF
                <Download className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
