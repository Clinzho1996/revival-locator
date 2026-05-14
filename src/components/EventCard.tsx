// components/EventCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { useRevival } from "@/hooks/useRevival";
import { differenceInMinutes, format, isToday, parseISO } from "date-fns";
import { Calendar, Heart, MapPin, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EventCardProps {
	event: any;
	showRemoveButton?: boolean;
	onRemove?: (eventId: string) => void;
}

export function EventCard({
	event,
	showRemoveButton,
	onRemove,
}: EventCardProps) {
	const { toggleBookmark, isBookmarked, isAuthenticated } = useRevival();
	const [isBookmarking, setIsBookmarking] = useState(false);
	const [isLive, setIsLive] = useState(false);

	const eventDate = parseISO(event.date);
	const isBookmarkedFlag = isBookmarked(event._id);

	// Check if event is live (happening today and within time range)
	useEffect(() => {
		const checkIfLive = () => {
			const now = new Date();
			const eventStart = parseISO(event.date);

			// If event has time specified
			if (event.time) {
				const [hours, minutes] = event.time.split(":").map(Number);
				const eventDateTime = new Date(eventStart);
				eventDateTime.setHours(hours || 0, minutes || 0);

				// Event is live if:
				// 1. It's today
				// 2. Current time is within 2 hours before start time (pre-live) or during the event
				// 3. Event hasn't ended (within 3 hours of start time)
				if (isToday(eventStart)) {
					const minutesUntilStart = differenceInMinutes(eventDateTime, now);
					const minutesSinceStart = differenceInMinutes(now, eventDateTime);

					// Show LIVE if within 2 hours before start OR within 3 hours after start
					if (minutesUntilStart <= 120 && minutesUntilStart > 0) {
						setIsLive(true); // Coming up soon
					} else if (minutesSinceStart >= 0 && minutesSinceStart <= 180) {
						setIsLive(true); // Live now
					} else {
						setIsLive(false);
					}
				} else {
					setIsLive(false);
				}
			} else {
				// If no time specified, show LIVE badge if it's today
				setIsLive(isToday(eventStart));
			}
		};

		checkIfLive();

		// Update every minute to check if event becomes live
		const interval = setInterval(checkIfLive, 60000);
		return () => clearInterval(interval);
	}, [event.date, event.time]);

	const location =
		typeof event.location === "object" && event.location
			? `${event.location.address || ""}${event.location.city ? ", " + event.location.city : ""}`
			: event.location || "Location TBA";

	const categoryName =
		event.categoryName ||
		(event.category
			? typeof event.category === "object"
				? event.category.name
				: event.category
			: "Uncategorized");

	const handleBookmark = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to bookmark events",
				action: {
					label: "Login",
					onClick: () => (window.location.href = "/login"),
				},
			});
			return;
		}

		setIsBookmarking(true);
		try {
			await toggleBookmark(event._id);
			toast.success(
				isBookmarkedFlag ? "Removed from bookmarks" : "Added to bookmarks",
			);
		} catch (error) {
			toast.error("Failed to update bookmark");
		} finally {
			setIsBookmarking(false);
		}
	};

	const handleRemove = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onRemove) {
			onRemove(event._id);
		}
	};

	return (
		<Link href={`/events/${event._id}`} className="group block h-full">
			<div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
				{/* Image Container */}
				<div className="relative h-48 overflow-hidden">
					<img
						src={
							event.banner ||
							"https://images.unsplash.com/photo-1438032945730-e6e5b1a5b6d3?w=600"
						}
						alt={event.title}
						className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
					/>

					{/* LIVE Badge */}
					{isLive && (
						<div className="absolute top-3 left-3 z-10 animate-pulse">
							<Badge className="bg-red-600 text-white border-none px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
								<Zap className="w-3 h-3" />
								LIVE NOW
							</Badge>
						</div>
					)}

					<button
						onClick={showRemoveButton ? handleRemove : handleBookmark}
						disabled={isBookmarking}
						className={`absolute top-3 right-3 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition shadow-md disabled:opacity-50 ${
							showRemoveButton
								? "bg-red-500 hover:bg-red-600 text-white"
								: "bg-white/90 hover:bg-white text-slate-600"
						}`}>
						{showRemoveButton ? (
							<Heart className="w-5 h-5 fill-current" />
						) : (
							<Heart
								className={`w-5 h-5 transition ${isBookmarkedFlag ? "fill-red-500 text-red-500" : ""}`}
							/>
						)}
					</button>

					{/* {event.isFree && (
						<Badge className="absolute bottom-3 left-3 bg-green-500 text-white border-none px-3 py-1 rounded-full text-xs font-black">
							FREE
						</Badge>
					)} */}

					{event.status === "pending" && (
						<Badge className="absolute bottom-3 left-3 bg-yellow-500 text-white border-none px-3 py-1 rounded-full text-xs font-black">
							Pending
						</Badge>
					)}
				</div>

				{/* Content */}
				<div className="p-5 space-y-3 flex-grow">
					<div className="flex items-center justify-between">
						<Badge
							variant="secondary"
							className="bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 rounded-full px-3 py-1 text-xs font-bold">
							{categoryName}
						</Badge>
						<div className="flex items-center gap-1 text-slate-500 text-sm">
							<Users className="w-4 h-4" />
							<span className="font-medium">{event.attendees || 0}</span>
						</div>
					</div>

					<h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary transition">
						{event.title}
					</h3>

					<p className="text-slate-500 dark:text-gray-400 text-sm line-clamp-2">
						{event.description}
					</p>

					<div className="pt-3 space-y-2 border-t border-slate-100 dark:border-gray-800">
						<div className="flex items-center gap-2 text-slate-600 dark:text-gray-300 text-sm">
							<Calendar className="w-4 h-4 text-primary" />
							<span className="font-medium">
								{format(eventDate, "MMM dd, yyyy")}
								{event.time && ` at ${event.time}`}
							</span>
						</div>
						<div className="flex items-center gap-2 text-slate-600 dark:text-gray-300 text-sm">
							<MapPin className="w-4 h-4 text-primary" />
							<span className="font-medium line-clamp-1">{location}</span>
						</div>
					</div>

					{!event.isFree && event.price && (
						<div className="pt-2">
							<p className="text-2xl font-black text-primary">
								${event.price}
								<span className="text-sm font-normal text-slate-400">
									{" "}
									/person
								</span>
							</p>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}
