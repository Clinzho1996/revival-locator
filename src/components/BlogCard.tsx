// components/BlogCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, Eye, Heart, User } from "lucide-react";
import Link from "next/link";

interface BlogCardProps {
	blog: any;
}

export function BlogCard({ blog }: BlogCardProps) {
	const categoryColors: Record<string, string> = {
		Revival: "bg-red-500/10 text-red-600",
		Worship: "bg-purple-500/10 text-purple-600",
		Prayer: "bg-blue-500/10 text-blue-600",
		Testimony: "bg-green-500/10 text-green-600",
		Teaching: "bg-orange-500/10 text-orange-600",
		"Event Recap": "bg-cyan-500/10 text-cyan-600",
	};

	return (
		<Link href={`/blog/${blog.slug}`} className="group block">
			<article className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
				{/* Featured Image */}
				<div className="relative h-56 overflow-hidden">
					<img
						src={
							blog.featuredImage ||
							"https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600"
						}
						alt={blog.title}
						className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
					/>
					<div className="absolute top-4 left-4">
						<Badge
							className={
								categoryColors[blog.category] || "bg-primary/10 text-primary"
							}>
							{blog.category}
						</Badge>
					</div>
				</div>

				{/* Content */}
				<div className="p-6 flex flex-col flex-grow">
					<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
						<div className="flex items-center gap-1">
							<User className="w-3 h-3" />
							<span className="text-xs">
								{typeof blog.author === "object" ? blog.author.name : "Admin"}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<Calendar className="w-3 h-3" />
							<span className="text-xs">
								{format(new Date(blog.publishedAt), "MMM dd, yyyy")}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<Clock className="w-3 h-3" />
							<span className="text-xs">{blog.readTime} min read</span>
						</div>
					</div>

					<h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors mb-2">
						{blog.title}
					</h3>

					<p className="text-slate-500 text-sm line-clamp-3 mb-4">
						{blog.excerpt}
					</p>

					<div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Heart className="w-4 h-4" />
								<span>{blog.likes || 0}</span>
							</div>
							<div className="flex items-center gap-1">
								<Eye className="w-4 h-4" />
								<span>{blog.views || 0}</span>
							</div>
						</div>
						<span className="text-primary font-semibold text-sm group-hover:underline">
							Read More →
						</span>
					</div>
				</div>
			</article>
		</Link>
	);
}
