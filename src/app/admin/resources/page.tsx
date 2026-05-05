// app/admin/resources/page.tsx
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { format } from "date-fns";
import {
	Download,
	Edit,
	ExternalLink,
	File,
	FileAudio,
	FileImage,
	FileText,
	Link as LinkIcon,
	Loader2,
	MoreVertical,
	Plus,
	Search,
	Trash,
	Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Resource {
	_id: string;
	title: string;
	description?: string;
	type: string;
	fileUrl?: string;
	uploadedBy: string | { name: string; email: string };
	createdAt: string;
}

const resourceTypeIcons = {
	pdf: FileText,
	video: Video,
	link: LinkIcon,
	audio: FileAudio,
	image: FileImage,
	document: FileText,
	default: File,
};

const resourceTypeColors = {
	pdf: "text-red-500 bg-red-500/10",
	video: "text-blue-500 bg-blue-500/10",
	link: "text-green-500 bg-green-500/10",
	audio: "text-purple-500 bg-purple-500/10",
	image: "text-pink-500 bg-pink-500/10",
	document: "text-orange-500 bg-orange-500/10",
	default: "text-gray-500 bg-gray-500/10",
};

export default function AdminResourcesPage() {
	const {
		getResources,
		resources,
		createResource,
		deleteResource,
		isLoading,
		user,
	} = useRevival();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
	const [typeFilter, setTypeFilter] = useState("all");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedResource, setSelectedResource] = useState<Resource | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(
		null,
	);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		type: "pdf",
		fileUrl: "",
	});

	useEffect(() => {
		fetchResources();
	}, []);

	const fetchResources = async () => {
		try {
			await getResources();
		} catch (error) {
			console.error("Failed to fetch resources:", error);
			toast.error("Failed to load resources");
		}
	};

	// Filter resources based on search term and type
	useEffect(() => {
		let filtered = [...resources];

		if (searchTerm) {
			filtered = filtered.filter(
				(resource) =>
					resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					resource.description
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()),
			);
		}

		if (typeFilter !== "all") {
			filtered = filtered.filter((resource) => resource.type === typeFilter);
		}

		setFilteredResources(filtered);
	}, [resources, searchTerm, typeFilter]);

	const handleOpenCreateDialog = () => {
		setIsEditing(false);
		setSelectedResource(null);
		setFormData({
			title: "",
			description: "",
			type: "pdf",
			fileUrl: "",
		});
		setIsDialogOpen(true);
	};

	const handleOpenEditDialog = (resource: Resource) => {
		setIsEditing(true);
		setSelectedResource(resource);
		setFormData({
			title: resource.title,
			description: resource.description || "",
			type: resource.type,
			fileUrl: resource.fileUrl || "",
		});
		setIsDialogOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.title.trim()) {
			toast.error("Resource title is required");
			return;
		}

		if (!formData.fileUrl.trim()) {
			toast.error("File URL is required");
			return;
		}

		setIsSubmitting(true);

		try {
			if (isEditing && selectedResource) {
				// Note: Add updateResource endpoint if needed
				toast.info("Update functionality coming soon");
				// await updateResource(selectedResource._id, formData);
			} else {
				await createResource(formData);
				toast.success("Resource created successfully");
			}

			setIsDialogOpen(false);
			await fetchResources(); // Refresh the list
			setFormData({ title: "", description: "", type: "pdf", fileUrl: "" });
		} catch (error: any) {
			toast.error(
				isEditing ? "Failed to update resource" : "Failed to create resource",
				{
					description: error.message || "Please try again",
				},
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteClick = (resource: Resource) => {
		setResourceToDelete(resource);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!resourceToDelete) return;

		setIsSubmitting(true);
		try {
			await deleteResource(resourceToDelete._id);
			toast.success(`Resource "${resourceToDelete.title}" has been deleted`);
			setDeleteDialogOpen(false);
			setResourceToDelete(null);
			await fetchResources(); // Refresh the list
		} catch (error: any) {
			toast.error("Failed to delete resource", {
				description: error.message || "Please try again",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const getResourceIcon = (type: string) => {
		const Icon =
			resourceTypeIcons[type as keyof typeof resourceTypeIcons] ||
			resourceTypeIcons.default;
		return Icon;
	};

	const getResourceTypeBadge = (type: string) => {
		const colorClass =
			resourceTypeColors[type as keyof typeof resourceTypeColors] ||
			resourceTypeColors.default;
		return (
			<Badge
				className={`${colorClass} border-none rounded-full px-3 py-1 capitalize`}>
				{type}
			</Badge>
		);
	};

	const getFileTypeIcon = (url: string, type: string) => {
		if (type === "link") return <ExternalLink className="w-4 h-4" />;
		if (type === "pdf") return <FileText className="w-4 h-4" />;
		if (type === "video") return <Video className="w-4 h-4" />;
		if (type === "audio") return <FileAudio className="w-4 h-4" />;
		return <Download className="w-4 h-4" />;
	};

	if (isLoading && resources.length === 0) {
		return (
			<div className="flex justify-center items-center h-96">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading resources...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-primary">
						Resources
					</h1>
					<p className="text-muted-foreground">
						Manage spiritual resources, sermon notes, and media
					</p>
				</div>
				<Button
					onClick={handleOpenCreateDialog}
					className="bg-primary hover:bg-primary/90 rounded-xl px-6 gap-2 h-12 shadow-lg shadow-primary/20">
					<Plus className="w-5 h-5" />
					Add Resource
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Total Resources</p>
							<p className="text-3xl font-bold">{resources.length}</p>
						</div>
						<FileText className="w-8 h-8 text-primary/40" />
					</div>
				</div>
				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">PDF Documents</p>
							<p className="text-3xl font-bold">
								{resources.filter((r) => r.type === "pdf").length}
							</p>
						</div>
						<FileText className="w-8 h-8 text-primary/40" />
					</div>
				</div>
				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Videos</p>
							<p className="text-3xl font-bold">
								{resources.filter((r) => r.type === "video").length}
							</p>
						</div>
						<Video className="w-8 h-8 text-primary/40" />
					</div>
				</div>
				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Links</p>
							<p className="text-3xl font-bold">
								{resources.filter((r) => r.type === "link").length}
							</p>
						</div>
						<LinkIcon className="w-8 h-8 text-primary/40" />
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-grow">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<Input
						placeholder="Search resources by title or description..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 h-11 bg-background border-primary/10 focus-visible:ring-primary/20 rounded-xl"
					/>
				</div>
				<select
					value={typeFilter}
					onChange={(e) => setTypeFilter(e.target.value)}
					className="h-11 px-4 rounded-xl border border-primary/10 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
					<option value="all">All Types</option>
					<option value="pdf">PDF Documents</option>
					<option value="video">Videos</option>
					<option value="audio">Audio</option>
					<option value="link">Links</option>
					<option value="image">Images</option>
				</select>
				{(searchTerm || typeFilter !== "all") && (
					<Button
						variant="outline"
						onClick={() => {
							setSearchTerm("");
							setTypeFilter("all");
						}}
						className="h-11 rounded-xl">
						Clear Filters
					</Button>
				)}
			</div>

			{/* Resources Table */}
			<div className="bg-card rounded-2xl border border-primary/5 shadow-xl overflow-hidden">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="bg-primary/5">
							<TableRow className="hover:bg-transparent border-primary/10">
								<TableHead className="font-bold py-4 w-[300px]">
									Resource
								</TableHead>
								<TableHead className="font-bold">Type</TableHead>
								<TableHead className="font-bold">Uploaded By</TableHead>
								<TableHead className="font-bold">Date Added</TableHead>
								<TableHead className="text-right font-bold">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredResources.length > 0 ? (
								filteredResources.map((resource) => {
									const Icon = getResourceIcon(resource.type);
									const uploadedByName =
										typeof resource.uploadedBy === "object"
											? resource.uploadedBy.name
											: "Unknown";

									return (
										<TableRow
											key={resource._id}
											className="hover:bg-primary/[0.02] border-primary/5">
											<TableCell className="py-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
														<Icon className="w-5 h-5 text-primary" />
													</div>
													<div>
														<p className="font-bold text-sm">
															{resource.title}
														</p>
														{resource.description && (
															<p className="text-xs text-muted-foreground line-clamp-1">
																{resource.description}
															</p>
														)}
													</div>
												</div>
											</TableCell>
											<TableCell>
												{getResourceTypeBadge(resource.type)}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
														<span className="text-xs font-bold text-primary">
															{uploadedByName.charAt(0).toUpperCase()}
														</span>
													</div>
													<span className="text-sm">{uploadedByName}</span>
												</div>
											</TableCell>
											<TableCell>
												<span className="text-sm">
													{format(new Date(resource.createdAt), "MMM dd, yyyy")}
												</span>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<a
														href={resource.fileUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex">
														<Button
															variant="ghost"
															size="icon"
															className="h-9 w-9 text-muted-foreground hover:text-primary"
															title="View Resource">
															{getFileTypeIcon(
																resource.fileUrl || "",
																resource.type,
															)}
														</Button>
													</a>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-9 w-9">
																<MoreVertical className="w-4 h-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-48">
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onClick={() => handleOpenEditDialog(resource)}>
																<Edit className="w-4 h-4 mr-2" />
																Edit
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => handleDeleteClick(resource)}
																className="text-red-600">
																<Trash className="w-4 h-4 mr-2" />
																Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</TableCell>
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center py-12 text-muted-foreground">
										{searchTerm || typeFilter !== "all"
											? "No resources match your filters."
											: "No resources found. Create your first resource!"}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Create/Edit Resource Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[600px] rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">
							{isEditing ? "Edit Resource" : "Add New Resource"}
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? "Update the resource details below."
								: "Add a new spiritual resource for the community."}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit}>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="title">
									Title <span className="text-red-500">*</span>
								</Label>
								<Input
									id="title"
									placeholder="e.g., Revival Sermon Notes"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									className="rounded-xl"
									disabled={isSubmitting}
									autoFocus
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description (Optional)</Label>
								<Textarea
									id="description"
									placeholder="Brief description of the resource..."
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									rows={3}
									className="rounded-xl"
									disabled={isSubmitting}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="type">
										Resource Type <span className="text-red-500">*</span>
									</Label>
									<Select
										value={formData.type}
										onValueChange={(value) =>
											setFormData({ ...formData, type: value })
										}>
										<SelectTrigger className="rounded-xl">
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pdf">PDF Document</SelectItem>
											<SelectItem value="video">Video</SelectItem>
											<SelectItem value="audio">Audio</SelectItem>
											<SelectItem value="link">External Link</SelectItem>
											<SelectItem value="image">Image</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="fileUrl">
										File/URL <span className="text-red-500">*</span>
									</Label>
									<Input
										id="fileUrl"
										type="url"
										placeholder={
											formData.type === "link"
												? "https://example.com/resource"
												: "https://example.com/file.pdf"
										}
										value={formData.fileUrl}
										onChange={(e) =>
											setFormData({ ...formData, fileUrl: e.target.value })
										}
										className="rounded-xl"
										disabled={isSubmitting}
									/>
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
								disabled={isSubmitting}>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-primary hover:bg-primary/90"
								disabled={
									isSubmitting ||
									!formData.title.trim() ||
									!formData.fileUrl.trim()
								}>
								{isSubmitting ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										{isEditing ? "Saving..." : "Creating..."}
									</>
								) : isEditing ? (
									"Save Changes"
								) : (
									"Create Resource"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Resource</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{resourceToDelete?.title}"? This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isSubmitting}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							disabled={isSubmitting}
							className="bg-red-600 hover:bg-red-700">
							{isSubmitting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete Resource"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
