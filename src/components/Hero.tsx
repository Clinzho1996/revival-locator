'use client';

import { Button } from '@/components/ui/button';
import { Search, MapPin, Sparkles, Calendar, Users, Church } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Hero() {
  const trendingTags = ['Revival', 'Worship Night', 'Youth Conference', 'Healing Service'];

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-20 font-sans">
      {/* Background Layer with Soft Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.85), rgba(185, 28, 28, 0.2)), url("https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Modern Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[150px] animate-pulse delay-1000 opacity-40" />

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-12 md:space-y-16">

          {/* Headline Section */}
          <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 group hover:bg-white/10 transition-colors cursor-default">
              <Sparkles className="w-4 h-4 text-orange-400 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Connect with the Spirit</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] drop-shadow-2xl text-white">
              Find Your Next <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-orange-500 to-yellow-500">
                Divine
              </span> Encounter
            </h1>

            <p className="text-lg md:text-2xl font-light text-white/70 max-w-2xl mx-auto leading-relaxed">
              Discover powerful revivals, life-changing conferences, and intimate worship nights happening in your city.
            </p>
          </div>

          {/* Intuitive Dual-Field Search Container */}
          <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            <div className="group relative">
              <div className="absolute -inset-1 bg-linear-to-r from-primary/30 to-orange-500/30 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex flex-col md:flex-row items-stretch p-2 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl transition-all duration-300 group-hover:border-white/20">

                <div className="relative flex-grow flex items-center px-6 py-4 md:py-0 border-b md:border-b-0 md:border-r border-white/10 group/input">
                  <Search className="text-white/40 w-5 h-5 mr-3 group-hover/input:text-primary transition-colors shrink-0" />
                  <Input
                    placeholder="Event, church, or keyword..."
                    className="h-12 bg-transparent border-none text-white placeholder:text-white/30 text-lg focus-visible:ring-0 px-0 w-full"
                  />
                </div>

                <div className="relative flex-grow flex items-center px-6 py-4 md:py-0 group/input">
                  <MapPin className="text-white/40 w-5 h-5 mr-3 group-hover/input:text-orange-400 transition-colors shrink-0" />
                  <Input
                    placeholder="City or zip code..."
                    className="h-12 bg-transparent border-none text-white placeholder:text-white/30 text-lg focus-visible:ring-0 px-0 w-full"
                  />
                </div>

                <Button className="h-14 md:h-16 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 shrink-0">
                  Explore Now
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm text-white/50">
              <span className="font-medium mr-2">Trending:</span>
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all text-xs font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Social Proof & Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pt-12 border-t border-white/5 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500 pb-10">
            {[
              { label: 'Active Gatherings', value: '800+', Icon: Church },
              { label: 'Worshippers', value: '15k+', Icon: Users },
              { label: 'Monthly Events', value: '120+', Icon: Calendar },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="p-3 rounded-2xl bg-white/5 mb-4 group-hover:bg-primary/10 transition-colors">
                  <stat.Icon className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-3xl font-black bg-clip-text bg-linear-to-b from-white to-white/60 text-white">
                  {stat.value}
                </p>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-2 text-center">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Refined Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-30 hover:opacity-60 transition-opacity cursor-pointer z-20">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white mb-3">Scroll Down</span>
        <div className="w-[1px] h-16 bg-linear-to-b from-white via-white/50 to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scroll" />
        </div>
      </div>
    </div>
  );
}
