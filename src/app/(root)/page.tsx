import { Hero } from '@/components/Hero';
import { EventList } from '@/components/EventList';
import { MOCK_EVENTS } from '@/lib/data';

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      <Hero />

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-background rounded-t-[3rem] p-8 md:p-12 shadow-[0_-20px_50px_-15px_rgba(185,28,28,0.15)] border-x border-t border-primary/5">
          <EventList events={MOCK_EVENTS} />
        </div>
      </div>

      {/* Featured Categories - NEW SECTION */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-bold text-primary">Browse by Category</h2>
          <p className="text-muted-foreground">Find the specific spiritual atmosphere you're looking for.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Revival', icon: '🔥', count: 120 },
            { name: 'Worship', icon: '🎸', count: 85 },
            { name: 'Youth', icon: '🙌', count: 45 },
            { name: 'Conference', icon: '📢', count: 32 },
            { name: 'Prayer', icon: '🙏', count: 67 },
            { name: 'Healing', icon: '✨', count: 24 },
          ].map((cat) => (
            <div key={cat.name} className="group p-6 rounded-3xl bg-card border border-primary/5 hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer text-center space-y-3">
              <span className="text-4xl group-hover:scale-125 transition-transform block">{cat.icon}</span>
              <h3 className="font-bold">{cat.name}</h3>
              <p className="text-xs text-muted-foreground">{cat.count} Events</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why RevivalLocator - NEW SECTION */}
      <section className="bg-primary/5 py-24 my-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/10 to-transparent blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-primary">A Modern Way to Find Revival</h2>
            <p className="text-lg text-muted-foreground">We connect worshippers with powerful encounters through technology and community.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Near You",
                desc: "Smart geolocation finds the closest spiritual gatherings instantly.",
                icon: "📍"
              },
              {
                title: "Vetted Events",
                desc: "Verified organizers ensure high-quality and safe worship environments.",
                icon: "✅"
              },
              {
                title: "Community Driven",
                desc: "Read testimonies and reviews from people who attended previous events.",
                icon: "💬"
              }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 p-8 rounded-[2rem] bg-background/50 backdrop-blur-sm border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Newsletter Section */}
      <section className="container mx-auto px-4 mt-20 mb-32">
        <div className="bg-slate-950 rounded-[3rem] p-8 md:p-20 text-white text-center space-y-8 relative overflow-hidden group">
          {/* Abstract decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-primary/30 transition-colors duration-700" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full -ml-32 -mb-32 blur-[100px]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">Never Miss a Revival</h2>
            <p className="text-lg opacity-90">Get notified when new spiritual gatherings are happening in your area.</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow h-14 rounded-2xl px-6 bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
              />
              <button className="h-14 px-8 bg-white text-primary font-bold rounded-2xl hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
