import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Activity,
  Heart
} from 'lucide-react';

const stats = [
  { title: 'Total Events', value: '42', icon: Calendar, trend: '+12% from last month', color: 'text-blue-500' },
  { title: 'Interested Worshippers', value: '1,284', icon: Heart, trend: '+18% from last month', color: 'text-rose-500' },
  { title: 'Forum Discussions', value: '156', icon: MessageSquare, trend: '+5% from last month', color: 'text-amber-500' },
  { title: 'Daily Visitors', value: '2,450', icon: Users, trend: '+24% from last month', color: 'text-emerald-500' },
];

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-primary/5 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-primary/5 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-grow">
                    <p className="text-sm font-medium">New interest expressed for "City-Wide Revival"</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/5 shadow-md bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <CardHeader>
            <CardTitle className="text-xl">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="opacity-90 leading-relaxed">
              Events in "Central Plaza" are seeing 40% more engagement compared to last year. Consider encouraging more organizers in that area.
            </p>
            <div className="pt-4 flex gap-3">
              <div className="flex-grow bg-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">85%</p>
                <p className="text-[10px] uppercase opacity-70">Engagement Rate</p>
              </div>
              <div className="flex-grow bg-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">12</p>
                <p className="text-[10px] uppercase opacity-70">New Organizers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
