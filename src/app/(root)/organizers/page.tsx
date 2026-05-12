"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRevival } from "@/hooks/useRevival";
import {
	ArrowRight,
	BarChart3,
	Bell,
	Calendar,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Church,
	Clock,
	Eye,
	Heart,
	Loader2,
	Shield,
	Sparkles,
	Star,
	TrendingUp,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OrganizersPage() {
	const router = useRouter();
	const {
		isAuthenticated,
		user,
		login,
		register,
		isLoading,
		getAnalytics,
		analytics,
		getTestimonies,
		testimonies,
	} = useRevival();

	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch analytics and testimonies on mount
	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			await getAnalytics();
			await getTestimonies();
		} catch (error) {
			console.error("Failed to fetch data:", error);
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

	// Get real stats from analytics
	const getRealStats = () => {
		const totalEvents = analytics?.overview?.totalEvents || 0;
		const totalUsers = analytics?.overview?.totalUsers || 0;

		return {
			eventsHosted: formatNumber(totalEvents) + "+",
			worshippersReached: formatNumber(totalUsers) + "+",
			satisfactionRate: "98%", // Default since we don't have this in analytics
			citiesCovered: "50+", // Default since we don't have this in analytics
		};
	};

	const stats = [
		{
			value: getRealStats().eventsHosted,
			label: "Events Hosted",
			icon: Calendar,
		},
		{
			value: getRealStats().worshippersReached,
			label: "Worshippers Reached",
			icon: Users,
		},
		{
			value: getRealStats().satisfactionRate,
			label: "Satisfaction Rate",
			icon: Heart,
		},
		{
			value: getRealStats().citiesCovered,
			label: "Cities Covered",
			icon: TrendingUp,
		},
	];

	const steps = [
		{
			number: "01",
			title: "Sign Up / Login",
			description:
				"Create your free organizer account or log in to your existing dashboard.",
			icon: Users,
			color: "bg-blue-500/10 text-blue-600",
		},
		{
			number: "02",
			title: "Access Dashboard",
			description:
				"Get instant access to your organizer dashboard with analytics and tools.",
			icon: BarChart3,
			color: "bg-purple-500/10 text-purple-600",
		},
		{
			number: "03",
			title: "Create Your Event",
			description:
				"Fill in event details - title, date, location, description, and images.",
			icon: Calendar,
			color: "bg-primary/10 text-primary",
		},
		{
			number: "04",
			title: "Submit for Review",
			description:
				"Our team reviews your event within 24-48 hours to ensure quality.",
			icon: Clock,
			color: "bg-yellow-500/10 text-yellow-600",
		},
		{
			number: "05",
			title: "Go Live!",
			description:
				"Once approved, your event is visible to thousands of believers.",
			icon: Eye,
			color: "bg-green-500/10 text-green-600",
		},
	];

	const benefits = [
		{
			title: "Free to List",
			description:
				"No upfront costs. List your events completely free and reach thousands.",
			icon: CheckCircle,
		},
		{
			title: "Real-time Analytics",
			description:
				"Track views, interest, and registrations in your dashboard.",
			icon: BarChart3,
		},
		{
			title: "Instant Notifications",
			description: "Get notified when someone shows interest in your event.",
			icon: Bell,
		},
		{
			title: "Community Building",
			description: "Connect with attendees and build your ministry community.",
			icon: Users,
		},
		{
			title: "Featured Opportunities",
			description:
				"Get featured on our homepage and newsletter for maximum exposure.",
			icon: Sparkles,
		},
		{
			title: "24/7 Support",
			description: "Dedicated support team to help you every step of the way.",
			icon: Shield,
		},
	];

	// Filter approved testimonies only
	const approvedTestimonies = testimonies.filter(
		(t: any) => t.status === "approved",
	);

	// Auto-scroll carousel every 5 seconds
	useEffect(() => {
		if (!isAutoPlaying || approvedTestimonies.length === 0) return;

		const interval = setInterval(() => {
			setCurrentTestimonialIndex((prev) =>
				prev === approvedTestimonies.length - 1 ? 0 : prev + 1,
			);
		}, 5000); // Change every 5 seconds

		return () => clearInterval(interval);
	}, [isAutoPlaying, approvedTestimonies.length]);

	// Carousel navigation
	const nextTestimonial = () => {
		setCurrentTestimonialIndex((prev) =>
			prev === approvedTestimonies.length - 1 ? 0 : prev + 1,
		);
	};

	const prevTestimonial = () => {
		setCurrentTestimonialIndex((prev) =>
			prev === 0 ? approvedTestimonies.length - 1 : prev - 1,
		);
	};

	const handleHostEvent = () => {
		if (isAuthenticated) {
			router.push("/my-events");
		} else {
			setIsLoginModalOpen(true);
		}
	};

	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (isLogin) {
				const response = (await login(email, password)) as any;
				toast.success("Welcome back! 🎉", {
					description: `You've successfully logged in as ${email}`,
				});
				setIsLoginModalOpen(false);
				resetForm();

				if (response?.user?.role === "admin") {
					router.push("/admin");
				} else {
					router.push("/my-events");
				}
			} else {
				if (!name.trim()) {
					toast.error("Name is required");
					setIsSubmitting(false);
					return;
				}
				if (password.length < 6) {
					toast.error("Password must be at least 6 characters");
					setIsSubmitting(false);
					return;
				}
				await register(name, email, password);
				toast.success("Account created! 🎉", {
					description: `Welcome ${name}! You can now create events.`,
				});
				setIsLoginModalOpen(false);
				resetForm();
				router.push("/my-events");
			}
		} catch (error: any) {
			toast.error(isLogin ? "Login failed" : "Registration failed", {
				description: error.message || "Please try again",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setEmail("");
		setPassword("");
		setName("");
	};

	const switchMode = () => {
		setIsLogin(!isLogin);
		setEmail("");
		setPassword("");
		setName("");
	};

	// Get current testimonial
	const currentTestimonial = approvedTestimonies[currentTestimonialIndex];

	return (
		<>
			<div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
				{/* Hero Section */}
				<div className="relative overflow-hidden">
					<div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
					<div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />

					<div className="container mx-auto px-4 py-20 relative">
						<div className="max-w-4xl mx-auto text-center space-y-8">
							<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-bold uppercase tracking-widest">
								<Church className="w-4 h-4" />
								For Event Hosts
							</div>
							<h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
								Empower Your <span className="text-primary">Ministry</span>
								<br />
								Through Community.
							</h1>
							<p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
								RevivalLocator helps you connect with thousands of believers
								looking for their next divine encounter. List your events,
								manage interest, and grow your spiritual movement.
							</p>
							<div className="flex flex-wrap justify-center gap-4 pt-4">
								<Button
									onClick={handleHostEvent}
									size="lg"
									className="rounded-2xl h-16 px-10 bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105">
									{isAuthenticated ? "Create Event" : "Host an Event"}
									<ArrowRight className="w-5 h-5 ml-2" />
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="rounded-2xl h-16 px-10 border-slate-200 text-slate-900 font-black text-lg hover:bg-slate-50 transition-all"
									onClick={() => {
										const stepsSection = document.getElementById("steps");
										stepsSection?.scrollIntoView({ behavior: "smooth" });
									}}>
									How It Works
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Stats Section - Updated with real data */}
				<div className="container mx-auto px-4 py-16">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{stats.map((stat, i) => {
							const Icon = stat.icon;
							return (
								<div key={i} className="text-center space-y-2">
									<div className="flex justify-center mb-4">
										<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
											<Icon className="w-6 h-6 text-primary" />
										</div>
									</div>
									<p className="text-3xl md:text-4xl font-black text-primary">
										{stat.value}
									</p>
									<p className="text-sm text-muted-foreground font-medium">
										{stat.label}
									</p>
								</div>
							);
						})}
					</div>
				</div>

				{/* How It Works Section */}
				<div id="steps" className="container mx-auto px-4 py-20">
					<div className="text-center mb-12 space-y-4">
						<h2 className="text-3xl md:text-4xl font-black tracking-tight">
							How <span className="text-primary">It Works</span>
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Get your event live in 5 simple steps and start reaching believers
							today
						</p>
					</div>

					<div className="relative">
						<div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-primary/20 z-0" />

						<div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
							{steps.map((step, i) => {
								const Icon = step.icon;
								return (
									<div
										key={i}
										className="text-center space-y-4 bg-background rounded-2xl p-4">
										<div
											className={`w-20 h-20 mx-auto rounded-2xl ${step.color} flex items-center justify-center`}>
											<Icon className="w-8 h-8" />
										</div>
										<div className="text-2xl font-black text-primary/30">
											{step.number}
										</div>
										<h3 className="font-bold text-lg">{step.title}</h3>
										<p className="text-sm text-muted-foreground">
											{step.description}
										</p>
									</div>
								);
							})}
						</div>
					</div>

					<div className="text-center mt-12">
						<Button
							onClick={handleHostEvent}
							size="lg"
							className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold">
							{isAuthenticated ? "Start Creating Event" : "Get Started Now"}
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</div>
				</div>

				{/* Benefits Grid */}
				<div className="bg-primary/5 py-20">
					<div className="container mx-auto px-4">
						<div className="text-center mb-12 space-y-4">
							<h2 className="text-3xl md:text-4xl font-black tracking-tight">
								Why Choose <span className="text-primary">RevivalLocator</span>
							</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								Everything you need to successfully host and manage your
								spiritual events
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{benefits.map((benefit, i) => {
								const Icon = benefit.icon;
								return (
									<div
										key={i}
										className="bg-white rounded-2xl p-8 border border-primary/5 shadow-sm hover:shadow-xl transition-all group">
										<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
											<Icon className="w-6 h-6 text-primary group-hover:text-white" />
										</div>
										<h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
										<p className="text-muted-foreground">
											{benefit.description}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Testimonial Carousel Section - Dynamic from API */}
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-4xl mx-auto">
						{approvedTestimonies.length > 0 ? (
							<div className="relative">
								{/* Carousel Controls */}
								<button
									onClick={prevTestimonial}
									className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 lg:-translate-x-16 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors z-10">
									<ChevronLeft className="w-6 h-6 text-primary" />
								</button>
								<button
									onClick={nextTestimonial}
									className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 lg:translate-x-16 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors z-10">
									<ChevronRight className="w-6 h-6 text-primary" />
								</button>

								{/* Carousel Content */}
								<div
									className="text-center transition-all duration-500"
									onMouseEnter={() => setIsAutoPlaying(false)}
									onMouseLeave={() => setIsAutoPlaying(true)}>
									<div className="mb-8">
										{Array.from({ length: currentTestimonial.rating || 5 }).map(
											(_, i) => (
												<Star
													key={i}
													className="w-6 h-6 text-amber-500 inline-block fill-current mx-0.5"
												/>
											),
										)}
									</div>
									<p className="text-2xl md:text-3xl font-medium italic text-slate-700 mb-8">
										"{currentTestimonial.content}"
									</p>
									<div>
										<div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
											{currentTestimonial.avatar ? (
												<img
													src={currentTestimonial.avatar}
													alt={currentTestimonial.name}
													className="w-full h-full rounded-full object-cover"
												/>
											) : (
												<Church className="w-8 h-8 text-primary" />
											)}
										</div>
										<p className="font-bold">{currentTestimonial.name}</p>
										<p className="text-sm text-muted-foreground">
											{currentTestimonial.event}
										</p>
									</div>
								</div>

								{/* Dot Indicators */}
								<div className="flex justify-center gap-2 mt-8">
									{approvedTestimonies.map((_: any, idx: number) => (
										<button
											key={idx}
											onClick={() => setCurrentTestimonialIndex(idx)}
											className={`w-2 h-2 rounded-full transition-all ${
												idx === currentTestimonialIndex
													? "w-6 bg-primary"
													: "bg-primary/30 hover:bg-primary/50"
											}`}
										/>
									))}
								</div>
							</div>
						) : (
							// Fallback testimonial if no data
							<div className="text-center">
								<div className="mb-8">
									<Star className="w-12 h-12 text-primary mx-auto fill-primary/20" />
								</div>
								<p className="text-2xl md:text-3xl font-medium italic text-slate-700 mb-8">
									"Since joining RevivalLocator, our conference attendance has
									tripled. The platform made it so easy to reach believers who
									are genuinely hungry for God."
								</p>
								<div>
									<div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
										<Church className="w-8 h-8 text-primary" />
									</div>
									<p className="font-bold">Pastor Michael Ade</p>
									<p className="text-sm text-muted-foreground">
										City Revival Conference Organizer
									</p>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Final CTA */}
				<div className="container mx-auto px-4 pb-20">
					<div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-12 text-center text-white relative overflow-hidden">
						<div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[80px]" />
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
						<div className="relative z-10 space-y-6">
							<h2 className="text-3xl md:text-5xl font-black">
								Ready to Reach More Souls?
							</h2>
							<p className="text-lg text-white/80 max-w-2xl mx-auto">
								Join hundreds of organizers who are already using RevivalLocator
								to spread revival
							</p>
							<Button
								onClick={handleHostEvent}
								size="lg"
								variant="secondary"
								className="rounded-2xl h-14 px-8 font-bold text-primary hover:bg-white">
								{isAuthenticated
									? "Create Your Event Now"
									: "Host an Event Today"}
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
							{!isAuthenticated && (
								<p className="text-sm text-white/60">
									Free to list • No credit card required • Cancel anytime
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Auth Modal */}
			<Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
				<DialogContent className="sm:max-w-[425px] rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-center">
							{isLogin ? "Welcome Back" : "Create an Account"}
						</DialogTitle>
						<DialogDescription className="text-center">
							{isLogin
								? "Sign in to start creating and managing your events"
								: "Join RevivalLocator to host your spiritual events"}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleAuth} className="space-y-4 mt-4">
						{!isLogin && (
							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									type="text"
									placeholder="John Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
									disabled={isSubmitting}
									className="rounded-xl"
									autoFocus={!isLogin}
								/>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isSubmitting}
								className="rounded-xl"
								autoFocus={isLogin}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder={
									isLogin
										? "Enter your password"
										: "Create a password (min. 6 characters)"
								}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={isSubmitting}
								className="rounded-xl"
							/>
						</div>

						<Button
							type="submit"
							className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90"
							disabled={isSubmitting}>
							{isSubmitting ? (
								<div className="flex items-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin" />
									{isLogin ? "Signing in..." : "Creating account..."}
								</div>
							) : isLogin ? (
								"Sign In"
							) : (
								"Create Account"
							)}
						</Button>
					</form>

					<div className="mt-4 text-center text-sm">
						<span className="text-muted-foreground">
							{isLogin
								? "Don't have an account? "
								: "Already have an account? "}
						</span>
						<button
							type="button"
							onClick={switchMode}
							className="text-primary hover:underline font-semibold">
							{isLogin ? "Sign Up" : "Sign In"}
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
