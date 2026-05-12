// app/testimonies/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRevival } from "@/hooks/useRevival";
import { formatDistanceToNow } from "date-fns";
import { Heart, Loader2, Plus, Quote, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TestimoniesPage() {
	const {
		testimonies,
		getTestimonies,
		likeTestimony,
		submitPublicTestimony,
		isLoading,
		isAuthenticated,
		user,
	} = useRevival();
	const [likingId, setLikingId] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		event: "",
		content: "",
		rating: 5,
		avatar: "",
	});

	useEffect(() => {
		getTestimonies();
	}, []);

	// Pre-fill form if user is logged in
	useEffect(() => {
		if (isAuthenticated && user) {
			setFormData((prev) => ({
				...prev,
				name: user.name || prev.name,
			}));
		}
	}, [isAuthenticated, user]);

	const handleLike = async (id: string) => {
		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to like testimonies",
				action: {
					label: "Login",
					onClick: () => (window.location.href = "/login"),
				},
			});
			return;
		}

		setLikingId(id);
		try {
			await likeTestimony(id);
		} catch (error) {
			toast.error("Failed to like testimony");
		} finally {
			setLikingId(null);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			toast.error("Name is required");
			return;
		}
		if (!formData.event.trim()) {
			toast.error("Event name is required");
			return;
		}
		if (!formData.content.trim()) {
			toast.error("Testimony content is required");
			return;
		}
		if (formData.content.length < 20) {
			toast.error("Please write at least 20 characters for your testimony");
			return;
		}

		setIsSubmitting(true);
		try {
			await submitPublicTestimony(formData);
			toast.success("Testimony submitted for review!", {
				description:
					"Your testimony will be published once approved by an admin.",
			});
			setIsModalOpen(false);
			setFormData({
				name: user?.name || "",
				event: "",
				content: "",
				rating: 5,
				avatar: "",
			});
			await getTestimonies(); // Refresh to show new approved testimonies
		} catch (error: any) {
			toast.error("Failed to submit testimony", {
				description: error.message || "Please try again later",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setFormData({
			name: user?.name || "",
			event: "",
			content: "",
			rating: 5,
			avatar: "",
		});
	};

	if (isLoading && testimonies.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-12 h-12 text-primary animate-spin" />
			</div>
		);
	}

	return (
		<>
			<div className="min-h-screen bg-slate-50">
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-4xl mx-auto text-center space-y-6 mb-20">
						<div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 text-primary">
							<Quote className="w-8 h-8 fill-current" />
						</div>
						<h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900">
							Stories of{" "}
							<span className="text-primary italic">Transformation</span>.
						</h1>
						<p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto italic">
							"But they overcame him by the blood of the Lamb and by the word of
							their testimony..." — Revelation 12:11
						</p>

						{/* Share Your Story Button */}
						<Button
							onClick={() => setIsModalOpen(true)}
							className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
							<Plus className="w-5 h-5 mr-2" />
							Share Your Story
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{testimonies.map((testimony) => (
							<div
								key={testimony._id}
								className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative group">
								<div className="flex items-center gap-4 mb-8">
									<div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/5 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
										{testimony.avatar ? (
											<img
												src={testimony.avatar}
												alt={testimony.name}
												className="w-full h-full object-cover"
											/>
										) : (
											<span className="text-2xl font-bold text-primary">
												{testimony.name.charAt(0)}
											</span>
										)}
									</div>
									<div>
										<h3 className="font-bold text-slate-900">
											{testimony.name}
										</h3>
										<p className="text-xs text-primary font-bold uppercase tracking-widest">
											{testimony.event}
										</p>
									</div>
								</div>

								<div className="flex mb-6 gap-1 text-amber-500">
									{[...Array(testimony.rating)].map((_, i) => (
										<Star key={i} className="w-4 h-4 fill-current" />
									))}
								</div>

								<p className="text-lg text-slate-600 font-medium leading-relaxed italic mb-8">
									"{testimony.content}"
								</p>

								<div className="flex items-center justify-between pt-6 border-t border-slate-50">
									<div className="flex items-center gap-4 text-slate-400">
										<button
											onClick={() => handleLike(testimony._id)}
											disabled={likingId === testimony._id}
											className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors group">
											<Heart className="w-4 h-4 group-hover:fill-red-500 group-hover:text-red-500 transition" />
											<span className="text-xs font-bold">
												{testimony.likes || 0}
											</span>
										</button>
									</div>
									<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
										{formatDistanceToNow(new Date(testimony.createdAt), {
											addSuffix: true,
										})}
									</span>
								</div>
							</div>
						))}
					</div>

					{testimonies.length === 0 && (
						<div className="text-center py-20">
							<p className="text-muted-foreground">
								No testimonies yet. Be the first to share!
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Submit Testimony Modal */}
			<Dialog
				open={isModalOpen}
				onOpenChange={(open) => {
					setIsModalOpen(open);
					if (!open) resetForm();
				}}>
				<DialogContent className="sm:max-w-137.5 max-w-82.5 rounded-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-center">
							Share Your Testimony
						</DialogTitle>
						<DialogDescription className="text-center">
							Tell us how God has moved in your life through an event or
							gathering. Your story could inspire thousands of believers.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4 mt-4">
						<div className="space-y-2">
							<Label htmlFor="name">
								Your Name <span className="text-red-500">*</span>
							</Label>
							<Input
								id="name"
								placeholder="John Doe"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								disabled={isSubmitting}
								className="rounded-xl"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="event">
								Event Name <span className="text-red-500">*</span>
							</Label>
							<Input
								id="event"
								placeholder="e.g., Youth Revival Conference 2024"
								value={formData.event}
								onChange={(e) =>
									setFormData({ ...formData, event: e.target.value })
								}
								disabled={isSubmitting}
								className="rounded-xl"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="rating">
								Rating <span className="text-red-500">*</span>
							</Label>
							<div className="flex gap-2">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										type="button"
										onClick={() => setFormData({ ...formData, rating: star })}
										className={`p-1 hover:scale-110 transition-transform ${
											star <= formData.rating
												? "text-amber-500"
												: "text-muted-foreground"
										}`}>
										<Star
											className={`w-8 h-8 ${star <= formData.rating ? "fill-current" : ""}`}
										/>
									</button>
								))}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="avatar">Profile Picture URL (Optional)</Label>
							<Input
								id="avatar"
								type="url"
								placeholder="https://example.com/your-photo.jpg"
								value={formData.avatar}
								onChange={(e) =>
									setFormData({ ...formData, avatar: e.target.value })
								}
								disabled={isSubmitting}
								className="rounded-xl"
							/>
							{formData.avatar && (
								<div className="mt-2 flex items-center gap-2">
									<img
										src={formData.avatar}
										alt="Preview"
										className="w-12 h-12 rounded-full object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).style.display = "none";
											toast.error("Invalid image URL");
										}}
									/>
									<button
										type="button"
										onClick={() => setFormData({ ...formData, avatar: "" })}
										className="text-red-500 hover:text-red-600">
										<X className="w-4 h-4" />
									</button>
								</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">
								Your Testimony <span className="text-red-500">*</span>
							</Label>
							<Textarea
								id="content"
								placeholder="Share your story... What did God do in your life? How were you impacted?"
								value={formData.content}
								onChange={(e) =>
									setFormData({ ...formData, content: e.target.value })
								}
								rows={6}
								className="rounded-xl resize-none"
								disabled={isSubmitting}
								required
							/>
							<p className="text-xs text-muted-foreground text-right">
								{formData.content.length}/5000 characters
							</p>
						</div>

						<div className="bg-primary/5 rounded-xl p-4 text-sm text-muted-foreground">
							<p className="font-semibold text-primary">Note:</p>
							<p>
								Your testimony will be reviewed by our team before being
								published. This usually takes 24-48 hours. We review all
								submissions to ensure they align with our community guidelines.
							</p>
						</div>

						<div className="flex gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsModalOpen(false);
									resetForm();
								}}
								disabled={isSubmitting}
								className="flex-1 rounded-xl">
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="flex-1 bg-primary hover:bg-primary/90 rounded-xl">
								{isSubmitting ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Submitting...
									</>
								) : (
									"Submit Testimony"
								)}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
