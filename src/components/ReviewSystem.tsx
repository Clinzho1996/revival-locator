"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRevival } from "@/hooks/useRevival";
import { format } from "date-fns";
import { Loader2, Star, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ReviewSystemProps {
	eventId: string;
}

export function ReviewSystem({ eventId }: ReviewSystemProps) {
	const {
		reviews,
		getReviewsByEvent,
		createReview,
		deleteReview,
		isLoading,
		isAuthenticated,
		user,
	} = useRevival();

	const [newReview, setNewReview] = useState("");
	const [rating, setRating] = useState(5);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		if (eventId) {
			getReviewsByEvent(eventId);
		}
	}, [eventId]);

	const handleSubmit = async () => {
		if (!newReview.trim()) {
			toast.error("Please write a review");
			return;
		}

		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to leave a review",
				action: {
					label: "Login",
					onClick: () => (window.location.href = "/login"),
				},
			});
			return;
		}

		setIsSubmitting(true);
		try {
			await createReview(eventId, rating, newReview.trim());
			setNewReview("");
			setRating(5);
			toast.success("Review submitted successfully!");
			await getReviewsByEvent(eventId); // Refresh reviews
		} catch (error: any) {
			toast.error("Failed to submit review", {
				description: error.message || "Please try again later",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (reviewId: string) => {
		if (!confirm("Are you sure you want to delete this review?")) return;

		setDeletingId(reviewId);
		try {
			await deleteReview(reviewId);
			toast.success("Review deleted successfully");
			await getReviewsByEvent(eventId);
		} catch (error: any) {
			toast.error("Failed to delete review", {
				description: error.message || "Please try again later",
			});
		} finally {
			setDeletingId(null);
		}
	};

	const getUserName = (review: any) => {
		if (typeof review.user === "object") {
			return review.user.name;
		}
		return "Anonymous";
	};

	const getUserId = (review: any) => {
		if (typeof review.user === "object") {
			return review.user._id;
		}
		return review.user;
	};

	if (isLoading && reviews.length === 0) {
		return (
			<div className="flex justify-center items-center py-12">
				<Loader2 className="w-8 h-8 text-primary animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Review Form */}
			<div className="space-y-4">
				<h3 className="text-2xl font-bold text-primary">
					Reviews & Experiences
				</h3>
				<Card className="bg-card/50 border-primary/10">
					<CardHeader>
						<CardTitle className="text-lg">Share your testimony</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									className={`p-1 hover:scale-110 transition-transform ${
										star <= rating ? "text-amber-500" : "text-muted-foreground"
									}`}>
									<Star
										className={`w-6 h-6 ${star <= rating ? "fill-current" : ""}`}
									/>
								</button>
							))}
						</div>
						<Textarea
							placeholder="How was the event? Share your experience..."
							value={newReview}
							onChange={(e) => setNewReview(e.target.value)}
							className="min-h-[100px] bg-background/50"
							disabled={isSubmitting}
						/>
						<Button
							onClick={handleSubmit}
							className="w-full sm:w-auto bg-primary"
							disabled={isSubmitting || !newReview.trim()}>
							{isSubmitting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Posting...
								</>
							) : (
								"Post Review"
							)}
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Reviews List */}
			<div className="space-y-4">
				{reviews.length === 0 ? (
					<p className="text-muted-foreground italic text-center py-8">
						No reviews yet. Be the first to share!
					</p>
				) : (
					reviews.map((review) => {
						const isOwner = isAuthenticated && user?._id === getUserId(review);

						return (
							<Card
								key={review._id}
								className="border-primary/5 bg-background/50">
								<CardContent className="pt-6">
									<div className="flex justify-between items-start mb-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
												<User className="w-6 h-6 text-primary" />
											</div>
											<div>
												<p className="font-bold">{getUserName(review)}</p>
												<p className="text-xs text-muted-foreground">
													{review.createdAt
														? format(new Date(review.createdAt), "PPp")
														: "Just now"}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<div className="flex text-amber-500">
												{Array.from({ length: 5 }).map((_, i) => (
													<Star
														key={i}
														className={`w-4 h-4 ${i < review.rating ? "fill-current" : ""}`}
													/>
												))}
											</div>
											{isOwner && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleDelete(review._id)}
													disabled={deletingId === review._id}
													className="text-red-600 hover:text-red-700 hover:bg-red-50">
													{deletingId === review._id ? (
														<Loader2 className="w-3 h-3 animate-spin" />
													) : (
														"Delete"
													)}
												</Button>
											)}
										</div>
									</div>
									<p className="text-muted-foreground">{review.comment}</p>
								</CardContent>
							</Card>
						);
					})
				)}
			</div>
		</div>
	);
}
