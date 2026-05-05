// app/admin/events/page.tsx
"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useRevival } from "@/hooks/useRevival";
import { format } from "date-fns";
import { Edit, ExternalLink, Loader2, Plus, Search, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminEventsPage() {
	const router = useRouter();
	const {
		getEvents,
		events,
		isLoading,
		deleteEvent,
		categories,
		getCategories,
	} = useRevival();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [eventToDelete, setEventToDelete] = useState<any>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			await Promise.all([getEvents(), getCategories()]);
		} catch (error) {
			console.error("Failed to fetch data:", error);
			toast.error("Failed to load events");
		}
	};

	// Filter events based on search term and status
	useEffect(() => {
		let filtered = [...events];

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

		if (statusFilter !== "all") {
			filtered = filtered.filter((event) => event.status === statusFilter);
		}

		setFilteredEvents(filtered);
	}, [events, searchTerm, statusFilter]);

	const handleDeleteClick = (event: any) => {
		setEventToDelete(event);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!eventToDelete) return;

		setIsDeleting(true);
		try {
			await deleteEvent(eventToDelete._id);
			toast.success(`Event "${eventToDelete.title}" has been deleted.`);
			setDeleteDialogOpen(false);
			setEventToDelete(null);
			await getEvents(); // Refresh the list
		} catch (error: any) {
			toast.error("Failed to delete event", {
				description: error.message || "Please try again later.",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "approved":
				return (
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-green-500" />
						<span className="text-xs font-medium uppercase tracking-wider text-green-600">
							Approved
						</span>
					</div>
				);
			case "pending":
				return (
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-yellow-500" />
						<span className="text-xs font-medium uppercase tracking-wider text-yellow-600">
							Pending
						</span>
					</div>
				);
			case "rejected":
				return (
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-red-500" />
						<span className="text-xs font-medium uppercase tracking-wider text-red-600">
							Rejected
						</span>
					</div>
				);
			default:
				return null;
		}
	};

	const getCategoryName = (category: any) => {
		if (!category) return "Uncategorized";
		if (typeof category === "object") return category.name;
		const cat = categories.find((c) => c._id === category);
		return cat?.name || "Uncategorized";
	};

	if (isLoading && events.length === 0) {
		return (
			<div className="flex justify-center items-center h-96">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading events...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-primary">
						Manage Events
					</h1>
					<p className="text-muted-foreground">
						Add, edit, or remove Christian events from the platform.
					</p>
				</div>
				<Link href="/admin/events/new">
					<Button className="bg-primary hover:bg-primary/90 rounded-xl px-6 gap-2 h-12 shadow-lg shadow-primary/20">
						<Plus className="w-5 h-5" />
						Create New Event
					</Button>
				</Link>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
				<div className="relative flex-grow">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<Input
						placeholder="Search events by title, description, or location..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 h-11 bg-background border-primary/10 focus-visible:ring-primary/20 rounded-xl"
					/>
				</div>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="h-11 px-4 rounded-xl border border-primary/10 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
					<option value="all">All Status</option>
					<option value="approved">Approved</option>
					<option value="pending">Pending</option>
					<option value="rejected">Rejected</option>
				</select>
				<Button
					variant="outline"
					className="h-11 rounded-xl border-primary/20"
					onClick={() => {
						setSearchTerm("");
						setStatusFilter("all");
					}}>
					Clear Filters
				</Button>
			</div>

			{/* Events Table */}
			<div className="bg-card rounded-2xl border border-primary/5 shadow-xl overflow-hidden">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="bg-primary/5">
							<TableRow className="hover:bg-transparent border-primary/10">
								<TableHead className="w-[300px] font-bold py-4">
									Event Details
								</TableHead>
								<TableHead className="font-bold">Category</TableHead>
								<TableHead className="font-bold">Date & Time</TableHead>
								<TableHead className="font-bold">Attendees</TableHead>
								<TableHead className="font-bold">Status</TableHead>
								<TableHead className="text-right font-bold">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredEvents.length > 0 ? (
								filteredEvents.map((event) => (
									<TableRow
										key={event._id}
										className="hover:bg-primary/[0.02] border-primary/5">
										<TableCell className="py-4">
											<div className="flex items-center gap-4">
												<img
													src={
														event.banner ||
														event.image ||
														"/images/placeholder-event.jpg"
													}
													alt={event.title}
													className="w-12 h-12 rounded-lg object-cover border border-primary/10"
												/>
												<div>
													<p className="font-bold text-sm leading-none mb-1">
														{event.title}
													</p>
													<p className="text-xs text-muted-foreground">
														{typeof event.location === "object"
															? `${event.location.address}, ${event.location.city || ""}`
															: event.location}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className="rounded-full border-primary/20 text-primary bg-primary/5">
												{getCategoryName(event.category)}
											</Badge>
										</TableCell>
										<TableCell>
											<p className="text-sm font-medium">
												{format(new Date(event.date), "MMM d, yyyy")}
											</p>
											{event.time && (
												<p className="text-xs text-muted-foreground">
													{event.time}
												</p>
											)}
										</TableCell>
										<TableCell className="font-mono text-sm">
											{event.attendees || 0}
										</TableCell>
										<TableCell>{getStatusBadge(event.status)}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Link href={`/events/${event._id}`} target="_blank">
													<Button
														variant="ghost"
														size="icon"
														className="h-9 w-9 text-muted-foreground hover:text-primary"
														title="View Event">
														<ExternalLink className="w-4 h-4" />
													</Button>
												</Link>
												<Link href={`/admin/events/${event._id}/edit`}>
													<Button
														variant="ghost"
														size="icon"
														className="h-9 w-9 text-muted-foreground hover:text-primary"
														title="Edit Event">
														<Edit className="w-4 h-4" />
													</Button>
												</Link>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDeleteClick(event)}
													className="h-9 w-9 text-muted-foreground hover:text-destructive"
													title="Delete Event">
													<Trash className="w-4 h-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-center py-12 text-muted-foreground">
										{searchTerm || statusFilter !== "all"
											? "No events match your filters."
											: "No events found. Create your first event!"}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							event "{eventToDelete?.title}" and remove all associated data
							including reviews and messages.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							disabled={isDeleting}
							className="bg-red-600 hover:bg-red-700">
							{isDeleting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete Event"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
