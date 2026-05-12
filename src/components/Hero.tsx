"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRevival } from "@/hooks/useRevival";
import {
	Calendar,
	Church,
	Loader2,
	MapPin,
	Search,
	Sparkles,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Hero() {
	const router = useRouter();
	const { searchEvents, isLoading, getAnalytics, analytics } = useRevival();
	const [keyword, setKeyword] = useState("");
	const [city, setCity] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [stats, setStats] = useState({
		totalEvents: 0,
		totalUsers: 0,
		totalReviews: 0,
	});

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		try {
			await getAnalytics();
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		}
	};

	// Update stats when analytics data is available
	useEffect(() => {
		if (analytics?.overview) {
			setStats({
				totalEvents: analytics.overview.totalEvents || 0,
				totalUsers: analytics.overview.totalUsers || 0,
				totalReviews: analytics.overview.totalReviews || 0,
			});
		}
	}, [analytics]);

	const trendingTags = [
		"Revival",
		"Worship",
		"Youth Conference",
		"Healing Service",
		"Prayer",
		"Concert",
	];

	const handleSearch = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();

		if (!keyword.trim() && !city.trim()) {
			toast.error("Please enter a search term", {
				description:
					"Enter an event name, keyword, or location to find events.",
			});
			return;
		}

		setIsSearching(true);
		try {
			// Build search params
			const searchParams = new URLSearchParams();
			if (keyword.trim()) searchParams.append("keyword", keyword.trim());
			if (city.trim()) searchParams.append("city", city.trim());

			// Call API search
			await searchEvents(keyword.trim(), city.trim() || undefined);

			// Navigate to events page with search params
			router.push(`/events?${searchParams.toString()}`);

			toast.success("Searching for events", {
				description: `Finding ${keyword || "events"} ${city ? `in ${city}` : "near you"}...`,
			});
		} catch (error: any) {
			toast.error("Search failed", {
				description: error.message || "Please try again later.",
			});
		} finally {
			setIsSearching(false);
		}
	};

	const handleTrendingClick = (tag: string) => {
		setKeyword(tag);
		setCity("");
		// Auto-search when clicking trending tag
		setTimeout(() => {
			handleSearch();
		}, 100);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	// Format numbers with K, M suffixes
	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + "M";
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + "k";
		}
		return num.toString();
	};

	return (
		<div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-20 font-sans">
			{/* Background Layer with Soft Overlay */}
			<div
				className="absolute inset-0 z-0"
				style={{
					backgroundImage:
						'linear-gradient(to bottom, rgba(2, 6, 23, 0.85), rgba(185, 28, 28, 0.2)), url("https://plus.unsplash.com/premium_photo-1661377118520-287ec60a32f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29yc2hpcHxlbnwwfHwwfHx8MA%3D%3D")',
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundAttachment: "fixed",
				}}
			/>

			{/* Modern Ambient Glows */}
			<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse opacity-50" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[150px] animate-pulse delay-1000 opacity-40" />

			<div className="container relative z-10 mx-auto max-w-6xl">
				<div className="flex flex-col items-center text-center space-y-12 md:space-y-16">
					{/* Headline Section */}
					<div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
						<div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 group hover:bg-white/10 transition-colors cursor-default">
							<Sparkles className="w-4 h-4 text-orange-400 group-hover:rotate-12 transition-transform" />
							<span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
								Connect with the Spirit
							</span>
						</div>

						<h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] drop-shadow-2xl text-white">
							Find Your Next <br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-yellow-500">
								Divine
							</span>{" "}
							Encounter
						</h1>

						<p className="text-lg md:text-2xl font-light text-white/70 max-w-2xl mx-auto leading-relaxed">
							Discover powerful revivals, life-changing conferences, and
							intimate worship nights happening in your city.
						</p>
					</div>

					{/* Intuitive Dual-Field Search Container */}
					<div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
						<div className="group relative">
							<div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

							<form
								onSubmit={handleSearch}
								className="relative flex flex-col md:flex-row items-stretch p-2 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl transition-all duration-300 group-hover:border-white/20">
								<div className="relative flex-grow flex items-center px-6 py-4 md:py-0 border-b md:border-b-0 md:border-r border-white/10 group/input">
									<Search className="text-white/40 w-5 h-5 mr-3 group-hover/input:text-primary transition-colors shrink-0" />
									<Input
										type="text"
										value={keyword}
										onChange={(e) => setKeyword(e.target.value)}
										onKeyDown={handleKeyPress}
										placeholder="Event, church, or keyword..."
										disabled={isSearching}
										className="h-12 bg-transparent border-0 text-white placeholder:text-white/30 text-lg px-0 w-full focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:ring-0"
									/>
								</div>

								<div className="relative flex-grow flex items-center px-6 py-4 md:py-0 group/input">
									<MapPin className="text-white/40 w-5 h-5 mr-3 group-hover/input:text-orange-400 transition-colors shrink-0" />
									<Input
										type="text"
										value={city}
										onChange={(e) => setCity(e.target.value)}
										onKeyPress={handleKeyPress}
										placeholder="City or zip code..."
										className="h-12 bg-transparent border-0 text-white placeholder:text-white/30 text-lg px-0 w-full focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:ring-0"
										disabled={isSearching}
									/>
								</div>

								<Button
									type="submit"
									disabled={isSearching}
									className="h-14 md:h-16 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 shrink-0 disabled:opacity-70 disabled:cursor-not-allowed">
									{isSearching ? (
										<>
											<Loader2 className="w-5 h-5 mr-2 animate-spin" />
											Searching...
										</>
									) : (
										"Explore Now"
									)}
								</Button>
							</form>
						</div>

						{/* Location detection button */}
						<div className="flex justify-center mt-3">
							<button
								onClick={() => {
									if ("geolocation" in navigator) {
										navigator.geolocation.getCurrentPosition(
											async (position) => {
												toast.info("Location detected", {
													description: `Searching near lat: ${position.coords.latitude.toFixed(2)}, lon: ${position.coords.longitude.toFixed(2)}`,
												});
											},
											(error) => {
												toast.error("Location access denied", {
													description:
														"Please enable location services or enter a city manually.",
												});
											},
										);
									} else {
										toast.error("Geolocation not supported", {
											description:
												"Your browser doesn't support location services.",
										});
									}
								}}
								className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
								<MapPin className="w-3 h-3" />
								Use my current location
							</button>
						</div>

						<div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm text-white/50">
							<span className="font-medium mr-2">Trending:</span>
							{trendingTags.map((tag) => (
								<button
									key={tag}
									onClick={() => handleTrendingClick(tag)}
									className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all text-xs font-medium">
									{tag}
								</button>
							))}
						</div>
					</div>

					{/* Social Proof & Stats Section - Now with real data */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pt-12 border-t border-white/5 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500 pb-10">
						<div className="flex flex-col items-center group">
							<div className="p-3 rounded-2xl bg-white/5 mb-4 group-hover:bg-primary/10 transition-colors">
								<Church className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
							</div>
							<p className="text-3xl font-black bg-gradient-to-b from-white to-white/60 text-transparent bg-clip-text">
								{formatNumber(stats.totalEvents)}+
							</p>
							<p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-2 text-center">
								Active Events
							</p>
						</div>
						<div className="flex flex-col items-center group">
							<div className="p-3 rounded-2xl bg-white/5 mb-4 group-hover:bg-primary/10 transition-colors">
								<Users className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
							</div>
							<p className="text-3xl font-black bg-gradient-to-b from-white to-white/60 text-transparent bg-clip-text">
								{formatNumber(stats.totalUsers)}+
							</p>
							<p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-2 text-center">
								Worshippers
							</p>
						</div>
						<div className="flex flex-col items-center group">
							<div className="p-3 rounded-2xl bg-white/5 mb-4 group-hover:bg-primary/10 transition-colors">
								<Calendar className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
							</div>
							<p className="text-3xl font-black bg-gradient-to-b from-white to-white/60 text-transparent bg-clip-text">
								{formatNumber(Math.ceil(stats.totalEvents / 12))}+
							</p>
							<p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-2 text-center">
								Monthly Events
							</p>
						</div>
					</div>

					{/* Quick Filters */}
					<div className="flex flex-wrap justify-center gap-2 mt-4">
						<span className="text-xs text-white/40 mr-2">Quick filters:</span>
						{["This Weekend", "Free Events", "Online", "Near Me"].map(
							(filter) => (
								<button
									key={filter}
									onClick={() => {
										if (filter === "Free Events") {
											setKeyword("free");
											setTimeout(() => handleSearch(), 100);
										} else if (filter === "This Weekend") {
											toast.info("Coming soon", {
												description: "Date filtering will be available soon!",
											});
										} else {
											toast.info("Coming soon", {
												description: `${filter} filtering will be available soon!`,
											});
										}
									}}
									className="text-xs text-white/30 hover:text-white/60 transition-colors">
									{filter}
								</button>
							),
						)}
					</div>
				</div>
			</div>

			{/* Refined Scroll Indicator */}
			<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-30 hover:opacity-60 transition-opacity cursor-pointer z-20">
				<span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white mb-3">
					Scroll Down
				</span>
				<div className="w-[1px] h-16 bg-gradient-to-b from-white via-white/50 to-transparent relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scroll" />
				</div>
			</div>

			{/* Add keyframes for scroll animation if not present */}
			<style jsx>{`
				@keyframes scroll {
					0% {
						transform: translateY(-100%);
					}
					100% {
						transform: translateY(200%);
					}
				}
				.animate-scroll {
					animation: scroll 2s ease-in-out infinite;
				}
			`}</style>
		</div>
	);
}
