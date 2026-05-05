// app/resources/page.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRevival } from "@/hooks/useRevival";
import { format } from "date-fns";
import {
	BookOpen,
	Download,
	FileAudio,
	FileImage,
	FileText,
	Link as LinkIcon,
	Loader2,
	Mic,
	Music,
	Search,
	Video,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Define the Resource type matching your store
interface Resource {
	_id: string;
	title: string;
	description?: string;
	type: string;
	fileUrl?: string;
	uploadedBy: string | { name: string; email: string; _id: string };
	createdAt: string;
}

const resourceTypeIcons: Record<string, any> = {
	pdf: FileText,
	video: Video,
	link: LinkIcon,
	audio: FileAudio,
	image: FileImage,
	document: BookOpen,
	podcast: Mic,
	worship: Music,
	default: BookOpen,
};

const resourceTypeLabels: Record<string, string> = {
	pdf: "PDF Document",
	video: "Video",
	link: "External Link",
	audio: "Audio",
	image: "Image",
	document: "Document",
	podcast: "Podcast",
	worship: "Worship Music",
	default: "Resource",
};

const resourceTypeColors: Record<string, string> = {
	pdf: "bg-red-500/10 text-red-600",
	video: "bg-blue-500/10 text-blue-600",
	link: "bg-green-500/10 text-green-600",
	audio: "bg-purple-500/10 text-purple-600",
	image: "bg-pink-500/10 text-pink-600",
	document: "bg-orange-500/10 text-orange-600",
	podcast: "bg-indigo-500/10 text-indigo-600",
	worship: "bg-emerald-500/10 text-emerald-600",
	default: "bg-gray-500/10 text-gray-600",
};

export default function ResourcesPage() {
	const { getResources, resources, isLoading } = useRevival();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedType, setSelectedType] = useState("all");
	const [filteredResources, setFilteredResources] = useState<any[]>([]);
	const [email, setEmail] = useState("");
	const [isSubscribing, setIsSubscribing] = useState(false);

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

	// Filter resources based on search and type
	useEffect(() => {
		let filtered = [...resources];

		if (searchTerm) {
			filtered = filtered.filter(
				(resource: any) =>
					resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					resource.description
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()),
			);
		}

		if (selectedType !== "all") {
			filtered = filtered.filter(
				(resource: any) => resource.type === selectedType,
			);
		}

		setFilteredResources(filtered);
	}, [resources, searchTerm, selectedType]);

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			toast.error("Email is required");
			return;
		}

		setIsSubscribing(true);
		try {
			// Add your subscribe API call here
			toast.success("Subscribed successfully!");
			setEmail("");
		} catch (error) {
			toast.error("Failed to subscribe");
		} finally {
			setIsSubscribing(false);
		}
	};

	const getResourceIcon = (type: string) => {
		const Icon = resourceTypeIcons[type] || resourceTypeIcons.default;
		return Icon;
	};

	const getResourceTypeColor = (type: string) => {
		return resourceTypeColors[type] || resourceTypeColors.default;
	};

	const getUploaderName = (
		uploadedBy: string | { name: string; email: string; _id: string },
	) => {
		if (typeof uploadedBy === "object" && uploadedBy !== null) {
			return uploadedBy.name;
		}
		return "Admin";
	};

	// Get unique resource types for filter buttons
	const resourceTypes = ["all", ...new Set(resources.map((r: any) => r.type))];

	if (isLoading && resources.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading resources...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-20">
				{/* Hero Section */}
				<div className="max-w-3xl space-y-6">
					<h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">
						Spiritual{" "}
						<span className="text-primary underline decoration-primary/20 underline-offset-8">
							Resources
						</span>{" "}
						Hub.
					</h1>
					<p className="text-xl text-slate-500 font-medium leading-relaxed">
						Equipping you for every step of your spiritual journey. Browse our
						curated collection of worship music, teaching, and practical
						ministry tools.
					</p>
				</div>

				{/* Search Bar */}
				<div className="relative max-w-md mt-8">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search resources..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 rounded-xl"
					/>
				</div>

				{/* Filter Tabs */}
				{resourceTypes.length > 1 && (
					<div className="mt-8 overflow-x-auto">
						<div className="flex gap-2 pb-2">
							{resourceTypes.map((type: string) => (
								<button
									key={type}
									onClick={() => setSelectedType(type)}
									className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
										selectedType === type
											? "bg-primary text-white shadow-md shadow-primary/20"
											: "bg-slate-100 text-slate-600 hover:bg-slate-200"
									}`}>
									{type === "all"
										? "All Resources"
										: resourceTypeLabels[type] || type}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Stats Bar */}
				<div className="mt-6 flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {filteredResources.length} of {resources.length} resources
					</p>
					{(searchTerm || selectedType !== "all") && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setSearchTerm("");
								setSelectedType("all");
							}}
							className="text-sm">
							<X className="w-4 h-4 mr-1" />
							Clear filters
						</Button>
					)}
				</div>

				{/* Resources Grid */}
				{filteredResources.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
						{filteredResources.map((resource: any) => {
							const Icon = getResourceIcon(resource.type);
							const typeColor = getResourceTypeColor(resource.type);

							return (
								<a
									key={resource._id}
									href={resource.fileUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="group block">
									<Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/5">
										<CardHeader>
											<div className="flex items-start justify-between">
												<div className={`p-3 rounded-xl ${typeColor}`}>
													<Icon className="w-6 h-6" />
												</div>
												<Badge
													className={`${typeColor} border-none capitalize`}>
													{resource.type}
												</Badge>
											</div>
											<CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
												{resource.title}
											</CardTitle>
											{resource.description && (
												<CardDescription className="line-clamp-2">
													{resource.description}
												</CardDescription>
											)}
										</CardHeader>
										<CardContent>
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<span>By {getUploaderName(resource.uploadedBy)}</span>
												<span>•</span>
												<span>
													{format(new Date(resource.createdAt), "MMM dd, yyyy")}
												</span>
											</div>
										</CardContent>
										<CardFooter>
											<Button
												variant="ghost"
												className="group/btn w-full justify-between">
												<span>View Resource</span>
												<Download className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
											</Button>
										</CardFooter>
									</Card>
								</a>
							);
						})}
					</div>
				) : (
					!isLoading && (
						<div className="text-center py-20">
							<div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Search className="w-10 h-10 text-slate-400" />
							</div>
							<h3 className="text-xl font-semibold mb-2">No resources found</h3>
							<p className="text-muted-foreground">
								{searchTerm
									? `No results for "${searchTerm}". Try a different search term.`
									: "No resources available in this category yet."}
							</p>
						</div>
					)
				)}

				{/* Newsletter Section */}
				<div className="mt-20 bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
					<div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
					<div className="relative z-10 space-y-4">
						<h2 className="text-3xl font-bold tracking-tight">
							Weekly Revival Newsletter
						</h2>
						<p className="text-white/60 font-medium">
							Get the latest event news and spiritual resources delivered to
							your inbox.
						</p>
					</div>
					<form
						onSubmit={handleSubscribe}
						className="relative z-10 flex w-full md:w-auto gap-4">
						<input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="bg-white/10 border border-white/20 rounded-xl px-6 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
							disabled={isSubscribing}
						/>
						<Button
							type="submit"
							size="lg"
							className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold whitespace-nowrap"
							disabled={isSubscribing}>
							{isSubscribing ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Subscribing...
								</>
							) : (
								"Subscribe"
							)}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
