"use client";

import { CommunityForum } from "@/components/CommunityForum";
import { ReviewSystem } from "@/components/ReviewSystem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRevival } from "@/hooks/useRevival";
import axios from "axios";
import { format, parseISO } from "date-fns";
import {
	Calendar,
	Clock,
	Heart,
	Info,
	Loader2,
	MapPin,
	Share2,
	ShieldCheck,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EventDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const router = useRouter();
	const {
		getEventById,
		selectedEvent,
		isLoading,
		error,
		user,
		isAuthenticated,
		toggleBookmark,
		isBookmarked,
		createReview,
		getReviewsByEvent,
		reviews,
		sendMessage,
		getEventMessages,
		messages,
		getEvents,
	} = useRevival();

	const [isInterested, setIsInterested] = useState(false);
	const [isSharing, setIsSharing] = useState(false);
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
	const [isRegistering, setIsRegistering] = useState(false);
	const [registrationData, setRegistrationData] = useState({
		name: "",
		email: "",
		phone: "",
	});

	// Fetch event data on mount
	useEffect(() => {
		if (id) {
			getEventById(id);
			getReviewsByEvent(id);
			getEventMessages(id);
		}
	}, [id]);

	// Check if user has already bookmarked this event
	useEffect(() => {
		if (selectedEvent && isAuthenticated) {
			setIsInterested(isBookmarked(selectedEvent._id));
		}
	}, [selectedEvent, isAuthenticated, isBookmarked]);

	// Pre-fill registration form with user data if authenticated
	useEffect(() => {
		if (isAuthenticated && user) {
			setRegistrationData({
				name: user.name || "",
				email: user.email || "",
				phone: "",
			});
		}
	}, [isAuthenticated, user]);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!registrationData.name.trim()) {
			toast.error("Name is required");
			return;
		}
		if (!registrationData.email.trim()) {
			toast.error("Email is required");
			return;
		}

		setIsRegistering(true);
		try {
			const response = await axios.post(
				`https://revival-locator-backend.onrender.com/api/events/${selectedEvent?._id}/register`,
				{
					name: registrationData.name,
					email: registrationData.email,
					phone: registrationData.phone,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				},
			);

			if (response.data.success) {
				toast.success("Registration successful! 🎉", {
					description:
						"You have been registered for this event. A confirmation email has been sent.",
					duration: 5000,
				});

				// Update the event attendees count
				await getEventById(id);
				await getEvents(); // Refresh events list

				// Also mark as interested/bookmark if not already
				if (!isInterested && isAuthenticated) {
					await toggleBookmark(selectedEvent!._id);
					setIsInterested(true);
				}

				setIsRegisterModalOpen(false);
				setRegistrationData({
					name: user?.name || "",
					email: user?.email || "",
					phone: "",
				});
			}
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.message || "Failed to register for event";
			toast.error("Registration failed", {
				description: errorMessage,
			});
		} finally {
			setIsRegistering(false);
		}
	};

	const handleInterest = async () => {
		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to express interest in this event",
				action: {
					label: "Login",
					onClick: () => router.push("/login"),
				},
			});
			return;
		}

		try {
			await toggleBookmark(selectedEvent!._id);
			const newState = !isInterested;
			setIsInterested(newState);

			toast.success(newState ? "Interest registered! 🎉" : "Interest removed", {
				description: newState
					? `You've expressed interest in ${selectedEvent?.title}. We'll notify you about updates.`
					: `You've removed your interest from ${selectedEvent?.title}.`,
				action: newState
					? {
							label: "Complete Registration",
							onClick: () => setIsRegisterModalOpen(true),
						}
					: undefined,
			});
		} catch (error) {
			toast.error("Failed to register interest", {
				description: "Please try again later",
			});
		}
	};

	const handleShare = async () => {
		setIsSharing(true);
		try {
			if (navigator.share) {
				await navigator.share({
					title: selectedEvent?.title,
					text: selectedEvent?.description,
					url: window.location.href,
				});
			} else {
				await navigator.clipboard.writeText(window.location.href);
				toast.success("Link copied!", {
					description: "Share this event with your friends and family.",
				});
			}
		} catch (error) {
			if (error instanceof Error && error.name !== "AbortError") {
				toast.error("Failed to share", {
					description: "Please try again or copy the link manually.",
				});
			}
		} finally {
			setIsSharing(false);
		}
	};

	if (isLoading && !selectedEvent) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading event details...</p>
				</div>
			</div>
		);
	}

	if (error || !selectedEvent) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4 max-w-md mx-auto px-4">
					<div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
						<Info className="w-10 h-10 text-red-500" />
					</div>
					<h2 className="text-2xl font-bold">Event not found</h2>
					<p className="text-muted-foreground">
						{error ||
							"The event you're looking for doesn't exist or has been removed."}
					</p>
					<Button onClick={() => router.push("/")} className="mt-4">
						Back to Home
					</Button>
				</div>
			</div>
		);
	}

	const eventDate = parseISO(selectedEvent.date);
	const location =
		typeof selectedEvent.location === "object"
			? `${selectedEvent.location.address}, ${selectedEvent.location.city || ""} ${selectedEvent.location.state || ""}`
			: selectedEvent.location;

	const categoryName = selectedEvent.category
		? typeof selectedEvent.category === "object"
			? selectedEvent.category.name
			: selectedEvent.category
		: "Uncategorized";

	const bannerImage =
		selectedEvent.image ||
		selectedEvent.banner ||
		"https://images.unsplash.com/photo-1438032945730-e6e5b1a5b6d3?w=1200";

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Banner Section */}
			<div className="relative h-[400px] w-full mx-auto overflow-hidden">
				<img
					src={bannerImage}
					alt={selectedEvent.title}
					className="w-full h-full object-cover mx-auto"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
				<div className="container px-4 absolute bottom-0 pb-12">
					<div className="flex flex-col md:flex-row justify-between items-end gap-6">
						<div className="space-y-4 max-w-2xl mx-auto">
							<div className="flex flex-wrap gap-2">
								<Badge className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 text-sm rounded-full">
									{categoryName}
								</Badge>
								{selectedEvent.status === "pending" && (
									<Badge
										variant="secondary"
										className="bg-yellow-500/20 text-yellow-700 px-4 py-1.5 text-sm rounded-full">
										Pending Approval
									</Badge>
								)}
								{selectedEvent.isFree && (
									<Badge
										variant="secondary"
										className="bg-green-500/20 text-green-700 px-4 py-1.5 text-sm rounded-full">
										Free Event
									</Badge>
								)}
							</div>
							<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
								{selectedEvent.title}
							</h1>
							<div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium">
								<div className="flex items-center gap-2">
									<Calendar className="w-5 h-5 text-primary" />
									{format(eventDate, "MMMM d, yyyy")}
								</div>
								{selectedEvent.time && (
									<div className="flex items-center gap-2">
										<Clock className="w-5 h-5 text-primary" />
										{selectedEvent.time}
									</div>
								)}
								<div className="flex items-center gap-2">
									<MapPin className="w-5 h-5 text-primary" />
									{location}
								</div>
							</div>
						</div>
						<div className="flex gap-3 w-full md:w-auto">
							<Button
								onClick={handleInterest}
								className={`flex-grow md:flex-grow-0 h-14 px-8 text-lg rounded-2xl shadow-lg gap-2 ${
									isInterested
										? "bg-red-500 hover:bg-red-600 text-white"
										: "bg-primary hover:bg-primary/90 shadow-primary/20"
								}`}>
								<Heart
									className={`w-5 h-5 ${isInterested ? "fill-current" : ""}`}
								/>
								{isInterested ? "Event Saved" : "Save Event"}
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-14 w-14 rounded-2xl border-primary/20 hover:bg-primary/5"
								onClick={handleShare}
								disabled={isSharing}>
								<Share2 className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-12">
						<section className="space-y-6">
							<h2 className="text-3xl font-bold border-l-4 border-primary pl-4">
								About the Event
							</h2>
							<div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground text-lg leading-relaxed">
								<p>{selectedEvent.description}</p>
							</div>
						</section>

						<section className="bg-primary/5 rounded-[2rem] p-8 space-y-4">
							<div className="flex items-center gap-3 text-primary">
								<ShieldCheck className="w-6 h-6" />
								<h3 className="font-bold text-xl uppercase tracking-wider">
									Note to attendees
								</h3>
							</div>
							<p className="text-muted-foreground opacity-90">
								This event is open to everyone. Please arrive at least 30
								minutes before the start time to ensure proper seating and
								preparation.
								{selectedEvent.isFree
									? " Registration is free but highly encouraged."
									: " Registration is required for this event."}
							</p>
						</section>

						<Tabs defaultValue="reviews" className="w-full">
							<TabsList className="bg-primary/5 p-1 mb-6 rounded-2xl w-full justify-start sm:w-auto">
								<TabsTrigger
									value="reviews"
									className="rounded-xl px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
									Experience & Reviews ({reviews.length})
								</TabsTrigger>
								<TabsTrigger
									value="forum"
									className="rounded-xl px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
									Community Chat ({messages.length})
								</TabsTrigger>
							</TabsList>
							<TabsContent value="reviews">
								<ReviewSystem eventId={selectedEvent._id} />
							</TabsContent>
							<TabsContent value="forum">
								<CommunityForum
									messages={messages.map((m) => ({
										id: m._id,
										userName:
											typeof m.user === "object" ? m.user.name : "Anonymous",
										userAvatar: "",
										text: m.message,
										timestamp: m.createdAt,
										parentId: m.parent || undefined,
									}))}
									eventId={selectedEvent._id}
								/>
							</TabsContent>
						</Tabs>
					</div>

					{/* Sidebar */}
					<div className="space-y-8">
						<Card className="rounded-[2rem] border-primary/10 shadow-xl overflow-hidden">
							<CardContent className="p-8 space-y-6">
								<h3 className="text-xl font-bold">Event Details</h3>
								<div className="space-y-4">
									<div className="flex gap-4 items-start">
										<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
											<Users className="w-5 h-5 text-primary" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Interest Level
											</p>
											<p className="font-bold">
												{selectedEvent.attendees?.toLocaleString() || 0}{" "}
												Registered
											</p>
										</div>
									</div>
									<div className="flex gap-4 items-start">
										<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
											<MapPin className="w-5 h-5 text-primary" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Full Address
											</p>
											<p className="font-bold">{location}</p>
										</div>
									</div>
									<div className="flex gap-4 items-start">
										<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
											<Info className="w-5 h-5 text-primary" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Organizer</p>
											<p className="font-bold">
												{typeof selectedEvent.organizer === "object"
													? selectedEvent.organizer.name
													: "Event Organizer"}
											</p>
										</div>
									</div>
									{!selectedEvent.isFree && selectedEvent.price && (
										<div className="flex gap-4 items-start">
											<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
												<Info className="w-5 h-5 text-primary" />
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Price</p>
												<p className="font-bold text-primary">
													${selectedEvent.price}
												</p>
											</div>
										</div>
									)}
								</div>
								<hr className="border-primary/5" />
								<Button
									onClick={() => setIsRegisterModalOpen(true)}
									className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90">
									Register for Event
								</Button>
							</CardContent>
						</Card>

						<div className="bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-[2rem] border border-primary/10 space-y-4">
							<h4 className="font-bold text-lg">Proximity Check</h4>
							<p className="text-sm text-muted-foreground">
								This event is happening in <strong>{location}</strong>. Based on
								your current location, it is one of the closest gatherings this
								week.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Registration Modal */}
			<Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
				<DialogContent className="sm:max-w-[500px] rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">
							Register for {selectedEvent.title}
						</DialogTitle>
						<DialogDescription>
							Please fill in your details to confirm your attendance.
							{selectedEvent.isFree
								? " This is a free event."
								: ` Ticket price: $${selectedEvent.price}`}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleRegister}>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="name">
									Full Name <span className="text-red-500">*</span>
								</Label>
								<Input
									id="name"
									placeholder="Enter your full name"
									value={registrationData.name}
									onChange={(e) =>
										setRegistrationData({
											...registrationData,
											name: e.target.value,
										})
									}
									className="rounded-xl"
									disabled={isRegistering}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">
									Email Address <span className="text-red-500">*</span>
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={registrationData.email}
									onChange={(e) =>
										setRegistrationData({
											...registrationData,
											email: e.target.value,
										})
									}
									className="rounded-xl"
									disabled={isRegistering}
									required
								/>
								<p className="text-xs text-muted-foreground">
									A confirmation email will be sent to this address.
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone">Phone Number (Optional)</Label>
								<Input
									id="phone"
									type="tel"
									placeholder="Enter your phone number"
									value={registrationData.phone}
									onChange={(e) =>
										setRegistrationData({
											...registrationData,
											phone: e.target.value,
										})
									}
									className="rounded-xl"
									disabled={isRegistering}
								/>
							</div>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsRegisterModalOpen(false)}
								disabled={isRegistering}>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-primary hover:bg-primary/90"
								disabled={isRegistering}>
								{isRegistering ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Registering...
									</>
								) : (
									"Confirm Registration"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
