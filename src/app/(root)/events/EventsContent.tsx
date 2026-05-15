// app/events/page.tsx
"use client";

import { EventList } from "@/components/EventList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useRevival } from "@/hooks/useRevival";
import { differenceInMinutes, isFuture, isToday, parseISO } from "date-fns";
import { Filter, Loader2, MapPin, X, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function EventsContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { events, isLoading, getEvents, categories, getCategories } =
		useRevival();

	const [searchTerm, setSearchTerm] = useState(
		searchParams.get("search") || "",
	);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [selectedCity, setSelectedCity] = useState<string>("all");
	const [dateFilter, setDateFilter] = useState<string>("all");
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
	const [showLiveOnly, setShowLiveOnly] = useState(false);
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [cities, setCities] = useState<string[]>([]);

	useEffect(() => {
		getEvents();
		getCategories();
	}, []);

	// Extract unique cities from events
	useEffect(() => {
		if (events.length > 0) {
			const uniqueCities = [
				...new Set(
					events
						.map((event) =>
							typeof event.location === "object" ? event.location.city : null,
						)
						.filter(Boolean),
				),
			] as string[];
			setCities(uniqueCities);
		}
	}, [events]);

	// Check if an event is currently live
	const isEventLive = (event: any) => {
		const eventDate = parseISO(event.date);

		if (!isToday(eventDate)) return false;

		if (event.time) {
			const [hours, minutes] = event.time.split(":").map(Number);
			const eventDateTime = new Date(eventDate);
			eventDateTime.setHours(hours || 0, minutes || 0);

			const now = new Date();
			const minutesUntilStart = differenceInMinutes(eventDateTime, now);
			const minutesSinceStart = differenceInMinutes(now, eventDateTime);

			// Live if within 2 hours before or 3 hours after start
			return (
				(minutesUntilStart <= 120 && minutesUntilStart > 0) ||
				(minutesSinceStart >= 0 && minutesSinceStart <= 180)
			);
		}

		return isToday(eventDate);
	};

	// Filter and sort events
	const filteredEvents = useMemo(() => {
		let filtered = [...events];

		// Filter only approved events
		filtered = filtered.filter((event) => event.status === "approved");

		// Live only filter
		if (showLiveOnly) {
			filtered = filtered.filter(isEventLive);
		}

		// Search term filter
		if (searchTerm) {
			filtered = filtered.filter(
				(event) =>
					event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(typeof event.location === "object" &&
						event.location.city
							?.toLowerCase()
							.includes(searchTerm.toLowerCase())),
			);
		}

		// Category filter
		if (selectedCategory !== "all") {
			filtered = filtered.filter((event) => {
				const categoryId =
					typeof event.category === "object"
						? event.category._id
						: event.category;
				return categoryId === selectedCategory;
			});
		}

		// City filter
		if (selectedCity !== "all") {
			filtered = filtered.filter(
				(event) =>
					typeof event.location === "object" &&
					event.location.city === selectedCity,
			);
		}

		// Date filter
		const now = new Date();
		if (dateFilter === "today") {
			filtered = filtered.filter((event) => isToday(parseISO(event.date)));
		} else if (dateFilter === "upcoming") {
			filtered = filtered.filter((event) => isFuture(parseISO(event.date)));
		} else if (dateFilter === "weekend") {
			filtered = filtered.filter((event) => {
				const date = parseISO(event.date);
				const day = date.getDay();
				return day === 5 || day === 6; // Friday or Saturday
			});
		} else if (dateFilter === "month") {
			filtered = filtered.filter((event) => {
				const eventDate = parseISO(event.date);
				const nowDate = new Date();
				const diffTime = Math.abs(eventDate.getTime() - nowDate.getTime());
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
				return diffDays <= 30;
			});
		}

		// Price filter
		filtered = filtered.filter((event) => {
			const price = event.price || 0;
			return price >= priceRange[0] && price <= priceRange[1];
		});

		// Sort events: Live events first, then by date
		return filtered.sort((a, b) => {
			const aLive = isEventLive(a);
			const bLive = isEventLive(b);
			if (aLive && !bLive) return -1;
			if (!aLive && bLive) return 1;
			return new Date(a.date).getTime() - new Date(b.date).getTime();
		});
	}, [
		events,
		searchTerm,
		selectedCategory,
		selectedCity,
		dateFilter,
		priceRange,
		showLiveOnly,
	]);

	const liveEventsCount = useMemo(
		() => filteredEvents.filter(isEventLive).length,
		[filteredEvents],
	);

	const clearFilters = () => {
		setSearchTerm("");
		setSelectedCategory("all");
		setSelectedCity("all");
		setDateFilter("all");
		setPriceRange([0, 500]);
		setShowLiveOnly(false);
	};

	const hasActiveFilters =
		searchTerm ||
		selectedCategory !== "all" ||
		selectedCity !== "all" ||
		dateFilter !== "all" ||
		priceRange[0] > 0 ||
		priceRange[1] < 500 ||
		showLiveOnly;

	if (isLoading && events.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-12 h-12 text-primary animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Banner */}
			<div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-12 border-b">
				<div className="container mx-auto px-4">
					<h1 className="text-4xl md:text-5xl font-black mb-4">
						Discover <span className="text-primary">Spiritual Events</span>
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl">
						Find revival meetings, worship nights, conferences, and prayer
						gatherings near you
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Sidebar Filters - Desktop */}
					<div className="hidden lg:block w-80 shrink-0 space-y-6">
						<div className="sticky top-24">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-bold text-lg">Filters</h3>
								{hasActiveFilters && (
									<button
										onClick={clearFilters}
										className="text-sm text-primary hover:underline">
										Clear all
									</button>
								)}
							</div>

							{/* Live Events Toggle */}
							<div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-semibold flex items-center gap-2">
											<Zap className="w-4 h-4 text-red-500" />
											Live Events
										</p>
										<p className="text-xs text-muted-foreground">
											{liveEventsCount} events happening now
										</p>
									</div>
									<button
										onClick={() => setShowLiveOnly(!showLiveOnly)}
										className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
											showLiveOnly
												? "bg-red-600 text-white shadow-lg shadow-red-600/20"
												: "bg-gray-100 text-gray-600 hover:bg-gray-200"
										}`}>
										{showLiveOnly ? "Live Mode ON" : "Show Live"}
									</button>
								</div>
							</div>

							{/* Category Filter */}
							<div className="mb-6">
								<label className="font-semibold mb-2 block">Category</label>
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="w-full p-3 rounded-xl border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
									<option value="all">All Categories</option>
									{categories.map((cat) => (
										<option key={cat._id} value={cat._id}>
											{cat.name}
										</option>
									))}
								</select>
							</div>

							{/* City Filter */}
							<div className="mb-6">
								<label className="font-semibold mb-2 block">Location</label>
								<select
									value={selectedCity}
									onChange={(e) => setSelectedCity(e.target.value)}
									className="w-full p-3 rounded-xl border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
									<option value="all">All Cities</option>
									{cities.map((city) => (
										<option key={city} value={city}>
											{city}
										</option>
									))}
								</select>
							</div>

							{/* Date Filter */}
							<div className="mb-6">
								<label className="font-semibold mb-2 block">Date</label>
								<select
									value={dateFilter}
									onChange={(e) => setDateFilter(e.target.value)}
									className="w-full p-3 rounded-xl border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
									<option value="all">All Dates</option>
									<option value="today">Today</option>
									<option value="upcoming">Upcoming</option>
									<option value="weekend">This Weekend</option>
									<option value="month">Next 30 Days</option>
								</select>
							</div>

							{/* Price Range */}
							{/* <div className="mb-6">
								<label className="font-semibold mb-2 block">
									Price Range (${priceRange[0]} - ${priceRange[1]})
								</label>
								<Slider
									min={0}
									max={500}
									step={10}
									value={[priceRange[0], priceRange[1]]}
									onValueChange={(value) => setPriceRange([value[0], value[1]])}
									className="mt-4"
								/>
							</div> */}
						</div>
					</div>

					{/* Main Content */}
					<div className="flex-1">
						{/* Search Bar and Mobile Filters */}
						<div className="flex flex-col sm:flex-row gap-4 mb-6">
							<div className="relative flex-1">
								<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder="Search events by title, location..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 rounded-xl"
								/>
							</div>

							{/* Mobile Filter Button */}
							<Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
								<SheetTrigger asChild>
									<Button variant="outline" className="lg:hidden gap-2">
										<Filter className="w-4 h-4" />
										Filters
										{hasActiveFilters && (
											<Badge className="ml-1 bg-primary text-white">!</Badge>
										)}
									</Button>
								</SheetTrigger>
								<SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
									<SheetHeader>
										<SheetTitle>Filters</SheetTitle>
										<SheetDescription>
											Narrow down events by category, location, date, and price
										</SheetDescription>
									</SheetHeader>

									<div className="flex-1 overflow-y-auto py-6 space-y-6">
										{/* Live Events Toggle */}
										<div className="p-4 bg-primary/5 rounded-2xl">
											<div className="flex items-center justify-between">
												<div>
													<p className="font-semibold flex items-center gap-2">
														<Zap className="w-4 h-4 text-red-500" />
														Live Events
													</p>
													<p className="text-xs text-muted-foreground">
														{liveEventsCount} events happening now
													</p>
												</div>
												<button
													onClick={() => {
														setShowLiveOnly(!showLiveOnly);
														setIsFiltersOpen(false);
													}}
													className={`px-4 py-2 rounded-xl text-sm font-medium ${
														showLiveOnly
															? "bg-red-600 text-white"
															: "bg-gray-100 text-gray-600"
													}`}>
													{showLiveOnly ? "Live Mode ON" : "Show Live"}
												</button>
											</div>
										</div>

										<div>
											<label className="font-semibold mb-2 block">
												Category
											</label>
											<select
												value={selectedCategory}
												onChange={(e) => setSelectedCategory(e.target.value)}
												className="w-full p-3 rounded-xl border border-primary/10">
												<option value="all">All Categories</option>
												{categories.map((cat) => (
													<option key={cat._id} value={cat._id}>
														{cat.name}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="font-semibold mb-2 block">
												Location
											</label>
											<select
												value={selectedCity}
												onChange={(e) => setSelectedCity(e.target.value)}
												className="w-full p-3 rounded-xl border border-primary/10">
												<option value="all">All Cities</option>
												{cities.map((city) => (
													<option key={city} value={city}>
														{city}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="font-semibold mb-2 block">Date</label>
											<select
												value={dateFilter}
												onChange={(e) => setDateFilter(e.target.value)}
												className="w-full p-3 rounded-xl border border-primary/10">
												<option value="all">All Dates</option>
												<option value="today">Today</option>
												<option value="upcoming">Upcoming</option>
												<option value="weekend">This Weekend</option>
												<option value="month">Next 30 Days</option>
											</select>
										</div>

										<div>
											<label className="font-semibold mb-2 block">
												Price Range (${priceRange[0]} - ${priceRange[1]})
											</label>
											<Slider
												min={0}
												max={500}
												step={10}
												value={[priceRange[0], priceRange[1]]}
												onValueChange={(value: [number, number]) =>
													setPriceRange([value[0], value[1]])
												}
											/>
										</div>
									</div>

									<SheetFooter className="mt-4">
										<Button
											variant="outline"
											onClick={clearFilters}
											className="w-full">
											Clear All Filters
										</Button>
										<Button
											onClick={() => setIsFiltersOpen(false)}
											className="w-full">
											Apply Filters
										</Button>
									</SheetFooter>
								</SheetContent>
							</Sheet>
						</div>

						{/* Active Filters Display */}
						{hasActiveFilters && (
							<div className="flex flex-wrap gap-2 mb-6">
								{searchTerm && (
									<Badge variant="secondary" className="gap-1">
										Search: {searchTerm}
										<X
											className="w-3 h-3 cursor-pointer"
											onClick={() => setSearchTerm("")}
										/>
									</Badge>
								)}
								{selectedCategory !== "all" && (
									<Badge variant="secondary" className="gap-1">
										Category:{" "}
										{categories.find((c) => c._id === selectedCategory)?.name}
										<X
											className="w-3 h-3 cursor-pointer"
											onClick={() => setSelectedCategory("all")}
										/>
									</Badge>
								)}
								{selectedCity !== "all" && (
									<Badge variant="secondary" className="gap-1">
										Location: {selectedCity}
										<X
											className="w-3 h-3 cursor-pointer"
											onClick={() => setSelectedCity("all")}
										/>
									</Badge>
								)}
								{dateFilter !== "all" && (
									<Badge variant="secondary" className="gap-1">
										Date:{" "}
										{dateFilter === "today"
											? "Today"
											: dateFilter === "upcoming"
												? "Upcoming"
												: dateFilter === "weekend"
													? "This Weekend"
													: "Next 30 Days"}
										<X
											className="w-3 h-3 cursor-pointer"
											onClick={() => setDateFilter("all")}
										/>
									</Badge>
								)}
								{showLiveOnly && (
									<Badge
										variant="secondary"
										className="gap-1 bg-red-100 text-red-700">
										Live Events Only
										<X
											className="w-3 h-3 cursor-pointer"
											onClick={() => setShowLiveOnly(false)}
										/>
									</Badge>
								)}
							</div>
						)}

						{/* Results Count */}
						<div className="mb-6">
							<p className="text-muted-foreground">
								Found{" "}
								<span className="font-bold text-primary">
									{filteredEvents.length}
								</span>{" "}
								events
								{showLiveOnly && (
									<span className="ml-2 text-red-500">• Live Mode</span>
								)}
							</p>
						</div>

						{/* Events List */}
						<EventList initialEvents={filteredEvents} />
					</div>
				</div>
			</div>
		</div>
	);
}
