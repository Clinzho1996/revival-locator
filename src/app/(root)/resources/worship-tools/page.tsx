'use client';

import { Button } from '@/components/ui/button';
import { Music, Download, Play, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WorshipToolsPage() {
  const tools = [
    { title: 'Victory in Praise - Lead Sheet', type: 'PDF', size: '2.4 MB' },
    { title: 'Morning Worship Pads - Atmosphere', type: 'WAV', size: '45 MB' },
    { title: 'Chord Chart: Waymaker (Acoustic)', type: 'PDF', size: '1.2 MB' },
    { title: 'Multi-track: Heart of Worship', type: 'ZIP', size: '120 MB' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-[400px] overflow-hidden">
        <img src="/resources/worship.png" className="w-full h-full object-cover" alt="Worship Tools" />
        <div className="absolute inset-0 bg-slate-900/60 flex flex-col justify-end p-12">
          <div className="container mx-auto">
            <Link href="/resources" className="text-white/60 hover:text-white flex items-center mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
            </Link>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Worship Tools</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{tool.title}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{tool.type} • {tool.size}</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="rounded-xl hover:bg-blue-500 hover:text-white transition-colors">
                <Download className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
