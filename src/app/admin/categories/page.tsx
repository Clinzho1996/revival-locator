// app/admin/categories/page.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { useRevival } from "@/hooks/useRevival";
import {
	Calendar,
	Edit,
	FolderOpen,
	Loader2,
	Plus,
	Search,
	Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Category {
	_id: string;
	name: string;
	description?: string;
	createdAt?: string;
	eventCount?: number;
}

export default function AdminCategoriesPage() {
	const {
		categories,
		getCategories,
		createCategory,
		updateCategory,
		deleteCategory,
		getEvents,
		events,
		isLoading,
	} = useRevival();

	const [searchTerm, setSearchTerm] = useState("");
	const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
		null,
	);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			await Promise.all([getCategories(), getEvents()]);
		} catch (error) {
			console.error("Failed to fetch data:", error);
			toast.error("Failed to load categories");
		}
	};

	// Calculate event count for each category
	useEffect(() => {
		const categoriesWithCount = categories.map((category: Category) => ({
			...category,
			eventCount: events.filter((event: any) => {
				const eventCategory =
					typeof event.category === "object"
						? event.category._id
						: event.category;
				return eventCategory === category._id;
			}).length,
		}));

		setFilteredCategories(categoriesWithCount);
	}, [categories, events]);

	// Filter categories based on search term
	useEffect(() => {
		if (searchTerm) {
			const filtered = categories.filter(
				(category: Category) =>
					category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					category.description
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()),
			);
			const filteredWithCount = filtered.map((cat: Category) => ({
				...cat,
				eventCount: events.filter((event: any) => {
					const eventCategory =
						typeof event.category === "object"
							? event.category._id
							: event.category;
					return eventCategory === cat._id;
				}).length,
			}));
			setFilteredCategories(filteredWithCount);
		} else {
			const allWithCount = categories.map((category: Category) => ({
				...category,
				eventCount: events.filter((event: any) => {
					const eventCategory =
						typeof event.category === "object"
							? event.category._id
							: event.category;
					return eventCategory === category._id;
				}).length,
			}));
			setFilteredCategories(allWithCount);
		}
	}, [searchTerm, categories, events]);

	const handleOpenCreateDialog = () => {
		setIsEditing(false);
		setSelectedCategory(null);
		setFormData({ name: "", description: "" });
		setIsDialogOpen(true);
	};

	const handleOpenEditDialog = (category: Category) => {
		setIsEditing(true);
		setSelectedCategory(category);
		setFormData({
			name: category.name,
			description: category.description || "",
		});
		setIsDialogOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			toast.error("Category name is required");
			return;
		}

		setIsSubmitting(true);

		try {
			if (isEditing && selectedCategory) {
				await updateCategory(selectedCategory._id, { name: formData.name });
				toast.success("Category updated successfully");
			} else {
				await createCategory(formData.name, formData.description);
				toast.success("Category created successfully");
			}

			setIsDialogOpen(false);
			await getCategories(); // Refresh the list
			setFormData({ name: "", description: "" });
		} catch (error: any) {
			toast.error(
				isEditing ? "Failed to update category" : "Failed to create category",
				{
					description: error.message || "Please try again",
				},
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteClick = (category: Category) => {
		if (category.eventCount && category.eventCount > 0) {
			toast.error(`Cannot delete "${category.name}"`, {
				description: `This category has ${category.eventCount} event(s) associated with it. Please reassign or delete those events first.`,
			});
			return;
		}
		setCategoryToDelete(category);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!categoryToDelete) return;

		setIsSubmitting(true);
		try {
			await deleteCategory(categoryToDelete._id);
			toast.success(`Category "${categoryToDelete.name}" has been deleted`);
			setDeleteDialogOpen(false);
			setCategoryToDelete(null);
			await getCategories(); // Refresh the list
		} catch (error: any) {
			toast.error("Failed to delete category", {
				description: error.message || "Please try again",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading && categories.length === 0) {
		return (
			<div className="flex justify-center items-center h-96">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading categories...</p>
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
						Categories
					</h1>
					<p className="text-muted-foreground">
						Manage event categories for the platform
					</p>
				</div>
				<Button
					onClick={handleOpenCreateDialog}
					className="bg-primary hover:bg-primary/90 rounded-xl px-6 gap-2 h-12 shadow-lg shadow-primary/20">
					<Plus className="w-5 h-5" />
					New Category
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Total Categories</p>
							<p className="text-3xl font-bold">{categories.length}</p>
						</div>
						<FolderOpen className="w-8 h-8 text-primary/40" />
					</div>
				</div>
				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Total Events</p>
							<p className="text-3xl font-bold">{events.length}</p>
						</div>
						<Calendar className="w-8 h-8 text-primary/40" />
					</div>
				</div>
				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">
								Avg Events per Category
							</p>
							<p className="text-3xl font-bold">
								{categories.length > 0
									? (events.length / categories.length).toFixed(1)
									: "0"}
							</p>
						</div>
						<FolderOpen className="w-8 h-8 text-primary/40" />
					</div>
				</div>
			</div>

			{/* Search Bar */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
				<Input
					placeholder="Search categories by name or description..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-10 h-11 bg-background border-primary/10 focus-visible:ring-primary/20 rounded-xl"
				/>
			</div>

			{/* Categories Table */}
			<div className="bg-card rounded-2xl border border-primary/5 shadow-xl overflow-hidden">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="bg-primary/5">
							<TableRow className="hover:bg-transparent border-primary/10">
								<TableHead className="font-bold py-4">Category Name</TableHead>
								<TableHead className="font-bold">Description</TableHead>
								<TableHead className="font-bold text-center">
									Events Count
								</TableHead>
								<TableHead className="font-bold">Created</TableHead>
								<TableHead className="text-right font-bold">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredCategories.length > 0 ? (
								filteredCategories.map((category) => (
									<TableRow
										key={category._id}
										className="hover:bg-primary/[0.02] border-primary/5">
										<TableCell className="py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
													<FolderOpen className="w-5 h-5 text-primary" />
												</div>
												<div>
													<p className="font-bold text-sm">{category.name}</p>
													<p className="text-xs text-muted-foreground">
														ID: {category._id.slice(-8)}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<p className="text-sm text-muted-foreground max-w-md">
												{category.description || "No description provided"}
											</p>
										</TableCell>
										<TableCell className="text-center">
											<Badge
												variant="secondary"
												className="rounded-full bg-primary/10 text-primary">
												{category.eventCount || 0} events
											</Badge>
										</TableCell>
										<TableCell>
											<p className="text-sm">
												{category.createdAt
													? new Date(category.createdAt).toLocaleDateString()
													: "N/A"}
											</p>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleOpenEditDialog(category)}
													className="h-9 w-9 text-muted-foreground hover:text-primary"
													title="Edit Category">
													<Edit className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDeleteClick(category)}
													className="h-9 w-9 text-muted-foreground hover:text-destructive"
													title="Delete Category">
													<Trash className="w-4 h-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center py-12 text-muted-foreground">
										{searchTerm
											? "No categories match your search."
											: "No categories found. Create your first category!"}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Create/Edit Category Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[500px] rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">
							{isEditing ? "Edit Category" : "Create New Category"}
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? "Update the category name and description below."
								: "Add a new category to organize events better."}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit}>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="name">
									Category Name <span className="text-red-500">*</span>
								</Label>
								<Input
									id="name"
									placeholder="e.g., Revival, Worship, Conference"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									className="rounded-xl"
									disabled={isSubmitting}
									autoFocus
								/>
								<p className="text-xs text-muted-foreground">
									This will be displayed on event cards and filters
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description (Optional)</Label>
								<Textarea
									id="description"
									placeholder="Describe what this category represents..."
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									rows={3}
									className="rounded-xl"
									disabled={isSubmitting}
								/>
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
								disabled={isSubmitting || !formData.name.trim()}>
								{isSubmitting ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										{isEditing ? "Saving..." : "Creating..."}
									</>
								) : isEditing ? (
									"Save Changes"
								) : (
									"Create Category"
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
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							category "{categoryToDelete?.name}" and remove it from all events.
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
								"Delete Category"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
