// app/events/create/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRevival } from "@/hooks/useRevival";
import {
	AlertCircle,
	ArrowLeft,
	Calendar as CalendarIcon,
	Clock,
	Image as ImageIcon,
	Loader2,
	MapPin,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateEventPage() {
	const router = useRouter();
	const {
		isAuthenticated,
		user,
		createEvent,
		categories,
		getCategories,
		isLoading: isStoreLoading,
	} = useRevival();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		location: {
			address: "",
			city: "",
			state: "",
			country: "Nigeria",
		},
		date: "",
		time: "",
		isFree: true,
		price: 0,
		banner: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		// Check if user is authenticated
		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to create an event",
				action: {
					label: "Login",
					onClick: () => router.push("/login"),
				},
			});
			router.push("/");
			return;
		}

		// Fetch categories
		getCategories();
	}, [isAuthenticated, router]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = "Event title is required";
		} else if (formData.title.length < 5) {
			newErrors.title = "Title must be at least 5 characters";
		}

		if (!formData.description.trim()) {
			newErrors.description = "Event description is required";
		} else if (formData.description.length < 20) {
			newErrors.description = "Description must be at least 20 characters";
		}

		if (!formData.category) {
			newErrors.category = "Please select a category";
		}

		if (!formData.date) {
			newErrors.date = "Event date is required";
		} else {
			const selectedDate = new Date(formData.date);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			if (selectedDate < today) {
				newErrors.date = "Event date cannot be in the past";
			}
		}

		if (!formData.location.address.trim()) {
			newErrors.address = "Address is required";
		}

		if (!formData.location.city.trim()) {
			newErrors.city = "City is required";
		}

		if (!formData.isFree && formData.price <= 0) {
			newErrors.price = "Price must be greater than 0 for paid events";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("Please fix the errors in the form");
			return;
		}

		setIsSubmitting(true);
		try {
			// Prepare event data
			const eventData = {
				title: formData.title.trim(),
				description: formData.description.trim(),
				category: formData.category,
				location: formData.location,
				date: new Date(formData.date).toISOString(),
				time: formData.time || undefined,
				isFree: formData.isFree,
				price: formData.isFree ? 0 : formData.price,
				banner: formData.banner.trim() || undefined,
			};

			await createEvent(eventData);

			toast.success("Event created successfully! 🎉", {
				description:
					"Your event has been submitted for review. You'll be notified once it's approved.",
				duration: 5000,
			});

			// Redirect to my events page
			router.push("/my-events");
		} catch (error: any) {
			toast.error("Failed to create event", {
				description: error.message || "Please try again later",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (field: string, value: string | boolean | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error for this field if it exists
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleLocationChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			location: { ...prev.location, [field]: value },
		}));
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	if (!isAuthenticated) {
		return null; // Will redirect in useEffect
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
			<div className="container max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<Link
						href="/my-events"
						className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4">
						<ArrowLeft className="w-4 h-4" />
						Back to My Events
					</Link>
					<div className="flex items-center gap-4">
						<div className="p-3 bg-primary/10 rounded-2xl">
							<Sparkles className="w-8 h-8 text-primary" />
						</div>
						<div>
							<h1 className="text-4xl md:text-5xl font-bold">
								Create New Event
							</h1>
							<p className="text-muted-foreground mt-2">
								Share your spiritual gathering with the community
							</p>
						</div>
					</div>
				</div>

				{/* Form */}
				<Card className="border-primary/10 shadow-xl rounded-2xl">
					<CardHeader className="border-b border-primary/10">
						<CardTitle className="text-2xl">Event Information</CardTitle>
						<CardDescription>
							Fill in the details about your event. All fields marked with * are
							required.
						</CardDescription>
					</CardHeader>
					<CardContent className="p-6 md:p-8">
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Basic Information */}
							<div className="space-y-6">
								<h3 className="text-lg font-semibold flex items-center gap-2">
									<Sparkles className="w-5 h-5 text-primary" />
									Basic Information
								</h3>

								{/* Title */}
								<div className="space-y-2">
									<Label htmlFor="title">
										Event Title <span className="text-red-500">*</span>
									</Label>
									<Input
										id="title"
										placeholder="e.g., Youth Revival Conference 2024"
										value={formData.title}
										onChange={(e) => handleChange("title", e.target.value)}
										className={`rounded-xl ${errors.title ? "border-red-500" : ""}`}
										disabled={isSubmitting}
									/>
									{errors.title && (
										<p className="text-sm text-red-500 flex items-center gap-1">
											<AlertCircle className="w-3 h-3" />
											{errors.title}
										</p>
									)}
								</div>

								{/* Description */}
								<div className="space-y-2">
									<Label htmlFor="description">
										Description <span className="text-red-500">*</span>
									</Label>
									<Textarea
										id="description"
										placeholder="Describe your event: what to expect, speakers, activities, etc."
										value={formData.description}
										onChange={(e) =>
											handleChange("description", e.target.value)
										}
										rows={6}
										className={`rounded-xl ${errors.description ? "border-red-500" : ""}`}
										disabled={isSubmitting}
									/>
									{errors.description && (
										<p className="text-sm text-red-500 flex items-center gap-1">
											<AlertCircle className="w-3 h-3" />
											{errors.description}
										</p>
									)}
									<p className="text-xs text-muted-foreground">
										{formData.description.length}/5000 characters
									</p>
								</div>

								{/* Category and Date Row */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label htmlFor="category">
											Category <span className="text-red-500">*</span>
										</Label>
										<Select
											value={formData.category}
											onValueChange={(value) => handleChange("category", value)}
											disabled={isSubmitting}>
											<SelectTrigger
												className={`rounded-xl ${errors.category ? "border-red-500" : ""}`}>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((cat) => (
													<SelectItem key={cat._id} value={cat._id}>
														{cat.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.category && (
											<p className="text-sm text-red-500">{errors.category}</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="date">
											Event Date <span className="text-red-500">*</span>
										</Label>
										<div className="relative">
											<CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
											<Input
												id="date"
												type="date"
												value={formData.date}
												onChange={(e) => handleChange("date", e.target.value)}
												className={`pl-10 rounded-xl ${errors.date ? "border-red-500" : ""}`}
												disabled={isSubmitting}
											/>
										</div>
										{errors.date && (
											<p className="text-sm text-red-500">{errors.date}</p>
										)}
									</div>
								</div>

								{/* Time */}
								<div className="space-y-2">
									<Label htmlFor="time">Event Time (Optional)</Label>
									<div className="relative">
										<Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
										<Input
											id="time"
											type="time"
											value={formData.time}
											onChange={(e) => handleChange("time", e.target.value)}
											className="pl-10 rounded-xl"
											disabled={isSubmitting}
										/>
									</div>
									<p className="text-xs text-muted-foreground">
										Leave empty for "Time TBA"
									</p>
								</div>
							</div>

							{/* Location Information */}
							<div className="space-y-6 pt-6 border-t border-primary/10">
								<h3 className="text-lg font-semibold flex items-center gap-2">
									<MapPin className="w-5 h-5 text-primary" />
									Location
								</h3>

								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="address">
											Address <span className="text-red-500">*</span>
										</Label>
										<Input
											id="address"
											placeholder="e.g., 12 Allen Avenue"
											value={formData.location.address}
											onChange={(e) =>
												handleLocationChange("address", e.target.value)
											}
											className={`rounded-xl ${errors.address ? "border-red-500" : ""}`}
											disabled={isSubmitting}
										/>
										{errors.address && (
											<p className="text-sm text-red-500">{errors.address}</p>
										)}
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="space-y-2">
											<Label htmlFor="city">
												City <span className="text-red-500">*</span>
											</Label>
											<Input
												id="city"
												placeholder="e.g., Lagos"
												value={formData.location.city}
												onChange={(e) =>
													handleLocationChange("city", e.target.value)
												}
												className={`rounded-xl ${errors.city ? "border-red-500" : ""}`}
												disabled={isSubmitting}
											/>
											{errors.city && (
												<p className="text-sm text-red-500">{errors.city}</p>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="state">State</Label>
											<Input
												id="state"
												placeholder="e.g., Lagos"
												value={formData.location.state}
												onChange={(e) =>
													handleLocationChange("state", e.target.value)
												}
												className="rounded-xl"
												disabled={isSubmitting}
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="country">Country</Label>
											<Input
												id="country"
												placeholder="Nigeria"
												value={formData.location.country}
												onChange={(e) =>
													handleLocationChange("country", e.target.value)
												}
												className="rounded-xl"
												disabled={isSubmitting}
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Pricing Information */}
							{/* <div className="space-y-6 pt-6 border-t border-primary/10">
								<h3 className="text-lg font-semibold flex items-center gap-2">
									<DollarSign className="w-5 h-5 text-primary" />
									Pricing
								</h3>

								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<Label htmlFor="isFree" className="cursor-pointer">
											This is a free event
										</Label>
										<input
											type="checkbox"
											id="isFree"
											checked={formData.isFree}
											onChange={(e) => handleChange("isFree", e.target.checked)}
											className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary"
											disabled={isSubmitting}
										/>
									</div>

									{!formData.isFree && (
										<div className="space-y-2">
											<Label htmlFor="price">
												Ticket Price ($) <span className="text-red-500">*</span>
											</Label>
											<div className="relative">
												<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
												<Input
													id="price"
													type="number"
													min="0.01"
													step="0.01"
													placeholder="0.00"
													value={formData.price}
													onChange={(e) =>
														handleChange("price", parseFloat(e.target.value))
													}
													className={`pl-10 rounded-xl ${errors.price ? "border-red-500" : ""}`}
													disabled={isSubmitting}
												/>
											</div>
											{errors.price && (
												<p className="text-sm text-red-500">{errors.price}</p>
											)}
										</div>
									)}
								</div>
							</div> */}

							{/* Event Image */}
							<div className="space-y-6 pt-6 border-t border-primary/10">
								<h3 className="text-lg font-semibold flex items-center gap-2">
									<ImageIcon className="w-5 h-5 text-primary" />
									Event Banner
								</h3>

								<div className="space-y-2">
									<Label htmlFor="banner">Image URL</Label>
									<Input
										id="banner"
										type="url"
										placeholder="https://example.com/event-banner.jpg"
										value={formData.banner}
										onChange={(e) => handleChange("banner", e.target.value)}
										className="rounded-xl"
										disabled={isSubmitting}
									/>
									<p className="text-xs text-muted-foreground">
										Provide a link to an image for your event banner. Supported
										formats: JPG, PNG, GIF
									</p>
									{formData.banner && (
										<div className="mt-4 rounded-xl overflow-hidden border">
											<img
												src={formData.banner}
												alt="Event preview"
												className="w-full h-48 object-cover"
												onError={(e) => {
													(e.target as HTMLImageElement).style.display = "none";
													toast.error("Invalid image URL");
												}}
											/>
										</div>
									)}
								</div>
							</div>

							{/* Info Box */}
							<div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
								<div className="flex gap-3">
									<AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
									<div className="space-y-1">
										<p className="text-sm font-semibold">Review Process</p>
										<p className="text-xs text-muted-foreground">
											Your event will be reviewed by our team before being
											published. This usually takes 24-48 hours. You'll be
											notified via email once your event is approved. You can
											still edit your event while it's pending review.
										</p>
									</div>
								</div>
							</div>

							{/* Form Actions */}
							<div className="flex gap-4 pt-6">
								<Button
									type="submit"
									className="bg-primary hover:bg-primary/90 text-white px-8"
									disabled={isSubmitting}>
									{isSubmitting ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Creating Event...
										</>
									) : (
										"Create Event"
									)}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => router.back()}
									disabled={isSubmitting}>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
