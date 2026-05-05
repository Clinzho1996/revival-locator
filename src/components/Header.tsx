"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRevival } from "@/hooks/useRevival";
import {
	Bookmark,
	Calendar,
	ChevronDown,
	LogOut,
	Menu,
	Settings,
	User,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const { user, isAuthenticated, login, register, logout } = useRevival();

	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const mobileMenuRef = useRef<HTMLDivElement>(null);

	const navLinks = [
		{ href: "/", label: "Find Events" },
		{ href: "/organizers", label: "Organizers" },
		{ href: "/resources", label: "Resources" },
		{ href: "/testimonies", label: "Testimonies" },
		{ href: "/bookmarks", label: "Bookmarks" },
	];

	// Prevent hydration issues by ensuring component only renders on client
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target as Node)
			) {
				setIsMobileMenuOpen(false);
			}
		};
		if (isMobileMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isMobileMenuOpen]);

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

				// Check if the logged-in user is admin and redirect
				if (response?.user?.role === "admin") {
					router.push("/admin");
				}
			} else {
				if (!name.trim()) {
					toast.error("Name is required", {
						description: "Please enter your full name",
					});
					setIsSubmitting(false);
					return;
				}
				if (password.length < 6) {
					toast.error("Password too short", {
						description: "Password must be at least 6 characters",
					});
					setIsSubmitting(false);
					return;
				}
				const response = (await register(name, email, password)) as any;
				toast.success("Account created! 🎉", {
					description: `Welcome ${name}! You're now part of the Revival community.`,
				});
				setIsLoginModalOpen(false);
				resetForm();

				// Check if the registered user is admin (unlikely for new registrations, but just in case)
				if (response?.user?.role === "admin") {
					router.push("/admin");
				}
			}
		} catch (error: any) {
			toast.error(isLogin ? "Login failed" : "Registration failed", {
				description:
					error.message || "Please check your credentials and try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setEmail("");
		setPassword("");
		setName("");
		// Don't reset isLogin here - keep it as is
	};

	const switchMode = () => {
		setIsLogin(!isLogin);
		// Clear form when switching modes
		setEmail("");
		setPassword("");
		setName("");
	};

	const handleLogout = async () => {
		logout();
		toast.success("Logged out", {
			description: "You have been successfully logged out.",
		});
		router.push("/");
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	// Don't render on server to prevent hydration mismatch
	if (!mounted) {
		return (
			<header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md py-2 transition-all duration-300">
				<div className="container mx-auto flex h-15 items-center justify-between px-4">
					<div className="flex items-center space-x-2">
						<Image src="/images/logo.png" alt="Logo" width={100} height={100} />
					</div>
					<div className="w-10 h-10" />
				</div>
			</header>
		);
	}

	return (
		<>
			<header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md py-2 transition-all duration-300">
				<div className="container mx-auto flex h-15 items-center justify-between px-4">
					<Link href="/" className="flex items-center space-x-2">
						<Image src="/images/logo.png" alt="Logo" width={100} height={100} />
					</Link>

					{/* Desktop Navigation - Hide admin links for non-admins */}
					<nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
						{navLinks.map((link) => {
							// Hide bookmarks from nav if not authenticated
							if (link.href === "/bookmarks" && !isAuthenticated) {
								return null;
							}
							const isActive = pathname === link.href;
							return (
								<Link
									key={link.href}
									href={link.href}
									className={`relative py-1 transition-colors hover:text-primary ${
										isActive
											? "text-primary font-semibold"
											: "text-muted-foreground"
									}`}>
									{link.label}
									{isActive && (
										<span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
									)}
								</Link>
							);
						})}
						{/* Admin link - only show for admins */}
						{isAuthenticated && user?.role === "admin" && (
							<Link
								href="/admin"
								className={`relative py-1 transition-colors hover:text-primary ${
									pathname === "/admin"
										? "text-primary font-semibold"
										: "text-muted-foreground"
								}`}>
								Admin
								{pathname === "/admin" && (
									<span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
								)}
							</Link>
						)}
					</nav>

					{/* User Menu / Auth Button */}
					<div className="flex items-center space-x-4">
						{/* Mobile Menu Button */}
						<Button
							size="icon"
							variant="ghost"
							className="md:hidden"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
							{isMobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>

						{/* Desktop User Section */}
						{isAuthenticated && user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="cursor-pointer">
										<Button
											variant="ghost"
											className="flex items-center gap-2 h-10 px-2 hover:bg-primary/10">
											<Avatar className="h-8 w-8">
												<AvatarFallback className="bg-primary/20 text-primary">
													{getInitials(user.name)}
												</AvatarFallback>
											</Avatar>
											<span className="hidden lg:inline text-sm font-medium">
												{user.name.split(" ")[0]}
											</span>
											<ChevronDown className="h-4 w-4 text-muted-foreground" />
										</Button>
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel>
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium">{user.name}</p>
											<p className="text-xs text-muted-foreground">
												{user.email}
											</p>
											{user.role === "admin" && (
												<span className="text-xs bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded-full inline-block w-fit mt-1">
													Admin
												</span>
											)}
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => router.push("/profile")}>
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => router.push("/bookmarks")}>
										<Bookmark className="mr-2 h-4 w-4" />
										<span>Bookmarks</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => router.push("/my-events")}>
										<Calendar className="mr-2 h-4 w-4" />
										<span>My Events</span>
									</DropdownMenuItem>
									{user.role === "admin" && (
										<>
											<DropdownMenuItem onClick={() => router.push("/admin")}>
												<Settings className="mr-2 h-4 w-4" />
												<span>Admin Dashboard</span>
											</DropdownMenuItem>
										</>
									)}
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={handleLogout}
										className="text-red-600">
										<LogOut className="mr-2 h-4 w-4" />
										<span>Logout</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button
								onClick={() => {
									setIsLoginModalOpen(true);
									setIsLogin(true); // Reset to login mode when opening modal
									setEmail("");
									setPassword("");
									setName("");
								}}
								className="bg-primary hover:bg-primary/90 text-white">
								<User className="h-4 w-4 mr-2" />
								Sign In
							</Button>
						)}
					</div>
				</div>

				{/* Mobile Navigation Menu */}
				{isMobileMenuOpen && (
					<div
						ref={mobileMenuRef}
						className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-white/5 md:hidden animate-in slide-in-from-top-2 duration-200">
						<nav className="flex flex-col p-4 space-y-3">
							{navLinks.map((link) => {
								// Hide bookmarks from mobile nav if not authenticated
								if (link.href === "/bookmarks" && !isAuthenticated) {
									return null;
								}
								const isActive = pathname === link.href;
								return (
									<Link
										key={link.href}
										href={link.href}
										onClick={() => setIsMobileMenuOpen(false)}
										className={`px-4 py-2 rounded-lg transition-colors ${
											isActive
												? "bg-primary/10 text-primary font-semibold"
												: "text-muted-foreground hover:bg-primary/5 hover:text-primary"
										}`}>
										{link.label}
									</Link>
								);
							})}
							{/* Admin link in mobile menu */}
							{isAuthenticated && user?.role === "admin" && (
								<Link
									href="/admin"
									onClick={() => setIsMobileMenuOpen(false)}
									className={`px-4 py-2 rounded-lg transition-colors ${
										pathname === "/admin"
											? "bg-primary/10 text-primary font-semibold"
											: "text-muted-foreground hover:bg-primary/5 hover:text-primary"
									}`}>
									Admin Dashboard
								</Link>
							)}
							{isAuthenticated && user && (
								<>
									<div className="border-t border-white/10 my-2" />
									<button
										onClick={() => {
											setIsMobileMenuOpen(false);
											handleLogout();
										}}
										className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-left">
										Logout
									</button>
								</>
							)}
							{!isAuthenticated && (
								<button
									onClick={() => {
										setIsMobileMenuOpen(false);
										setIsLoginModalOpen(true);
										setIsLogin(true);
										setEmail("");
										setPassword("");
										setName("");
									}}
									className="px-4 py-2 rounded-lg bg-primary text-white font-semibold">
									Sign In
								</button>
							)}
						</nav>
					</div>
				)}
			</header>

			{/* Auth Modal */}
			<Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
				<DialogContent className="sm:max-w-[425px] rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-center">
							{isLogin ? "Welcome Back" : "Create an Account"}
						</DialogTitle>
						<DialogDescription className="text-center">
							{isLogin
								? "Sign in to access your bookmarks and personalized events"
								: "Join the Revival community to discover and save events"}
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
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
