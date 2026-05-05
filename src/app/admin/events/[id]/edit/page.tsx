// app/admin/events/[id]/edit/page.tsx
"use client";

import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditEventPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const router = useRouter();
	const {
		getEventById,
		selectedEvent,
		updateEvent,
		categories,
		getCategories,
		isLoading,
	} = useRevival();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		location: {
			address: "",
			city: "",
			state: "",
			country: "",
		},
		date: "",
		time: "",
		isFree: true,
		price: 0,
		banner: "",
		status: "pending",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		getEventById(id);
		getCategories();
	}, [id]);

	useEffect(() => {
		if (selectedEvent) {
			setFormData({
				title: selectedEvent.title || "",
				description: selectedEvent.description || "",
				category:
					typeof selectedEvent.category === "object"
						? selectedEvent?.category._id
						: selectedEvent.category || "",
				location: {
					address: selectedEvent.location?.address || "",
					city: selectedEvent.location?.city || "",
					state: selectedEvent.location?.state || "",
					country: selectedEvent.location?.country || "",
				},
				date: selectedEvent.date?.split("T")[0] || "",
				time: selectedEvent.time || "",
				isFree: selectedEvent.isFree ?? true,
				price: selectedEvent.price || 0,
				banner: selectedEvent.banner || selectedEvent.image || "",
				status: selectedEvent.status || "pending",
			});
		}
	}, [selectedEvent]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await updateEvent(id, formData);
			toast.success("Event updated successfully!");
			router.push("/admin/events");
		} catch (error: any) {
			toast.error("Failed to update event", {
				description: error.message,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading && !selectedEvent) {
		return (
			<div className="flex justify-center items-center h-96">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="flex items-center gap-4">
				<Link href="/admin/events">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-5 w-5" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-primary">
						Edit Event
					</h1>
					<p className="text-muted-foreground">
						Update event details and manage its status
					</p>
				</div>
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-6 bg-card rounded-2xl border border-primary/5 p-6">
				<div className="space-y-2">
					<Label htmlFor="title">Event Title *</Label>
					<Input
						id="title"
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						required
						className="rounded-xl"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Description *</Label>
					<Textarea
						id="description"
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
						rows={6}
						required
						className="rounded-xl"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="category">Category</Label>
						<Select
							value={formData.category}
							onValueChange={(value) =>
								setFormData({ ...formData, category: value })
							}>
							<SelectTrigger className="rounded-xl">
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((cat) => (
									<SelectItem key={cat._id} value={cat._id}>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<Select
							value={formData.status}
							onValueChange={(value) =>
								setFormData({ ...formData, status: value })
							}>
							<SelectTrigger className="rounded-xl">
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="approved">Approved</SelectItem>
								<SelectItem value="rejected">Rejected</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="date">Date *</Label>
						<Input
							id="date"
							type="date"
							value={formData.date}
							onChange={(e) =>
								setFormData({ ...formData, date: e.target.value })
							}
							required
							className="rounded-xl"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="time">Time</Label>
						<Input
							id="time"
							type="time"
							value={formData.time}
							onChange={(e) =>
								setFormData({ ...formData, time: e.target.value })
							}
							className="rounded-xl"
						/>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="font-semibold">Location</h3>
					<div className="grid grid-cols-1 gap-4">
						<Input
							placeholder="Address"
							value={formData.location.address}
							onChange={(e) =>
								setFormData({
									...formData,
									location: { ...formData.location, address: e.target.value },
								})
							}
							className="rounded-xl"
						/>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Input
								placeholder="City"
								value={formData.location.city}
								onChange={(e) =>
									setFormData({
										...formData,
										location: { ...formData.location, city: e.target.value },
									})
								}
								className="rounded-xl"
							/>
							<Input
								placeholder="State"
								value={formData.location.state}
								onChange={(e) =>
									setFormData({
										...formData,
										location: { ...formData.location, state: e.target.value },
									})
								}
								className="rounded-xl"
							/>
							<Input
								placeholder="Country"
								value={formData.location.country}
								onChange={(e) =>
									setFormData({
										...formData,
										location: { ...formData.location, country: e.target.value },
									})
								}
								className="rounded-xl"
							/>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<div className="flex items-center gap-4">
						<Label htmlFor="isFree">Free Event</Label>
						<input
							type="checkbox"
							id="isFree"
							checked={formData.isFree}
							onChange={(e) =>
								setFormData({ ...formData, isFree: e.target.checked })
							}
							className="rounded"
						/>
					</div>

					{!formData.isFree && (
						<div className="space-y-2">
							<Label htmlFor="price">Price ($)</Label>
							<Input
								id="price"
								type="number"
								min="0"
								step="0.01"
								value={formData.price}
								onChange={(e) =>
									setFormData({
										...formData,
										price: parseFloat(e.target.value),
									})
								}
								className="rounded-xl"
							/>
						</div>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="banner">Banner Image URL</Label>
					<Input
						id="banner"
						type="url"
						placeholder="https://example.com/image.jpg"
						value={formData.banner}
						onChange={(e) =>
							setFormData({ ...formData, banner: e.target.value })
						}
						className="rounded-xl"
					/>
				</div>

				<div className="flex gap-4 pt-4">
					<Button
						type="submit"
						className="bg-primary hover:bg-primary/90"
						disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Saving...
							</>
						) : (
							"Save Changes"
						)}
					</Button>
					<Button type="button" variant="outline" onClick={() => router.back()}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}
