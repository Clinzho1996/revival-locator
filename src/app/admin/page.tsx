// app/admin/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRevival } from "@/hooks/useRevival";
import { format } from "date-fns";
import {
	Activity,
	Calendar,
	Heart,
	Loader2,
	MessageSquare,
	TrendingUp,
	Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const COLORS = [
	"#B91C1C",
	"#DC2626",
	"#EF4444",
	"#F87171",
	"#FCA5A5",
	"#FECACA",
];

export default function AdminOverview() {
	const {
		getAnalytics,
		analytics,
		getEvents,
		events,
		user,
		isLoading: storeLoading,
	} = useRevival();
	const [eventTrends, setEventTrends] = useState<
		{ date: string; count: number }[]
	>([]);
	const [categoryDistribution, setCategoryDistribution] = useState<
		{ name: string; value: number; fill: string }[]
	>([]);
	const [recentActivity, setRecentActivity] = useState<any[]>([]);
	const [localLoading, setLocalLoading] = useState(true); // Add local loading state

	// Use refs to prevent multiple fetches
	const hasInitialized = useRef(false);
	const isFetching = useRef(false);
	const eventsHash = useRef("");
	const analyticsHash = useRef("");

	// Create stable hash of data to detect actual changes
	const getEventsHash = useCallback(() => {
		return events.map((e) => e._id + e.updatedAt).join(",");
	}, [events]);

	const getAnalyticsHash = useCallback(() => {
		return JSON.stringify(analytics);
	}, [analytics]);

	// Fetch data only once on mount
	useEffect(() => {
		if (!hasInitialized.current && !isFetching.current) {
			hasInitialized.current = true;
			isFetching.current = true;

			const fetchData = async () => {
				try {
					await Promise.all([getAnalytics(), getEvents()]);
				} catch (err) {
					console.error("Fetch failed", err);
				} finally {
					isFetching.current = false;
				}
			};
			fetchData();
		}
	}, [getAnalytics, getEvents]);

	// Process event data when events change (but only if actually changed)
	useEffect(() => {
		const currentHash = getEventsHash();
		if (events.length > 0 && currentHash !== eventsHash.current) {
			eventsHash.current = currentHash;

			// Process events by date for trend chart
			const last7Days = [...Array(7)].map((_, i) => {
				const date = new Date();
				date.setDate(date.getDate() - (6 - i));
				return format(date, "MMM dd");
			});

			const trends = last7Days.map((date) => ({
				date,
				count: events.filter(
					(event: any) => format(new Date(event.createdAt), "MMM dd") === date,
				).length,
			}));
			setEventTrends(trends);

			// Process category distribution
			const categories = events.reduce(
				(acc: Record<string, number>, event: any) => {
					const categoryName =
						typeof event.category === "object" && event.category !== null
							? event.category.name
							: "Uncategorized";
					acc[categoryName] = (acc[categoryName] || 0) + 1;
					return acc;
				},
				{},
			);

			const pieData = Object.entries(categories).map(
				([name, value], index) => ({
					name: name.length > 15 ? name.substring(0, 12) + "..." : name,
					value,
					fill: COLORS[index % COLORS.length],
				}),
			);
			setCategoryDistribution(pieData);
		}
	}, [events, getEventsHash]);

	// Process recent activity when analytics change
	useEffect(() => {
		const currentHash = getAnalyticsHash();
		if (analytics && currentHash !== analyticsHash.current) {
			analyticsHash.current = currentHash;

			const eventActivities = events.slice(0, 3).map((event: any) => ({
				type: "event",
				title: `New event created: "${event.title}"`,
				time: event.createdAt,
				icon: Calendar,
			}));

			const userActivities = (analytics?.recent?.users || [])
				.slice(0, 2)
				.map((user: any) => ({
					type: "user",
					title: `New user registered: ${user.name}`,
					time: user.createdAt,
					icon: Users,
				}));

			const allActivities = [...eventActivities, ...userActivities]
				.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
				.slice(0, 5);
			setRecentActivity(allActivities);
		}
	}, [analytics, events, getAnalyticsHash]);

	// Use local loading state instead of store loading state
	if (localLoading && !events.length) {
		return (
			<div className="flex justify-center items-center h-96">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading analytics data...</p>
				</div>
			</div>
		);
	}

	const stats = [
		{
			title: "Total Events",
			value: analytics?.overview?.totalEvents?.toString() || "0",
			icon: Calendar,
			trend: "+12% from last month",
			color: "text-blue-500",
		},
		{
			title: "Total Users",
			value: analytics?.overview?.totalUsers?.toString() || "0",
			icon: Heart,
			trend: "+18% from last month",
			color: "text-rose-500",
		},
		{
			title: "Total Reviews",
			value: analytics?.overview?.totalReviews?.toString() || "0",
			icon: MessageSquare,
			trend: "+5% from last month",
			color: "text-amber-500",
		},
		{
			title: "Messages",
			value: analytics?.overview?.totalMessages?.toString() || "0",
			icon: Users,
			trend: "+24% from last month",
			color: "text-emerald-500",
		},
	];

	return (
		<div className="space-y-8">
			{/* Rest of your JSX remains exactly the same */}
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight text-primary">
					Overview
				</h1>
				<p className="text-muted-foreground">
					Welcome back, {user?.name || "Admin"}. Here is what's happening today.
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat) => (
					<Card
						key={stat.title}
						className="border-primary/5 shadow-md hover:shadow-lg transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								{stat.title}
							</CardTitle>
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

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Event Trends Chart */}
				<Card className="border-primary/5 shadow-md">
					<CardHeader>
						<CardTitle className="text-xl flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-primary" />
							Event Trends (Last 7 Days)
						</CardTitle>
					</CardHeader>
					<CardContent>
						{eventTrends.length > 0 && eventTrends.some((t) => t.count > 0) ? (
							<ResponsiveContainer width="100%" height={300}>
								<AreaChart data={eventTrends}>
									<defs>
										<linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#B91C1C" stopOpacity={0.8} />
											<stop offset="95%" stopColor="#B91C1C" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis allowDecimals={false} />
									<Tooltip />
									<Area
										type="monotone"
										dataKey="count"
										stroke="#B91C1C"
										fillOpacity={1}
										fill="url(#colorCount)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						) : (
							<div className="flex justify-center items-center h-72 text-muted-foreground">
								No event trend data available
							</div>
						)}
					</CardContent>
				</Card>

				{/* Category Distribution Pie Chart */}
				<Card className="border-primary/5 shadow-md">
					<CardHeader>
						<CardTitle className="text-xl flex items-center gap-2">
							<Activity className="h-5 w-5 text-primary" />
							Events by Category
						</CardTitle>
					</CardHeader>
					<CardContent>
						{categoryDistribution.length > 0 ? (
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={categoryDistribution}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, percent }: any) =>
											`${name}: ${(percent * 100).toFixed(0)}%`
										}
										outerRadius={80}
										dataKey="value"
									/>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						) : (
							<div className="flex justify-center items-center h-72 text-muted-foreground">
								No category data available
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Rest of your components */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Recent Activity */}
				<Card className="border-primary/5 shadow-md">
					<CardHeader>
						<CardTitle className="text-xl flex items-center gap-2">
							<Activity className="h-5 w-5 text-primary" />
							Recent Activity
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{recentActivity.length > 0 ? (
								recentActivity.map((activity, i) => {
									const Icon = activity.icon;
									const timeAgo = format(
										new Date(activity.time),
										"MMM dd, h:mm a",
									);
									return (
										<div key={i} className="flex gap-4 items-start">
											<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
												<Icon className="h-4 w-4 text-primary" />
											</div>
											<div className="flex-grow">
												<p className="text-sm font-medium">{activity.title}</p>
												<p className="text-xs text-muted-foreground">
													{timeAgo}
												</p>
											</div>
										</div>
									);
								})
							) : (
								<div className="text-center py-8 text-muted-foreground">
									No recent activity
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Quick Insights */}
				<Card className="border-primary/5 shadow-md bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
					<div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
					<CardHeader>
						<CardTitle className="text-xl">Quick Insights</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 relative z-10">
						<div className="pt-4 flex gap-3">
							<div className="flex-grow bg-white/10 rounded-xl p-4 text-center">
								<p className="text-2xl font-bold text-primary">
									{analytics?.overview?.totalEvents || 0}
								</p>
								<p className="text-[10px] uppercase opacity-70">Total Events</p>
							</div>
							<div className="flex-grow bg-white/10 rounded-xl p-4 text-center">
								<p className="text-2xl font-bold text-primary">
									{analytics?.overview?.totalUsers || 0}
								</p>
								<p className="text-[10px] uppercase opacity-70">Active Users</p>
							</div>
							<div className="flex-grow bg-white/10 rounded-xl p-4 text-center">
								<p className="text-2xl font-bold text-primary">
									{events.filter((e: any) => e.status === "pending").length}
								</p>
								<p className="text-[10px] uppercase opacity-70">Pending</p>
							</div>
						</div>

						<div className="mt-4 p-3 bg-primary/10 rounded-xl">
							<p className="text-xs font-medium">Pro Tip:</p>
							<p className="text-xs text-muted-foreground mt-1">
								Events with images get 40% more engagement. Encourage organizers
								to add high-quality photos.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Events Table */}
			<Card className="border-primary/5 shadow-md">
				<CardHeader>
					<CardTitle className="text-xl">Recent Events</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-primary/10">
									<th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
										Title
									</th>
									<th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
										Category
									</th>
									<th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
										Date
									</th>
									<th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
										Status
									</th>
									<th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
										Attendees
									</th>
								</tr>
							</thead>
							<tbody>
								{events.slice(0, 5).map((event: any) => {
									const categoryName =
										typeof event.category === "object" &&
										event.category !== null
											? event.category.name
											: "Uncategorized";
									return (
										<tr
											key={event._id}
											className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
											<td className="py-3 px-4 text-sm font-medium">
												{event.title}
											</td>
											<td className="py-3 px-4 text-sm text-muted-foreground">
												{categoryName}
											</td>
											<td className="py-3 px-4 text-sm text-muted-foreground">
												{format(new Date(event.date), "MMM dd, yyyy")}
											</td>
											<td className="py-3 px-4">
												<span
													className={`text-xs px-2 py-1 rounded-full ${
														event.status === "approved"
															? "bg-green-500/20 text-green-600"
															: event.status === "pending"
																? "bg-yellow-500/20 text-yellow-600"
																: "bg-red-500/20 text-red-600"
													}`}>
													{event.status || "Pending"}
												</span>
											</td>
											<td className="py-3 px-4 text-sm text-muted-foreground">
												{event.attendees || 0}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
