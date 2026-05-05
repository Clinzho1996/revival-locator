'use client';

import { Star, Quote, Heart, MessageSquare } from 'lucide-react';

export default function TestimoniesPage() {
  const testimonies = [
    {
      name: 'Sarah Mitchell',
      event: 'City-Wide Revival 2026',
      content: 'I came in broken and left completely restored. The atmosphere of worship was like nothing I have ever experienced. God is truly moving through these gatherings!',
      rating: 5,
      avatar: 'https://i.pravatar.cc/100?img=12'
    },
    {
      name: 'James Wilson',
      event: 'Youth Worship Night',
      content: 'Seeing so many young people on fire for God gave me so much hope. The energy and sincerity in that room was contagious. Highly recommend!',
      rating: 5,
      avatar: 'https://i.pravatar.cc/100?img=15'
    },
    {
      name: 'Grace Thompson',
      event: 'Leadership Conference',
      content: 'Invaluable insights for my local ministry. I left with practical tools and a renewed passion for leading my congregation. Truly a blessing.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/100?img=20'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-20">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Quote className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900">
            Stories of <span className="text-primary italic">Transformation</span>.
          </h1>
          <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto italic">
            "But they overcame him by the blood of the Lamb and by the word of their testimony..." — Revelation 12:11
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonies.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/5">
                  <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest">{item.event}</p>
                </div>
              </div>

              <div className="flex mb-6 gap-1 text-amber-500">
                {[...Array(item.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>

              <p className="text-lg text-slate-600 font-medium leading-relaxed italic mb-8">
                "{item.content}"
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs font-bold">24</span>
                  </div>
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-bold">3</span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">2 Days Ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
