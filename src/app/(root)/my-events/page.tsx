// app/my-events/page.tsx
"use client";

import { EventCard } from "@/components/EventCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRevival } from "@/hooks/useRevival";
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	Clock,
	Edit,
	Eye,
	Loader2,
	Plus,
	Search,
	Trash2,
	Users,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MyEventsPage() {
	const router = useRouter();
	const { isAuthenticated, user, events, getEvents, deleteEvent, isLoading } =
		useRevival();

	const [myEvents, setMyEvents] = useState<any[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isDeleting, setIsDeleting] = useState<string | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [eventToDelete, setEventToDelete] = useState<any>(null);
	const [activeTab, setActiveTab] = useState("all");

	useEffect(() => {
		// Check if user is authenticated
		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to view your events",
				action: {
					label: "Login",
					onClick: () => router.push("/login"),
				},
			});
			router.push("/");
			return;
		}

		// Fetch all events and filter by current user
		getEvents();
	}, [isAuthenticated, router]);

	// Filter events created by current user
	useEffect(() => {
		if (events.length > 0 && user) {
			const userEvents = events.filter((event) =>
				typeof event?.organizer === "object"
					? event?.organizer._id === user._id
					: event?.organizer === user._id,
			);
			setMyEvents(userEvents);
		}
	}, [events, user]);

	// Filter events based on search term and status
	const filteredEvents = myEvents.filter((event) => {
		const matchesSearch =
			event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(typeof event.location === "object" &&
				event.location.city?.toLowerCase().includes(searchTerm.toLowerCase()));

		const matchesStatus =
			activeTab === "all" ||
			(activeTab === "published" && event.status === "approved") ||
			(activeTab === "pending" && event.status === "pending") ||
			(activeTab === "rejected" && event.status === "rejected");

		return matchesSearch && matchesStatus;
	});

	const handleDeleteEvent = async () => {
		if (!eventToDelete) return;

		setIsDeleting(eventToDelete._id);
		try {
			await deleteEvent(eventToDelete._id);
			toast.success("Event deleted", {
				description: `"${eventToDelete.title}" has been permanently deleted.`,
			});
			setDeleteDialogOpen(false);
			setEventToDelete(null);
			// Refresh events
			await getEvents();
		} catch (error: any) {
			toast.error("Failed to delete event", {
				description: error.message || "Please try again later.",
			});
		} finally {
			setIsDeleting(null);
		}
	};

	const handleEditEvent = (eventId: string) => {
		router.push(`/events/${eventId}/edit`);
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "approved":
				return (
					<Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
						<CheckCircle className="w-3 h-3 mr-1" />
						Published
					</Badge>
				);
			case "pending":
				return (
					<Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">
						<Clock className="w-3 h-3 mr-1" />
						Pending Review
					</Badge>
				);
			case "rejected":
				return (
					<Badge className="bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30">
						<XCircle className="w-3 h-3 mr-1" />
						Rejected
					</Badge>
				);
			default:
				return null;
		}
	};

	if (isLoading && myEvents.length === 0) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading your events...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Header */}
			<div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-16 border-b border-primary/10">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-primary/20 rounded-2xl">
								<Calendar className="w-8 h-8 text-primary" />
							</div>
							<div>
								<h1 className="text-4xl md:text-5xl font-black">My Events</h1>
								<p className="text-muted-foreground mt-2">
									Manage and track all the events you've created
								</p>
							</div>
						</div>
						<Link href="/events/create">
							<Button className="bg-primary hover:bg-primary/90">
								<Plus className="w-4 h-4 mr-2" />
								Create New Event
							</Button>
						</Link>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
						<div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 border border-primary/10">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Total Events</p>
									<p className="text-3xl font-bold">{myEvents.length}</p>
								</div>
								<Calendar className="w-8 h-8 text-primary/40" />
							</div>
						</div>
						<div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 border border-green-500/10">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Published</p>
									<p className="text-3xl font-bold text-green-600">
										{myEvents.filter((e) => e.status === "approved").length}
									</p>
								</div>
								<CheckCircle className="w-8 h-8 text-green-500/40" />
							</div>
						</div>
						<div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/10">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Pending</p>
									<p className="text-3xl font-bold text-yellow-600">
										{myEvents.filter((e) => e.status === "pending").length}
									</p>
								</div>
								<Clock className="w-8 h-8 text-yellow-500/40" />
							</div>
						</div>
						<div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 border border-primary/10">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">
										Total Attendees
									</p>
									<p className="text-3xl font-bold">
										{myEvents.reduce((sum, e) => sum + (e.attendees || 0), 0)}
									</p>
								</div>
								<Users className="w-8 h-8 text-primary/40" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				{/* Search and Filter Bar */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
					<div className="relative w-full md:w-96">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search your events..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>
				</div>

				{/* Status Tabs */}
				<Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
					<TabsList className="bg-primary/5 p-1 rounded-2xl">
						<TabsTrigger value="all" className="rounded-xl px-6">
							All Events ({myEvents.length})
						</TabsTrigger>
						<TabsTrigger value="published" className="rounded-xl px-6">
							Published (
							{myEvents.filter((e) => e.status === "approved").length})
						</TabsTrigger>
						<TabsTrigger value="pending" className="rounded-xl px-6">
							Pending ({myEvents.filter((e) => e.status === "pending").length})
						</TabsTrigger>
						<TabsTrigger value="rejected" className="rounded-xl px-6">
							Rejected ({myEvents.filter((e) => e.status === "rejected").length}
							)
						</TabsTrigger>
					</TabsList>
				</Tabs>

				{/* Events Grid */}
				{filteredEvents.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredEvents.map((event) => (
							<div key={event._id} className="group relative">
								<EventCard event={event} />
								<div className="absolute top-4 left-4 z-10 flex gap-2">
									{getStatusBadge(event.status)}
								</div>
								<div className="absolute bottom-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
									<Button
										size="sm"
										variant="outline"
										onClick={() => router.push(`/events/${event._id}`)}
										className="bg-white/90 backdrop-blur-sm hover:bg-white">
										<Eye className="w-4 h-4" />
									</Button>
									{event.status !== "approved" && (
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleEditEvent(event._id)}
											className="bg-white/90 backdrop-blur-sm hover:bg-white">
											<Edit className="w-4 h-4" />
										</Button>
									)}
									<Button
										size="sm"
										variant="destructive"
										onClick={() => {
											setEventToDelete(event);
											setDeleteDialogOpen(true);
										}}
										className="bg-red-500/90 backdrop-blur-sm hover:bg-red-600">
										<Trash2 className="w-4 h-4 text-white" />
									</Button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-20">
						<div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
							<Calendar className="w-12 h-12 text-primary/40" />
						</div>
						<h3 className="text-2xl font-bold mb-2">No events found</h3>
						<p className="text-muted-foreground max-w-md mx-auto">
							{searchTerm
								? `No events match "${searchTerm}". Try a different search term.`
								: activeTab !== "all"
									? `You don't have any ${activeTab} events.`
									: "You haven't created any events yet. Start by creating your first event!"}
						</p>
						{searchTerm ? (
							<Button
								onClick={() => setSearchTerm("")}
								variant="outline"
								className="mt-6">
								Clear Search
							</Button>
						) : (
							<Link href="/events/create">
								<Button className="mt-6 bg-primary hover:bg-primary/90">
									<Plus className="w-4 h-4 mr-2" />
									Create Your First Event
								</Button>
							</Link>
						)}
					</div>
				)}

				{/* Quick Stats Footer */}
				{filteredEvents.length > 0 && (
					<div className="mt-12 pt-8 border-t border-primary/10">
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
							<p className="text-sm text-muted-foreground">
								Showing {filteredEvents.length} of {myEvents.length} events
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
								<Link href="/events/create">
									<Button size="sm" className="bg-primary hover:bg-primary/90">
										<Plus className="w-4 h-4 mr-2" />
										Create New Event
									</Button>
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent className="sm:max-w-[425px] rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold flex items-center gap-2">
							<AlertCircle className="w-6 h-6 text-red-500" />
							Delete Event
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete "{eventToDelete?.title}"? This
							action cannot be undone and will remove all associated data
							including reviews, messages, and attendee information.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex gap-3 mt-4">
						<Button
							variant="outline"
							onClick={() => {
								setDeleteDialogOpen(false);
								setEventToDelete(null);
							}}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteEvent}
							disabled={isDeleting === eventToDelete?._id}>
							{isDeleting === eventToDelete?._id ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								<span className="text-white flex flex-row justify-center items-center">
									<Trash2 className="w-4 h-4 mr-2 text-white" />
									Delete Event
								</span>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
