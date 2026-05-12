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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useRevival } from "@/hooks/useRevival";
import {
	CheckCircle,
	Edit,
	Eye,
	Loader2,
	Plus,
	Search,
	Star,
	Trash,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminTestimoniesPage() {
	const {
		testimonies,
		pendingTestimonies,
		getTestimonies,
		getPendingTestimonies,
		createTestimony,
		updateTestimony,
		deleteTestimony,
		isLoading,
	} = useRevival();

	const [searchTerm, setSearchTerm] = useState("");
	const [activeTab, setActiveTab] = useState("pending");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isViewing, setIsViewing] = useState(false);
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
		status: "approved",
	});

	useEffect(() => {
		if (activeTab === "pending") {
			getPendingTestimonies();
		} else {
			getTestimonies();
		}
	}, [activeTab]);

	// For searching, combine both lists based on active tab
	const displayTestimonies =
		activeTab === "pending" ? pendingTestimonies : testimonies;

	const filteredTestimonies = displayTestimonies.filter(
		(t) =>
			t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			t.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
			t.content.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleOpenCreateDialog = () => {
		setIsEditing(false);
		setIsViewing(false);
		setSelectedTestimony(null);
		setFormData({
			name: "",
			event: "",
			content: "",
			rating: 5,
			avatar: "",
			status: "approved",
		});
		setIsDialogOpen(true);
	};

	const handleOpenEditDialog = (testimony: any) => {
		setIsEditing(true);
		setIsViewing(false);
		setSelectedTestimony(testimony);
		setFormData({
			name: testimony.name,
			event: testimony.event,
			content: testimony.content,
			rating: testimony.rating,
			avatar: testimony.avatar || "",
			status: testimony.status || "pending",
		});
		setIsDialogOpen(true);
	};

	const handleViewDetails = (testimony: any) => {
		setIsViewing(true);
		setIsEditing(false);
		setSelectedTestimony(testimony);
		setFormData({
			name: testimony.name,
			event: testimony.event,
			content: testimony.content,
			rating: testimony.rating,
			avatar: testimony.avatar || "",
			status: testimony.status || "pending",
		});
		setIsDialogOpen(true);
	};

	const handleApprove = async (testimony: any) => {
		try {
			await updateTestimony(testimony._id, {
				...testimony,
				status: "approved",
			});
			toast.success("Testimony approved and published!");
			await getPendingTestimonies();
			await getTestimonies();
		} catch (error) {
			toast.error("Failed to approve testimony");
		}
	};

	const handleDecline = async (testimony: any) => {
		try {
			await updateTestimony(testimony._id, {
				...testimony,
				status: "declined",
			});
			toast.success("Testimony declined");
			await getPendingTestimonies();
		} catch (error) {
			toast.error("Failed to decline testimony");
		}
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
				toast.success("Testimony updated successfully!");
			} else {
				await createTestimony(formData);
				toast.success("Testimony created successfully!");
			}
			setIsDialogOpen(false);
			await getTestimonies();
			await getPendingTestimonies();
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
			toast.success("Testimony deleted successfully");
			setDeleteDialogOpen(false);
			setTestimonyToDelete(null);
			await getTestimonies();
			await getPendingTestimonies();
		} catch (error) {
			toast.error("Failed to delete testimony");
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "approved":
				return (
					<Badge className="bg-green-500/20 text-green-600 border-green-500/30 rounded-full">
						Approved
					</Badge>
				);
			case "pending":
				return (
					<Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 rounded-full">
						Pending
					</Badge>
				);
			case "declined":
				return (
					<Badge className="bg-red-500/20 text-red-600 border-red-500/30 rounded-full">
						Declined
					</Badge>
				);
			default:
				return <Badge className="bg-gray-500/20 text-gray-600">Unknown</Badge>;
		}
	};

	if (isLoading && displayTestimonies.length === 0) {
		return (
			<div className="flex justify-center items-center h-96">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-primary">
						Testimonies Management
					</h1>
					<p className="text-muted-foreground">
						Manage, approve, and moderate user testimonies
					</p>
				</div>
				<Button
					onClick={handleOpenCreateDialog}
					className="bg-primary hover:bg-primary/90">
					<Plus className="w-4 h-4 mr-2" />
					Add Testimony
				</Button>
			</div>

			<Tabs
				defaultValue="pending"
				onValueChange={setActiveTab}
				className="w-full">
				<TabsList className="bg-primary/5 p-1 rounded-2xl">
					<TabsTrigger value="pending" className="rounded-xl px-6">
						Pending Review ({pendingTestimonies?.length || 0})
					</TabsTrigger>
					<TabsTrigger value="approved" className="rounded-xl px-6">
						Approved ({testimonies?.length || 0})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="pending" className="mt-6">
					<div className="relative mb-4">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search pending testimonies..."
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
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredTestimonies.map((testimony) => (
									<TableRow key={testimony._id}>
										<TableCell className="font-medium">
											{testimony.name}
										</TableCell>
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
										<TableCell>{getStatusBadge(testimony.status)}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleViewDetails(testimony)}
													title="View Details">
													<Eye className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleApprove(testimony)}
													className="text-green-600 hover:text-green-700 hover:bg-green-50"
													title="Approve">
													<CheckCircle className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDecline(testimony)}
													className="text-red-600 hover:text-red-700 hover:bg-red-50"
													title="Decline">
													<XCircle className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDeleteClick(testimony)}
													className="text-red-600"
													title="Delete">
													<Trash className="w-4 h-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
								{filteredTestimonies.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center py-8 text-muted-foreground">
											No pending testimonies to review
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</TabsContent>

				<TabsContent value="approved" className="mt-6">
					<div className="relative mb-4">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search approved testimonies..."
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
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredTestimonies.map((testimony) => (
									<TableRow key={testimony._id}>
										<TableCell className="font-medium">
											{testimony.name}
										</TableCell>
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
										<TableCell>{getStatusBadge(testimony.status)}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
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
											</div>
										</TableCell>
									</TableRow>
								))}
								{filteredTestimonies.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={7}
											className="text-center py-8 text-muted-foreground">
											No approved testimonies found
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</TabsContent>
			</Tabs>

			{/* Create/Edit/View Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{isViewing
								? "Testimony Details"
								: isEditing
									? "Edit Testimony"
									: "Add Testimony"}
						</DialogTitle>
						<DialogDescription>
							{isViewing
								? "View testimony details and status"
								: isEditing
									? "Update the testimony details below"
									: "Add a new testimony to the platform"}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="space-y-4 py-4">
							{isViewing && selectedTestimony && (
								<div className="mb-4 p-3 bg-primary/5 rounded-xl">
									<p className="text-sm font-semibold mb-1">
										Status: {getStatusBadge(selectedTestimony.status)}
									</p>
									<p className="text-xs text-muted-foreground">
										Submitted:{" "}
										{new Date(selectedTestimony.createdAt).toLocaleString()}
									</p>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="name">Name *</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									disabled={isViewing}
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
									disabled={isViewing}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="rating">Rating (1-5)</Label>
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											disabled={isViewing}
											onClick={() => setFormData({ ...formData, rating: star })}
											className={`p-1 ${!isViewing ? "hover:scale-110 transition-transform" : ""}`}>
											<Star
												className={`w-6 h-6 ${
													star <= formData.rating
														? "fill-amber-500 text-amber-500"
														: "text-muted-foreground"
												}`}
											/>
										</button>
									))}
								</div>
							</div>

							{!isViewing && (
								<div className="space-y-2">
									<Label htmlFor="status">Status</Label>
									<select
										id="status"
										value={formData.status}
										onChange={(e) =>
											setFormData({ ...formData, status: e.target.value })
										}
										className="w-full rounded-xl border border-input bg-background px-3 py-2">
										<option value="pending">Pending</option>
										<option value="approved">Approved</option>
										<option value="declined">Declined</option>
									</select>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="avatar">Avatar URL</Label>
								<Input
									id="avatar"
									value={formData.avatar}
									onChange={(e) =>
										setFormData({ ...formData, avatar: e.target.value })
									}
									disabled={isViewing}
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
									disabled={isViewing}
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}>
								{isViewing ? "Close" : "Cancel"}
							</Button>
							{!isViewing && (
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : isEditing ? (
										"Save Changes"
									) : (
										"Create Testimony"
									)}
								</Button>
							)}
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
