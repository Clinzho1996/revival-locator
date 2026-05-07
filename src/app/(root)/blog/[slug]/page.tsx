// app/blog/[slug]/page.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRevival } from "@/hooks/useRevival";
import { format } from "date-fns";
import {
	ArrowLeft,
	Calendar,
	Clock,
	Eye,
	Heart,
	Share2,
	User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";

export default function BlogDetailsPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = use(params);
	const router = useRouter();
	const { getBlogBySlug, selectedBlog, isLoading, likeBlog, isAuthenticated } =
		useRevival();
	const [isLiking, setIsLiking] = useState(false);

	useEffect(() => {
		if (slug) {
			getBlogBySlug(slug);
		}
	}, [slug]);

	const handleLike = async () => {
		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to like this post",
				action: {
					label: "Login",
					onClick: () => router.push("/login"),
				},
			});
			return;
		}

		setIsLiking(true);
		try {
			await likeBlog(selectedBlog?._id!);
			toast.success("Thank you for liking this post!");
		} catch (error) {
			toast.error("Failed to like post");
		} finally {
			setIsLiking(false);
		}
	};

	const handleShare = async () => {
		try {
			if (navigator.share) {
				await navigator.share({
					title: selectedBlog?.title,
					text: selectedBlog?.excerpt,
					url: window.location.href,
				});
			} else {
				await navigator.clipboard.writeText(window.location.href);
				toast.success("Link copied to clipboard!");
			}
		} catch (error) {
			toast.error("Failed to share");
		}
	};

	if (isLoading || !selectedBlog) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading article...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<article className="container max-w-4xl mx-auto px-4 py-12">
				{/* Back Button */}
				<Link href="/blog">
					<Button variant="ghost" className="mb-6 gap-2">
						<ArrowLeft className="w-4 h-4" />
						Back to Blog
					</Button>
				</Link>

				{/* Featured Image */}
				{selectedBlog.featuredImage && (
					<div className="rounded-2xl overflow-hidden mb-8">
						<img
							src={selectedBlog.featuredImage}
							alt={selectedBlog.title}
							className="w-full h-[400px] object-cover"
						/>
					</div>
				)}

				{/* Header */}
				<div className="space-y-6 mb-8">
					<Badge className="bg-primary/10 text-primary w-fit">
						{selectedBlog.category}
					</Badge>

					<h1 className="text-4xl md:text-5xl font-black tracking-tight">
						{selectedBlog.title}
					</h1>

					<div className="flex flex-wrap items-center gap-6 text-muted-foreground">
						<div className="flex items-center gap-2">
							<User className="w-4 h-4" />
							<span className="font-medium">
								{typeof selectedBlog.author === "object"
									? selectedBlog.author.name
									: "Admin"}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							<span>
								{format(new Date(selectedBlog.publishedAt), "MMMM dd, yyyy")}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4" />
							<span>{selectedBlog.readTime} min read</span>
						</div>
						<div className="flex items-center gap-2">
							<Eye className="w-4 h-4" />
							<span>{selectedBlog.views} views</span>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="prose prose-lg prose-slate max-w-none mb-12">
					<Markdown>{selectedBlog.content}</Markdown>
				</div>

				{/* Tags */}
				{selectedBlog.tags && selectedBlog.tags.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-12">
						{selectedBlog.tags.map((tag: string) => (
							<Badge key={tag} variant="outline" className="rounded-full">
								#{tag}
							</Badge>
						))}
					</div>
				)}

				{/* Actions */}
				<div className="flex gap-4 pt-8 border-t border-primary/10">
					<Button
						variant="outline"
						onClick={handleLike}
						disabled={isLiking}
						className="gap-2">
						<Heart
							className={`w-4 h-4 ${selectedBlog.likes > 0 ? "fill-red-500 text-red-500" : ""}`}
						/>
						{selectedBlog.likes || 0} Likes
					</Button>
					<Button variant="outline" onClick={handleShare} className="gap-2">
						<Share2 className="w-4 h-4" />
						Share
					</Button>
				</div>
			</article>
		</div>
	);
}
