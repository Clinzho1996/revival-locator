// app/admin/blogs/new/page.tsx
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
import { useState } from "react";
import { toast } from "sonner";

const categories = [
	"Revival",
	"Worship",
	"Prayer",
	"Testimony",
	"Teaching",
	"Event Recap",
];

export default function CreateBlogPage() {
	const router = useRouter();
	const { createBlog, isLoading } = useRevival();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		excerpt: "",
		content: "",
		category: "Revival",
		featuredImage: "",
		tags: "",
		readTime: 5,
	});

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
			const tagsArray = formData.tags.split(",").map((tag) => tag.trim());
			await createBlog({
				...formData,
				tags: tagsArray,
				readTime: Number(formData.readTime),
			});
			router.push("/admin/blogs");
		} catch (error) {
			toast.error("Failed to create blog post");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="flex items-center gap-4">
				<Link href="/admin/blogs">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-5 w-5" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-primary">
						Create New Post
					</h1>
					<p className="text-muted-foreground">
						Write a new blog post for your audience
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card className="border-primary/5">
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title *</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder="Enter blog title"
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
									<SelectTrigger>
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
											readTime: parseInt(e.target.value),
										})
									}
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
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="excerpt">Excerpt *</Label>
							<Textarea
								id="excerpt"
								value={formData.excerpt}
								onChange={(e) =>
									setFormData({ ...formData, excerpt: e.target.value })
								}
								placeholder="Brief summary of the blog post"
								rows={3}
								required
							/>
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
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">Content (Markdown supported) *</Label>
							<Textarea
								id="content"
								value={formData.content}
								onChange={(e) =>
									setFormData({ ...formData, content: e.target.value })
								}
								placeholder="Write your blog content here... Markdown is supported"
								rows={15}
								required
							/>
						</div>
					</CardContent>
				</Card>

				<div className="flex gap-4">
					<Button
						type="submit"
						className="bg-primary hover:bg-primary/90"
						disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Publishing...
							</>
						) : (
							"Publish Post"
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
