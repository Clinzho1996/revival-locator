// app/events/EventsContent.tsx
"use client";

import { EventList } from "@/components/EventList";
import { useRevival } from "@/hooks/useRevival";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function EventsContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { searchEvents, events, isLoading, getEvents } = useRevival();
	const hasInitialized = useRef(false);
	const [localKeyword, setLocalKeyword] = useState("");
	const [localCity, setLocalCity] = useState("");

	const keyword = searchParams.get("keyword");
	const city = searchParams.get("city");

	// Initialize local state from URL params
	useEffect(() => {
		if (keyword) setLocalKeyword(keyword);
		if (city) setLocalCity(city);
	}, [keyword, city]);

	// Handle search based on URL params
	useEffect(() => {
		// Only run once on initial load or when params change
		if (!hasInitialized.current) {
			hasInitialized.current = true;

			if (keyword || city) {
				// If there are search params, perform search
				searchEvents(keyword || "", city || undefined);
			} else {
				// If no search params, fetch all events
				getEvents();
			}
		}
	}, [keyword, city, searchEvents, getEvents]);

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

	// Don't show loading for initial load when there are events
	if (isLoading && events.length === 0 && hasInitialized.current) {
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
							<button
								onClick={clearSearch}
								className="mt-4 text-primary font-bold hover:underline">
								Clear search
							</button>
						</div>
					)}
				</div>

				{/* Show EventList */}
				{(resultCount > 0 || (!hasSearchParams && !isLoading)) && (
					<EventList initialEvents={events} />
				)}
			</div>
		</div>
	);
}
