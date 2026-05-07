// app/admin/blogs/page.tsx
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
	Edit,
	Eye,
	Loader2,
	MoreVertical,
	Plus,
	Search,
	Trash,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminBlogsPage() {
	const { getBlogs, blogs, deleteBlog, isLoading } = useRevival();
	const [searchTerm, setSearchTerm] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [blogToDelete, setBlogToDelete] = useState<any>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		fetchBlogs();
	}, []);

	const fetchBlogs = async () => {
		await getBlogs({});
	};

	const handleDeleteClick = (blog: any) => {
		setBlogToDelete(blog);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!blogToDelete) return;

		setIsDeleting(true);
		try {
			await deleteBlog(blogToDelete._id);
			setDeleteDialogOpen(false);
			setBlogToDelete(null);
			await fetchBlogs();
		} catch (error) {
			toast.error("Failed to delete blog");
		} finally {
			setIsDeleting(false);
		}
	};

	const filteredBlogs = blogs.filter((blog: any) =>
		blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-primary">
						Blog Management
					</h1>
					<p className="text-muted-foreground">
						Create, edit, and manage blog posts
					</p>
				</div>
				<Link href="/admin/blogs/new">
					<Button className="bg-primary hover:bg-primary/90 rounded-xl px-6 gap-2 h-12">
						<Plus className="w-5 h-5" />
						Write New Post
					</Button>
				</Link>
			</div>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
				<Input
					placeholder="Search blogs..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-10 rounded-xl"
				/>
			</div>

			<div className="bg-card rounded-2xl border border-primary/5 shadow-xl overflow-hidden">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="bg-primary/5">
							<TableRow className="hover:bg-transparent border-primary/10">
								<TableHead className="font-bold py-4">Title</TableHead>
								<TableHead className="font-bold">Category</TableHead>
								<TableHead className="font-bold">Author</TableHead>
								<TableHead className="font-bold">Published</TableHead>
								<TableHead className="font-bold text-center">Views</TableHead>
								<TableHead className="font-bold text-center">Likes</TableHead>
								<TableHead className="text-right font-bold">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredBlogs.map((blog: any) => (
								<TableRow
									key={blog._id}
									className="hover:bg-primary/[0.02] border-primary/5">
									<TableCell className="py-4">
										<div>
											<p className="font-bold text-sm">{blog.title}</p>
											<p className="text-xs text-muted-foreground line-clamp-1">
												{blog.excerpt}
											</p>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="rounded-full">
											{blog.category}
										</Badge>
									</TableCell>
									<TableCell>
										<span className="text-sm">
											{typeof blog.author === "object"
												? blog.author.name
												: "Admin"}
										</span>
									</TableCell>
									<TableCell className="text-sm">
										{format(new Date(blog.publishedAt), "MMM dd, yyyy")}
									</TableCell>
									<TableCell className="text-center">
										{blog.views || 0}
									</TableCell>
									<TableCell className="text-center">
										{blog.likes || 0}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="h-9 w-9">
													<MoreVertical className="w-4 h-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-48">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<Link href={`/blog/${blog.slug}`} target="_blank">
													<DropdownMenuItem>
														<Eye className="w-4 h-4 mr-2" />
														View
													</DropdownMenuItem>
												</Link>
												<Link href={`/admin/blogs/${blog._id}/edit`}>
													<DropdownMenuItem>
														<Edit className="w-4 h-4 mr-2" />
														Edit
													</DropdownMenuItem>
												</Link>
												<DropdownMenuItem
													onClick={() => handleDeleteClick(blog)}
													className="text-red-600">
													<Trash className="w-4 h-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
							{filteredBlogs.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={7}
										className="text-center py-12 text-muted-foreground">
										No blog posts found. Create your first post!
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{blogToDelete?.title}"? This
							action cannot be undone.
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
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
