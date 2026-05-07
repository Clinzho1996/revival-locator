// app/events/EventsContent.tsx
"use client";

import { EventList } from "@/components/EventList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRevival } from "@/hooks/useRevival";
import { Loader2, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function EventsContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { searchEvents, events, isLoading, getEvents } = useRevival();
	const [isSearching, setIsSearching] = useState(false);
	const [localKeyword, setLocalKeyword] = useState("");
	const [localCity, setLocalCity] = useState("");
	const [hasLoaded, setHasLoaded] = useState(false);

	const keyword = searchParams.get("keyword");
	const city = searchParams.get("city");

	// Initialize local state from URL params
	useEffect(() => {
		if (keyword) setLocalKeyword(keyword);
		if (city) setLocalCity(city);
	}, [keyword, city]);

	// Handle search based on URL params
	useEffect(() => {
		const performSearch = async () => {
			if (keyword || city) {
				setIsSearching(true);
				await searchEvents(keyword || "", city || undefined);
				setIsSearching(false);
			} else if (!hasLoaded) {
				// If no search params, fetch all events
				await getEvents();
				setHasLoaded(true);
			}
		};

		performSearch();
	}, [keyword, city]); // Remove searchEvents and getEvents from deps to prevent loops

	const handleLocalSearch = (e: React.FormEvent) => {
		e.preventDefault();

		// Build search params
		const params = new URLSearchParams();
		if (localKeyword.trim()) params.append("keyword", localKeyword.trim());
		if (localCity.trim()) params.append("city", localCity.trim());

		// Navigate to events page with search params
		router.push(`/events?${params.toString()}`);
	};

	const clearSearch = () => {
		setLocalKeyword("");
		setLocalCity("");
		router.push("/events");
	};

	const hasSearchParams = keyword || city;
	const resultCount = events.length;
	const showLoading = (isLoading || isSearching) && events.length === 0;

	if (showLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">
						{hasSearchParams ? "Searching for events..." : "Loading events..."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Search Form */}
				<form onSubmit={handleLocalSearch} className="mb-8">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search by event name or keyword..."
								value={localKeyword}
								onChange={(e) => setLocalKeyword(e.target.value)}
								className="pl-10 rounded-xl"
							/>
						</div>
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search by city..."
								value={localCity}
								onChange={(e) => setLocalCity(e.target.value)}
								className="pl-10 rounded-xl"
							/>
						</div>
						<Button type="submit" className="bg-primary hover:bg-primary/90">
							<Search className="w-4 h-4 mr-2" />
							Search
						</Button>
						{(hasSearchParams || localKeyword || localCity) && (
							<Button type="button" variant="outline" onClick={clearSearch}>
								<X className="w-4 h-4 mr-2" />
								Clear
							</Button>
						)}
					</div>
				</form>

				<div className="mb-8">
					<h1 className="text-3xl font-bold">
						{hasSearchParams
							? `Search Results${keyword ? ` for "${keyword}"` : ""}${city ? ` in ${city}` : ""}`
							: "All Events"}
					</h1>
					<p className="text-muted-foreground mt-2">
						{resultCount === 0 && !isLoading
							? "No events found"
							: `${resultCount} event${resultCount !== 1 ? "s" : ""} found`}
					</p>

					{/* Show message when no results */}
					{resultCount === 0 && !isLoading && hasSearchParams && (
						<div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-950/20 rounded-2xl border border-yellow-200 dark:border-yellow-800">
							<p className="text-yellow-800 dark:text-yellow-200">
								No events match your search criteria. Try different keywords or
								check back later for new events.
							</p>
						</div>
					)}
				</div>

				{/* Show EventList with search results */}
				{(resultCount > 0 || (!hasSearchParams && !isLoading)) && (
					<EventList initialEvents={events} />
				)}
			</div>
		</div>
	);
}
