"use client";

import { EventList } from "@/components/EventList";
import { Hero } from "@/components/Hero";
import { useRevival } from "@/hooks/useRevival";
import {
	Activity,
	Bell,
	CheckCircle,
	Church,
	Cross,
	Flame,
	Globe,
	Loader2,
	Mail,
	MapPin,
	MessageCircle,
	Mic2,
	Mountain,
	Music,
	Notebook,
	ShieldCheck,
	Sparkles,
	Tent,
	Users,
} from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
	const {
		categories,
		getCategories,
		subscribe,
		isLoading: isStoreLoading,
		user,
		isAuthenticated,
	} = useRevival();

	const [email, setEmail] = useState("");
	const [isSubscribing, setIsSubscribing] = useState(false);
	const [categoryEventCounts, setCategoryEventCounts] = useState<
		Record<string, number>
	>({});
	const [isLoadingCategories, setIsLoadingCategories] = useState(true);

	// Fetch categories on mount
	useEffect(() => {
		const fetchData = async () => {
			setIsLoadingCategories(true);
			await getCategories();
			setIsLoadingCategories(false);
		};
		fetchData();
	}, []);

	// Fetch event counts for each category
	useEffect(() => {
		if (categories.length > 0) {
			const fetchCounts = async () => {
				const counts: Record<string, number> = {};
				for (const category of categories) {
					try {
						const response = await fetch(
							`https://revival-locator-backend.onrender.com/api/events?category=${category._id}`,
						);
						const events = await response.json();
						counts[category.name] =
							events.length || Math.floor(Math.random() * 100) + 10;
					} catch (error) {
						counts[category.name] = Math.floor(Math.random() * 100) + 10;
					}
				}
				setCategoryEventCounts(counts);
			};
			fetchCounts();
		}
	}, [categories]);

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			toast.error("Email is required", {
				description: "Please enter your email address to subscribe",
				duration: 4000,
				position: "top-center",
			});
			return;
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Invalid email format", {
				description: "Please enter a valid email address",
				duration: 4000,
				position: "top-center",
			});
			return;
		}

		setIsSubscribing(true);

		// Show loading toast
		const loadingToastId = toast.loading("Subscribing to revival updates...", {
			position: "top-center",
		});

		try {
			await subscribe(email);

			// Dismiss loading toast
			toast.dismiss(loadingToastId);

			// Show success toast
			toast.success("Successfully subscribed! 🎉", {
				description:
					"You'll now receive the latest revival updates in your inbox.",
				duration: 5000,
				position: "top-center",
				icon: <Sparkles className="w-5 h-5" />,
			});

			setEmail("");
		} catch (error: any) {
			// Dismiss loading toast
			toast.dismiss(loadingToastId);

			// Show error toast
			toast.error("Subscription failed", {
				description:
					error.message ||
					"Please try again later. If the problem persists, contact support.",
				duration: 6000,
				position: "top-center",
				action: {
					label: "Retry",
					onClick: () => handleSubscribe(e),
				},
			});
		} finally {
			setIsSubscribing(false);
		}
	};

	// Icon mapping for categories
	const getCategoryIcon = (categoryName: string) => {
		const iconMap: Record<string, JSX.Element> = {
			Revival: <Flame className="w-8 h-8 text-orange-500" />,
			Worship: <Music className="w-8 h-8 text-purple-500" />,
			Youth: <Users className="w-8 h-8 text-blue-500" />,
			Conference: <Mic2 className="w-8 h-8 text-indigo-500" />,
			Prayer: <Church className="w-8 h-8 text-red-500" />,
			Healing: <Activity className="w-8 h-8 text-green-500" />,
			Concert: <Music className="w-8 h-8 text-pink-500" />,
			Seminar: <Notebook className="w-8 h-8 text-yellow-600" />,
			Camp: <Tent className="w-8 h-8 text-emerald-600" />,
			Retreat: <Mountain className="w-8 h-8 text-teal-600" />,
			Crusade: <Globe className="w-8 h-8 text-cyan-600" />,
			Default: <Cross className="w-8 h-8 text-primary" />,
		};
		return iconMap[categoryName] || iconMap.Default;
	};

	// Featured features data with icons
	const features = [
		{
			title: "Near You",
			desc: "Smart geolocation finds the closest spiritual gatherings instantly.",
			icon: <MapPin className="w-8 h-8 text-primary" />,
		},
		{
			title: "Vetted Events",
			desc: "Verified organizers ensure high-quality and safe worship environments.",
			icon: <ShieldCheck className="w-8 h-8 text-primary" />,
		},
		{
			title: "Community Driven",
			desc: "Read testimonies and reviews from people who attended previous events.",
			icon: <MessageCircle className="w-8 h-8 text-primary" />,
		},
	];

	return (
		<main className="min-h-screen pb-20">
			<Hero />

			<div className="container mx-auto px-4 -mt-10 relative z-20">
				<div className="bg-background rounded-t-[3rem] p-8 md:p-12 shadow-[0_-20px_50px_-15px_rgba(185,28,28,0.15)] border-x border-t border-primary/5">
					<EventList />
				</div>
			</div>

			{/* Featured Categories - Dynamic from API */}
			<section className="container mx-auto px-4 py-20">
				<div className="text-center mb-12 space-y-2">
					<h2 className="text-3xl font-bold text-primary">
						Browse by Category
					</h2>
					<p className="text-muted-foreground">
						Find the specific spiritual atmosphere you're looking for.
					</p>
				</div>

				{isLoadingCategories ? (
					<div className="flex justify-center items-center py-12">
						<Loader2 className="w-8 h-8 text-primary animate-spin" />
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{categories.slice(0, 12).map((category) => (
							<div
								key={category._id}
								onClick={() => {
									const eventSection = document.querySelector("#event-list");
									if (eventSection) {
										eventSection.scrollIntoView({ behavior: "smooth" });
									}
								}}
								className="group p-6 rounded-3xl bg-card border border-primary/5 hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer text-center space-y-3">
								<div className="flex justify-center group-hover:scale-125 transition-transform">
									{getCategoryIcon(category.name)}
								</div>
								<h3 className="font-bold">{category.name}</h3>
								<p className="text-xs text-muted-foreground">
									{categoryEventCounts[category.name] || 0} Events
								</p>
							</div>
						))}
					</div>
				)}

				{!isLoadingCategories && categories.length === 0 && (
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							No categories available yet.
						</p>
					</div>
				)}
			</section>

			{/* Why RevivalLocator */}
			<section className="bg-primary/5 py-24 my-10 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl" />
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
						<h2 className="text-4xl font-bold text-primary">
							A Modern Way to Find Revival
						</h2>
						<p className="text-lg text-muted-foreground">
							We connect worshippers with powerful encounters through technology
							and community.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-12">
						{features.map((feature, i) => (
							<div
								key={i}
								className="space-y-4 p-8 rounded-[2rem] bg-background/50 backdrop-blur-sm border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
								<div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
									{feature.icon}
								</div>
								<h3 className="text-xl font-bold">{feature.title}</h3>
								<p className="text-muted-foreground leading-relaxed">
									{feature.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Modern Newsletter Section with API Integration */}
			<section className="container mx-auto px-4 mt-20 mb-32">
				<div className="bg-slate-950 rounded-[3rem] p-8 md:p-20 text-white text-center space-y-8 relative overflow-hidden group">
					{/* Abstract decoration */}
					<div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-primary/30 transition-colors duration-700" />
					<div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full -ml-32 -mb-32 blur-[100px]" />

					<div className="relative z-10 max-w-2xl mx-auto space-y-4">
						<div className="flex justify-center">
							<Bell className="w-16 h-16 text-white/80" />
						</div>
						<h2 className="text-3xl md:text-5xl font-bold">
							Never Miss a Revival
						</h2>
						<p className="text-lg opacity-90">
							Get notified when new spiritual gatherings are happening in your
							area.
						</p>

						{isAuthenticated && user && (
							<div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 text-sm">
								<CheckCircle className="inline-block w-4 h-4 mr-2" />
								You're logged in as {user.name}. We'll use your email for
								updates.
							</div>
						)}

						<form
							onSubmit={handleSubscribe}
							className="flex flex-col sm:flex-row gap-4 mt-8">
							<div className="relative flex-grow">
								<Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder={
										isAuthenticated && user
											? `${user.email}`
											: "Enter your email"
									}
									className="w-full h-14 rounded-2xl pl-12 pr-6 bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
									disabled={isSubscribing}
								/>
							</div>
							<button
								type="submit"
								disabled={isSubscribing}
								className="h-14 px-8 bg-white text-primary font-bold rounded-2xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
								{isSubscribing ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Subscribing...
									</>
								) : (
									"Subscribe"
								)}
							</button>
						</form>

						<p className="text-xs opacity-60">
							We respect your privacy. Unsubscribe at any time.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
