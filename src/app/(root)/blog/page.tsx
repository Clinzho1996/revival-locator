// app/blog/page.tsx
"use client";

import { BlogCard } from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { useRevival } from "@/hooks/useRevival";
import { BookOpen, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";

const categories = [
	"All",
	"Revival",
	"Worship",
	"Prayer",
	"Testimony",
	"Teaching",
	"Event Recap",
];

export default function BlogPage() {
	const { getBlogs, blogs, isLoading } = useRevival();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		getBlogs({
			page: currentPage,
			category: selectedCategory !== "All" ? selectedCategory : undefined,
			search: searchTerm || undefined,
		});
	}, [currentPage, selectedCategory, searchTerm]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1);
		getBlogs({
			page: 1,
			category: selectedCategory !== "All" ? selectedCategory : undefined,
			search: searchTerm || undefined,
		});
	};

	if (isLoading && blogs.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading blog posts...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
			{/* Hero Section */}
			<div className="relative bg-primary/10 py-20 overflow-hidden">
				<div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center space-y-6">
						<BookOpen className="w-16 h-16 text-primary mx-auto" />
						<h1 className="text-4xl md:text-6xl font-black tracking-tight">
							Faith & <span className="text-primary">Revival</span> Blog
						</h1>
						<p className="text-xl text-muted-foreground">
							Discover inspiring stories, spiritual insights, and practical
							guidance for your faith journey.
						</p>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				{/* Search and Filter Bar */}
				<div className="flex flex-col md:flex-row gap-4 mb-12">
					<form onSubmit={handleSearch} className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Search articles..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 rounded-xl"
						/>
					</form>
					<div className="flex gap-2 overflow-x-auto pb-2">
						{categories.map((cat) => (
							<button
								key={cat}
								onClick={() => {
									setSelectedCategory(cat);
									setCurrentPage(1);
								}}
								className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
									selectedCategory === cat
										? "bg-primary text-white shadow-lg shadow-primary/20"
										: "bg-white text-slate-600 hover:bg-slate-100"
								}`}>
								{cat}
							</button>
						))}
					</div>
				</div>

				{/* Blog Grid */}
				{blogs.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{blogs.map((blog) => (
							<BlogCard key={blog._id} blog={blog} />
						))}
					</div>
				) : (
					<div className="text-center py-20">
						<BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-2xl font-bold mb-2">No blog posts found</h3>
						<p className="text-muted-foreground">
							{searchTerm || selectedCategory !== "All"
								? "Try adjusting your search or filter criteria"
								: "Check back later for new articles"}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
