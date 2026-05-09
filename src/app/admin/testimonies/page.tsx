// app/admin/testimonies/page.tsx
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
import { Button } from "@/components/ui/button";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useRevival } from "@/hooks/useRevival";
import { Edit, Loader2, Plus, Search, Star, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminTestimoniesPage() {
	const {
		testimonies,
		getTestimonies,
		createTestimony,
		updateTestimony,
		deleteTestimony,
		isLoading,
	} = useRevival();
	const [searchTerm, setSearchTerm] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedTestimony, setSelectedTestimony] = useState<any>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [testimonyToDelete, setTestimonyToDelete] = useState<any>(null);

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

	const filteredTestimonies = testimonies.filter(
		(t) =>
			t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			t.event.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleOpenCreateDialog = () => {
		setIsEditing(false);
		setSelectedTestimony(null);
		setFormData({ name: "", event: "", content: "", rating: 5, avatar: "" });
		setIsDialogOpen(true);
	};

	const handleOpenEditDialog = (testimony: any) => {
		setIsEditing(true);
		setSelectedTestimony(testimony);
		setFormData({
			name: testimony.name,
			event: testimony.event,
			content: testimony.content,
			rating: testimony.rating,
			avatar: testimony.avatar || "",
		});
		setIsDialogOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.name.trim() ||
			!formData.event.trim() ||
			!formData.content.trim()
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		setIsSubmitting(true);
		try {
			if (isEditing && selectedTestimony) {
				await updateTestimony(selectedTestimony._id, formData);
			} else {
				await createTestimony(formData);
			}
			setIsDialogOpen(false);
			await getTestimonies();
		} catch (error) {
			toast.error(
				isEditing ? "Failed to update testimony" : "Failed to create testimony",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteClick = (testimony: any) => {
		setTestimonyToDelete(testimony);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!testimonyToDelete) return;

		try {
			await deleteTestimony(testimonyToDelete._id);
			setDeleteDialogOpen(false);
			setTestimonyToDelete(null);
			await getTestimonies();
		} catch (error) {
			toast.error("Failed to delete testimony");
		}
	};

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-primary">
						Testimonies
					</h1>
					<p className="text-muted-foreground">
						Manage user testimonies and stories
					</p>
				</div>
				<Button
					onClick={handleOpenCreateDialog}
					className="bg-primary hover:bg-primary/90">
					<Plus className="w-4 h-4 mr-2" />
					Add Testimony
				</Button>
			</div>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
				<Input
					placeholder="Search testimonies..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-10"
				/>
			</div>

			<div className="bg-card rounded-2xl border border-primary/5 shadow-xl overflow-hidden">
				<Table>
					<TableHeader className="bg-primary/5">
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Event</TableHead>
							<TableHead>Rating</TableHead>
							<TableHead>Content</TableHead>
							<TableHead>Likes</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredTestimonies.map((testimony) => (
							<TableRow key={testimony._id}>
								<TableCell className="font-medium">{testimony.name}</TableCell>
								<TableCell>{testimony.event}</TableCell>
								<TableCell>
									<div className="flex gap-0.5">
										{[...Array(testimony.rating)].map((_, i) => (
											<Star
												key={i}
												className="w-3 h-3 fill-amber-500 text-amber-500"
											/>
										))}
									</div>
								</TableCell>
								<TableCell className="max-w-md truncate">
									{testimony.content}
								</TableCell>
								<TableCell>{testimony.likes || 0}</TableCell>
								<TableCell className="text-right">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleOpenEditDialog(testimony)}>
										<Edit className="w-4 h-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleDeleteClick(testimony)}>
										<Trash className="w-4 h-4 text-red-600" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Create/Edit Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>
							{isEditing ? "Edit Testimony" : "Add Testimony"}
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? "Update the testimony details below"
								: "Add a new testimony from a user"}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name *</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="event">Event *</Label>
								<Input
									id="event"
									value={formData.event}
									onChange={(e) =>
										setFormData({ ...formData, event: e.target.value })
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="rating">Rating (1-5)</Label>
								<Input
									id="rating"
									type="number"
									min="1"
									max="5"
									value={formData.rating}
									onChange={(e) =>
										setFormData({
											...formData,
											rating: parseInt(e.target.value),
										})
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="avatar">Avatar URL</Label>
								<Input
									id="avatar"
									value={formData.avatar}
									onChange={(e) =>
										setFormData({ ...formData, avatar: e.target.value })
									}
									placeholder="https://example.com/avatar.jpg"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="content">Testimony *</Label>
								<Textarea
									id="content"
									value={formData.content}
									onChange={(e) =>
										setFormData({ ...formData, content: e.target.value })
									}
									rows={4}
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : isEditing ? (
									"Save"
								) : (
									"Create"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Testimony</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this testimony? This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							className="bg-red-600">
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
