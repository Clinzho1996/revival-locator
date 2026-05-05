// app/bookmarks/page.tsx
"use client";

import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useRevival } from "@/hooks/useRevival";
import {
	Bookmark,
	Calendar,
	Heart,
	Loader2,
	Search,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookmarksPage() {
	const router = useRouter();
	const {
		isAuthenticated,
		user,
		bookmarkedEvents,
		getBookmarks,
		removeBookmark,
		isLoading,
	} = useRevival();

	const [isRemoving, setIsRemoving] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		// Check if user is authenticated
		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to view your bookmarks",
				action: {
					label: "Login",
					onClick: () => router.push("/login"),
				},
			});
			router.push("/");
			return;
		}

		// Fetch bookmarks when component mounts
		getBookmarks();
	}, [isAuthenticated, router]);

	const handleRemoveBookmark = async (eventId: string, eventTitle: string) => {
		setIsRemoving(eventId);
		try {
			await removeBookmark(eventId);
			toast.success("Removed from bookmarks", {
				description: `"${eventTitle}" has been removed from your bookmarks.`,
			});
		} catch (error: any) {
			toast.error("Failed to remove bookmark", {
				description: error.message || "Please try again later.",
			});
		} finally {
			setIsRemoving(null);
		}
	};

	const handleClearAllBookmarks = async () => {
		if (bookmarkedEvents.length === 0) return;

		const confirmed = window.confirm(
			`Are you sure you want to remove all ${bookmarkedEvents.length} events from your bookmarks?`,
		);

		if (!confirmed) return;

		for (const event of bookmarkedEvents) {
			await removeBookmark(event._id);
		}

		toast.success("All bookmarks cleared", {
			description: "All events have been removed from your bookmarks.",
		});
	};

	// Filter bookmarks based on search term
	const filteredBookmarks = bookmarkedEvents.filter(
		(event) =>
			event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(typeof event.location === "object" &&
				(event.location.city
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
					event.location.address
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()))),
	);

	if (isLoading && bookmarkedEvents.length === 0) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading your bookmarks...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Header */}
			<div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-16 border-b border-primary/10">
				<div className="container mx-auto px-4">
					<div className="flex items-center gap-4 mb-4">
						<div className="p-3 bg-primary/20 rounded-2xl">
							<Bookmark className="w-8 h-8 text-primary" />
						</div>
						<div>
							<h1 className="text-4xl md:text-5xl font-black">My Bookmarks</h1>
							<p className="text-muted-foreground mt-2">
								Events you're interested in and want to attend
							</p>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
						<div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 border border-primary/10">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">
										Total Bookmarks
									</p>
									<p className="text-3xl font-bold">
										{bookmarkedEvents.length}
									</p>
								</div>
								<Bookmark className="w-8 h-8 text-primary/40" />
							</div>
						</div>
						<div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 border border-primary/10">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">
										Upcoming Events
									</p>
									<p className="text-3xl font-bold">
										{
											bookmarkedEvents.filter(
												(e) => new Date(e.date) > new Date(),
											).length
										}
									</p>
								</div>
								<Calendar className="w-8 h-8 text-primary/40" />
							</div>
						</div>
						<div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 border border-primary/10">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Saved Events</p>
									<p className="text-3xl font-bold">
										{bookmarkedEvents.length}
									</p>
								</div>
								<Heart className="w-8 h-8 text-primary/40" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				{/* Search and Actions Bar */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
					<div className="relative w-full md:w-96">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search bookmarked events..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>

					{bookmarkedEvents.length > 0 && (
						<Button
							variant="outline"
							onClick={handleClearAllBookmarks}
							className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200">
							<Trash2 className="w-4 h-4 mr-2" />
							Clear All Bookmarks
						</Button>
					)}
				</div>

				{/* Bookmarks Grid */}
				{filteredBookmarks.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredBookmarks.map((event) => (
							<div key={event._id} className="group relative">
								<EventCard event={event} />
								<button
									onClick={() => handleRemoveBookmark(event._id, event.title)}
									disabled={isRemoving === event._id}
									className="absolute top-4 right-4 z-10 p-2 bg-red-500/90 hover:bg-red-600 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50">
									{isRemoving === event._id ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Trash2 className="w-4 h-4" />
									)}
								</button>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-20">
						<div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
							<Bookmark className="w-12 h-12 text-primary/40" />
						</div>
						<h3 className="text-2xl font-bold mb-2">
							No bookmarked events yet
						</h3>
						<p className="text-muted-foreground max-w-md mx-auto">
							{searchTerm
								? `No events match "${searchTerm}". Try a different search term.`
								: "Start exploring events and click the bookmark icon to save them here for easy access."}
						</p>
						{searchTerm ? (
							<Button
								onClick={() => setSearchTerm("")}
								variant="outline"
								className="mt-6">
								Clear Search
							</Button>
						) : (
							<Link href="/">
								<Button className="mt-6 bg-primary hover:bg-primary/90">
									Explore Events
								</Button>
							</Link>
						)}
					</div>
				)}

				{/* Quick Stats Footer */}
				{filteredBookmarks.length > 0 && (
					<div className="mt-12 pt-8 border-t border-primary/10">
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
							<p className="text-sm text-muted-foreground">
								Showing {filteredBookmarks.length} of {bookmarkedEvents.length}{" "}
								bookmarked events
							</p>
							<div className="flex gap-3">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										window.scrollTo({ top: 0, behavior: "smooth" })
									}>
									Back to Top
								</Button>
								<Link href="/">
									<Button size="sm" className="bg-primary hover:bg-primary/90">
										Find More Events
									</Button>
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
