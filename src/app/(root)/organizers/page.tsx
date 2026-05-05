'use client';

import { Button } from '@/components/ui/button';
import { Church, Users, Shield, Zap, ArrowRight } from 'lucide-react';

export default function OrganizersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-bold uppercase tracking-widest">
            <Church className="w-4 h-4" />
            For Event Hosts
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
            Empower Your <span className="text-primary italic">Ministry</span> Through Community.
          </h1>
          <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            RevivalLocator helps you connect with thousands of believers looking for their next divine encounter.
            List your events, manage interest, and grow your spiritual movement.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="rounded-2xl h-16 px-10 bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105">
              Host an Event
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl h-16 px-10 border-slate-200 text-slate-900 font-black text-lg hover:bg-slate-50 transition-all">
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            {
              title: 'Global Reach',
              description: 'Connect with believers across the country who are hungry for a move of God.',
              icon: Users,
            },
            {
              title: 'Secure Platform',
              description: 'Manage your event details and attendee interest with our secure, easy-to-use tools.',
              icon: Shield,
            },
            {
              title: 'Spiritual Impact',
              description: 'Focus on ministry while we handle the discovery and connection for your gatherings.',
              icon: Zap,
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
