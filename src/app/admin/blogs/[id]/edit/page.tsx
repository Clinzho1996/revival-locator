// app/admin/blogs/[id]/edit/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const categories = [
	"Revival",
	"Worship",
	"Prayer",
	"Testimony",
	"Teaching",
	"Event Recap",
];

export default function EditBlogPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const router = useRouter();
	const { blogs, updateBlog, getBlogs, isLoading } = useRevival();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingBlog, setIsLoadingBlog] = useState(true);
	const [formData, setFormData] = useState({
		title: "",
		excerpt: "",
		content: "",
		category: "Revival",
		featuredImage: "",
		tags: "",
		readTime: 5,
	});

	// Fetch blog by ID from the blogs list
	useEffect(() => {
		const fetchBlog = async () => {
			setIsLoadingBlog(true);
			try {
				// Fetch all blogs if not already loaded
				if (blogs.length === 0) {
					await getBlogs({});
				}

				// Find the blog in the blogs array
				const blog = blogs.find((b: any) => b._id === id);

				if (blog) {
					setFormData({
						title: blog.title || "",
						excerpt: blog.excerpt || "",
						content: blog.content || "",
						category: blog.category || "Revival",
						featuredImage: blog.featuredImage || "",
						tags: blog.tags?.join(", ") || "",
						readTime: blog.readTime || 5,
					});
				} else {
					toast.error("Blog post not found");
					router.push("/admin/blogs");
				}
			} catch (error) {
				console.error("Error fetching blog:", error);
				toast.error("Failed to load blog post");
			} finally {
				setIsLoadingBlog(false);
			}
		};

		fetchBlog();
	}, [id, blogs, getBlogs, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.title.trim()) {
			toast.error("Title is required");
			return;
		}

		if (!formData.content.trim()) {
			toast.error("Content is required");
			return;
		}

		if (!formData.excerpt.trim()) {
			toast.error("Excerpt is required");
			return;
		}

		setIsSubmitting(true);
		try {
			const tagsArray = formData.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag !== "");

			await updateBlog(id, {
				title: formData.title,
				excerpt: formData.excerpt,
				content: formData.content,
				category: formData.category,
				featuredImage: formData.featuredImage,
				tags: tagsArray,
				readTime: Number(formData.readTime),
			});

			toast.success("Blog updated successfully!");
			router.push("/admin/blogs");
		} catch (error: any) {
			console.error("Update error:", error);
			toast.error(error.message || "Failed to update blog post");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoadingBlog || (isLoading && !formData.title)) {
		return (
			<div className="flex justify-center items-center h-96">
				<div className="text-center space-y-4">
					<Loader2 className="w-8 h-8 animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading blog post...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="flex items-center gap-4">
				<Link href="/admin/blogs">
					<Button variant="ghost" size="icon" className="rounded-full">
						<ArrowLeft className="h-5 w-5" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-primary">
						Edit Post
					</h1>
					<p className="text-muted-foreground">Update your blog post</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card className="border-primary/5 shadow-md">
					<CardHeader>
						<CardTitle className="text-xl">Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">
								Title <span className="text-red-500">*</span>
							</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder="Enter blog title"
								className="rounded-xl"
								required
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
											<SelectItem key={cat} value={cat}>
												{cat}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="readTime">Read Time (minutes)</Label>
								<Input
									id="readTime"
									type="number"
									min="1"
									value={formData.readTime}
									onChange={(e) =>
										setFormData({
											...formData,
											readTime: parseInt(e.target.value) || 5,
										})
									}
									className="rounded-xl"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="featuredImage">Featured Image URL</Label>
							<Input
								id="featuredImage"
								value={formData.featuredImage}
								onChange={(e) =>
									setFormData({ ...formData, featuredImage: e.target.value })
								}
								placeholder="https://example.com/image.jpg"
								className="rounded-xl"
							/>
							{formData.featuredImage && (
								<div className="mt-2 rounded-lg overflow-hidden border">
									<img
										src={formData.featuredImage}
										alt="Preview"
										className="w-full h-40 object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).style.display = "none";
										}}
									/>
								</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="excerpt">
								Excerpt <span className="text-red-500">*</span>
							</Label>
							<Textarea
								id="excerpt"
								value={formData.excerpt}
								onChange={(e) =>
									setFormData({ ...formData, excerpt: e.target.value })
								}
								placeholder="Brief summary of the blog post"
								rows={3}
								className="rounded-xl"
								required
							/>
							<p className="text-xs text-muted-foreground">
								{formData.excerpt.length}/500 characters
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="tags">Tags (comma separated)</Label>
							<Input
								id="tags"
								value={formData.tags}
								onChange={(e) =>
									setFormData({ ...formData, tags: e.target.value })
								}
								placeholder="revival, worship, prayer"
								className="rounded-xl"
							/>
							<p className="text-xs text-muted-foreground">
								Separate tags with commas
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">
								Content (Markdown supported){" "}
								<span className="text-red-500">*</span>
							</Label>
							<Textarea
								id="content"
								value={formData.content}
								onChange={(e) =>
									setFormData({ ...formData, content: e.target.value })
								}
								placeholder="# Heading&#10;&#10;Write your blog content here... Markdown is supported"
								rows={15}
								className="rounded-xl font-mono text-sm"
								required
							/>
							<p className="text-xs text-muted-foreground">
								Markdown formatting is supported (headings, lists, links,
								images, etc.)
							</p>
						</div>
					</CardContent>
				</Card>

				<div className="flex gap-4">
					<Button
						type="submit"
						className="bg-primary hover:bg-primary/90 rounded-xl px-8"
						disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Saving Changes...
							</>
						) : (
							"Save Changes"
						)}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => router.back()}
						className="rounded-xl">
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}
