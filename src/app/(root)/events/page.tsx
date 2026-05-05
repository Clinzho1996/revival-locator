// app/events/page.tsx
"use client";

import { EventList } from "@/components/EventList";
import { useRevival } from "@/hooks/useRevival";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function EventsPage() {
	const searchParams = useSearchParams();
	const { searchEvents, events, isLoading, getEvents } = useRevival();
	const hasSearched = useRef(false);
	const initialParamsRef = useRef<string>("");

	const keyword = searchParams.get("keyword");
	const city = searchParams.get("city");

	useEffect(() => {
		const currentParams = `${keyword || ""}-${city || ""}`;

		// Only search if params have changed
		if (currentParams !== initialParamsRef.current) {
			initialParamsRef.current = currentParams;

			if (keyword || city) {
				searchEvents(keyword || "", city || undefined);
				hasSearched.current = true;
			} else if (!keyword && !city && !hasSearched.current) {
				// If no search params, fetch all events
				getEvents();
				hasSearched.current = true;
			}
		}
	}, [keyword, city, searchEvents, getEvents]);

	// Don't show loading for initial load when there are events
	if (isLoading && events.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">
						{keyword || city ? "Searching for events..." : "Loading events..."}
					</p>
				</div>
			</div>
		);
	}

	const hasSearchParams = keyword || city;
	const resultCount = events.length;

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
						{resultCount === 0
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
								onClick={() => {
									window.location.href = "/";
								}}
								className="mt-4 text-primary font-bold hover:underline">
								Clear search
							</button>
						</div>
					)}
				</div>

				{/* Only show EventList if we have events or haven't searched yet */}
				{(resultCount > 0 || (!hasSearchParams && !isLoading)) && (
					<EventList initialEvents={events} />
				)}
			</div>
		</div>
	);
}
