"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRevival } from "@/hooks/useRevival";
import { Event } from "@/store/useRevivalStore";
import { differenceInDays, format, parseISO } from "date-fns";
import { ArrowRight, Calendar, Loader2, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { EventCard } from "./EventCard";

interface EventListProps {
	initialEvents?: Event[]; // Optional for SSR
}

export function EventList({ initialEvents = [] }: EventListProps) {
	const {
		events: apiEvents,
		isLoading: storeLoading,
		error,
		getEvents,
		searchEvents,
		categories,
		getCategories,
	} = useRevival();

	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");
	const [sortBy, setSortBy] = useState<"closest" | "latest" | "popular">(
		"closest",
	);

	const hasInitialized = useRef(false);
	const isUsingInitialEvents = initialEvents.length > 0;

	// Get events data - prioritize initialEvents from parent and filter only approved
	const eventsData = (isUsingInitialEvents ? initialEvents : apiEvents).filter(
		(event) => event.status === "approved",
	);
	const isLoading = storeLoading && !isUsingInitialEvents;

	// Only fetch categories (always needed), but skip events if we have initialEvents
	useEffect(() => {
		getCategories();

		// Only fetch events if we don't have initialEvents
		if (!hasInitialized.current && !isUsingInitialEvents) {
			getEvents();
			hasInitialized.current = true;
		}
	}, []);

	// Handle local search - only trigger if we're not using initialEvents
	const handleLocalSearch = (query: string) => {
		setSearchQuery(query);
		if (!isUsingInitialEvents && query) {
			const debounce = setTimeout(() => {
				searchEvents(query);
			}, 300);
			return () => clearTimeout(debounce);
		}
	};

	// Create a map of category IDs to names for easy lookup
	const categoryMap = useMemo(() => {
		const map = new Map();
		categories.forEach((cat) => {
			map.set(cat._id, cat.name);
		});
		return map;
	}, [categories]);

	// Enhance events with category names
	const enhancedEvents = useMemo(() => {
		if (!eventsData || eventsData.length === 0) return [];

		return eventsData.map((event) => ({
			...event,
			categoryName: event.category
				? typeof event.category === "object"
					? event.category.name
					: categoryMap.get(event.category) || "Uncategorized"
				: "Uncategorized",
		}));
	}, [eventsData, categoryMap]);

	// Filtering logic
	const filteredEvents = enhancedEvents.filter((event) => {
		const matchesSearch =
			!searchQuery ||
			event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.location?.address
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			event.location?.city?.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesCategory =
			activeCategory === "All" || event.categoryName === activeCategory;

		return matchesSearch && matchesCategory;
	});

	// Sorting logic
	const sortedEvents = [...filteredEvents].sort((a, b) => {
		const dateA = parseISO(a.date);
		const dateB = parseISO(b.date);
		const now = new Date();

		switch (sortBy) {
			case "latest":
				return dateB.getTime() - dateA.getTime();
			case "popular":
				return (b.attendees || 0) - (a.attendees || 0);
			case "closest":
			default:
				const diffA = Math.abs(differenceInDays(dateA, now));
				const diffB = Math.abs(differenceInDays(dateB, now));
				return diffA - diffB;
		}
	});

	// Get unique categories from API or use fallback
	const categoryList = useMemo(() => {
		if (categories.length > 0) {
			return ["All", ...categories.map((cat) => cat.name)];
		}
		return ["All", "Revival", "Conference", "Youth", "Worship", "Prayer"];
	}, [categories]);

	// Find featured event (first event if available)
	const featuredEvent = sortedEvents.length > 0 ? sortedEvents[0] : null;
	const otherEvents = featuredEvent ? sortedEvents.slice(1) : [];
	const mobileEvents = featuredEvent ? sortedEvents.slice(0) : [];

	if (isLoading && eventsData.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[3rem]">
				<Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
				<p className="text-slate-500 font-medium">Loading events...</p>
			</div>
		);
	}

	if (error && eventsData.length === 0 && !isUsingInitialEvents) {
		return (
			<div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-red-200">
				<div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
					<Search className="w-10 h-10 text-red-300" />
				</div>
				<h3 className="text-2xl font-black text-slate-900">
					Unable to load events
				</h3>
				<p className="text-red-500 mt-2 max-w-sm mx-auto font-medium">
					{error}
				</p>
				<button
					onClick={() => getEvents()}
					className="mt-8 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition">
					Try Again
				</button>
			</div>
		);
	}

	// Show message when no events
	if (sortedEvents.length === 0 && !isLoading) {
		return (
			<div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
				<div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
					<Search className="w-10 h-10 text-slate-300" />
				</div>
				<h3 className="text-2xl font-black text-slate-900">No events found</h3>
				<p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">
					{searchQuery || activeCategory !== "All"
						? "No events match your current filters. Try adjusting your search or category."
						: "No approved events are currently available. Check back later for new events!"}
				</p>
				{(searchQuery || activeCategory !== "All") && (
					<button
						onClick={() => {
							setSearchQuery("");
							setActiveCategory("All");
						}}
						className="mt-8 text-primary font-bold hover:underline">
						Clear all filters
					</button>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-12" id="event-list">
			{/* Search Bar */}
			<div className="relative max-w-2xl mx-auto">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
				<Input
					type="text"
					placeholder="Search events by title, location, or description..."
					value={searchQuery}
					onChange={(e) => handleLocalSearch(e.target.value)}
					className="pl-12 py-6 rounded-2xl border-slate-200 focus:border-primary focus:ring-primary text-base"
				/>
			</div>

			{/* Modern Filter Tabs */}
			<div className="flex flex-col md:flex-row justify-between items-center gap-8 sticky top-24 z-40 bg-white/80 backdrop-blur-xl py-4 -mx-4 px-4 rounded-3xl border border-slate-100 shadow-sm">
				<div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
					{categoryList.map((cat: any) => (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
								activeCategory === cat
									? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
									: "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
							}`}>
							{cat}
						</button>
					))}
				</div>
				<div className="flex items-center gap-4 shrink-0">
					<p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
						{sortedEvents.length} Results
					</p>
					<div className="h-4 w-[1px] bg-slate-200" />
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as any)}
						className="text-sm font-bold text-primary bg-transparent border-none cursor-pointer focus:outline-none">
						<option value="closest">Closest to me</option>
						<option value="latest">Latest First</option>
						<option value="popular">Most Popular</option>
					</select>
				</div>
			</div>

			{/* Event Grid Layout */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
				{/* Show featured event only if there are more events */}
				{featuredEvent && sortedEvents.length > 1 && (
					<div className="md:col-span-2 lg:col-span-3 mb-4">
						<FeaturedEventCard
							event={featuredEvent}
							categoryMap={categoryMap}
						/>
					</div>
				)}

				{/* If only one event, show it as a regular card */}
				{featuredEvent && sortedEvents.length === 1 && (
					<EventCard key={featuredEvent._id} event={featuredEvent} />
				)}

				{/* Show other events for desktop */}
				{otherEvents.map((event) => (
					<div key={event._id} className="hidden md:block">
						<EventCard event={event} />
					</div>
				))}

				{/* Show all events for mobile */}
				{mobileEvents.map((event) => (
					<div key={event._id} className="md:hidden">
						<EventCard event={event} />
					</div>
				))}
			</div>
		</div>
	);
}

// Updated FeaturedEventCard with better null handling
function FeaturedEventCard({
	event,
	categoryMap,
}: {
	event: Event & { categoryName?: string };
	categoryMap: Map<string, string>;
}) {
	const eventDate = parseISO(event.date);
	const location =
		typeof event.location === "object" && event.location
			? `${event.location.address || ""}${event.location.city ? ", " + event.location.city : ""}`
			: "Location TBA";

	// Get category name
	const categoryName =
		event.categoryName ||
		(event?.category
			? typeof event.category === "object"
				? event.category.name
				: categoryMap.get(event.category) || "Uncategorized"
			: "Uncategorized");

	return (
		<div className="group hidden md:block relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-2xl transition-all hover:shadow-primary/10">
			<img
				src={
					event.banner ||
					event.image ||
					"https://images.unsplash.com/photo-1438032945730-e6e5b1a5b6d3?w=1200"
				}
				alt={event.title}
				className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

			<div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end text-white space-y-6">
				<div className="flex items-center gap-3 flex-wrap">
					<Badge className="bg-primary hover:bg-primary border-none text-white px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
						Featured Event
					</Badge>
					<Badge className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
						{categoryName}
					</Badge>
					{/* {event.isFree && (
						<Badge className="bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-300 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
							Free Event
						</Badge>
					)} */}
				</div>

				<div className="max-w-4xl space-y-4">
					<h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors cursor-pointer capitalize">
						{event.title}
					</h3>
					<p className="text-white/70 text-lg md:text-xl font-medium line-clamp-2 max-w-2xl leading-relaxed">
						{event.description}
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-white/10">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-primary">
							<Calendar className="w-6 h-6" />
						</div>
						<div>
							<p className="text-[10px] font-black uppercase text-white/40 tracking-widest">
								When
							</p>
							<p className="font-bold">
								{format(eventDate, "EEEE, MMM dd, yyyy")}
							</p>
							{event.time && (
								<p className="text-xs text-white/60">{event.time}</p>
							)}
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-primary">
							<MapPin className="w-6 h-6" />
						</div>
						<div>
							<p className="text-[10px] font-black uppercase text-white/40 tracking-widest">
								Where
							</p>
							<p className="font-bold line-clamp-1">{location}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
							<span className="text-white font-black text-lg">
								{event.attendees || 0}
							</span>
						</div>
						<div>
							<p className="text-[10px] font-black uppercase text-white/40 tracking-widest">
								Attending
							</p>
							<p className="font-bold">People going</p>
						</div>
					</div>
					<div className="flex-grow md:flex md:justify-end">
						<Link href={`/events/${event._id}`}>
							{/* <Button
								size="lg"
								className="h-16 px-10 rounded-2xl bg-white text-slate-900 hover:bg-primary hover:text-white font-black text-lg transition-all shadow-xl shadow-black/20 group/btn">
								{event.isFree
									? "Reserve Free Spot"
									: event.price
										? `Book Now - $${event.price}`
										: "Register Now"}
								<ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-2" />
							</Button> */}

							<Button
								size="lg"
								className="h-16 px-10 rounded-2xl bg-white text-slate-900 hover:bg-primary hover:text-white font-black text-lg transition-all shadow-xl shadow-black/20 group/btn">
								Register Now
								<ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-2" />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
