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
import axios from "axios";
import {
	Bookmark,
	Calendar,
	ChevronDown,
	Key,
	Loader2,
	Lock,
	LogOut,
	Mail,
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

	// Forgot password states
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [resetStep, setResetStep] = useState<"email" | "otp" | "reset">(
		"email",
	);
	const [resetEmail, setResetEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isResetLoading, setIsResetLoading] = useState(false);

	const navLinks = [
		{ href: "/events", label: "Find Events" },
		{ href: "/organizers", label: "Organizers" },
		{ href: "/resources", label: "Resources" },
		{ href: "/blog", label: "Blog" },
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

	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!resetEmail) {
			toast.error("Email is required");
			return;
		}

		setIsResetLoading(true);
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL || "https://api.revival-locator.ng"}/api/auth/forgot-password`,
				{ email: resetEmail },
			);
			toast.success("OTP sent to your email!");
			setResetStep("otp");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to send OTP");
		} finally {
			setIsResetLoading(false);
		}
	};

	const handleVerifyOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!otp || otp.length !== 6) {
			toast.error("Please enter a valid 6-digit OTP");
			return;
		}

		setIsResetLoading(true);
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL || "https://api.revival-locator.ng"}/api/auth/verify-otp`,
				{ email: resetEmail, otp },
			);
			toast.success("OTP verified!");
			setResetStep("reset");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Invalid OTP");
		} finally {
			setIsResetLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setIsResetLoading(true);
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL || "https://api.revival-locator.ng"}/api/auth/reset-password`,
				{ email: resetEmail, otp, newPassword },
			);
			toast.success(
				"Password reset successfully! Please login with your new password.",
			);
			// Reset forgot password state and go back to login
			setShowForgotPassword(false);
			setResetStep("email");
			setResetEmail("");
			setOtp("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to reset password");
		} finally {
			setIsResetLoading(false);
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

	const closeForgotPassword = () => {
		setShowForgotPassword(false);
		setResetStep("email");
		setResetEmail("");
		setOtp("");
		setNewPassword("");
		setConfirmPassword("");
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

					<nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
						{navLinks.map((link) => {
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

					<div className="flex items-center space-x-4">
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
									setIsLogin(true);
									setShowForgotPassword(false);
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

				{isMobileMenuOpen && (
					<div
						ref={mobileMenuRef}
						className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-white/5 md:hidden animate-in slide-in-from-top-2 duration-200">
						<nav className="flex flex-col p-4 space-y-3">
							{navLinks.map((link) => {
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
										setShowForgotPassword(false);
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

			{/* Auth Modal with Forgot Password Integration */}
			<Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
				<DialogContent className="sm:max-w-[425px] rounded-2xl">
					{!showForgotPassword ? (
						// Login/Signup Form
						<>
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

								{isLogin && (
									<div className="flex flex-row justify-end">
										<button
											type="button"
											onClick={() => {
												setShowForgotPassword(true);
												setResetStep("email");
												setResetEmail("");
												setOtp("");
												setNewPassword("");
												setConfirmPassword("");
											}}
											className="text-sm text-primary hover:underline">
											Forgot Password?
										</button>
									</div>
								)}

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
						</>
					) : (
						// Forgot Password Flow
						<>
							<DialogHeader>
								<DialogTitle className="text-2xl font-bold text-center">
									{resetStep === "email" && "Forgot Password"}
									{resetStep === "otp" && "Enter OTP"}
									{resetStep === "reset" && "Reset Password"}
								</DialogTitle>
								<DialogDescription className="text-center">
									{resetStep === "email" &&
										"Enter your email to receive a password reset OTP"}
									{resetStep === "otp" &&
										"Enter the 6-digit code sent to your email"}
									{resetStep === "reset" && "Create your new password"}
								</DialogDescription>
							</DialogHeader>

							{resetStep === "email" && (
								<form onSubmit={handleSendOTP} className="space-y-4 mt-4">
									<div className="space-y-2">
										<Label htmlFor="resetEmail">Email Address</Label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
											<Input
												id="resetEmail"
												type="email"
												placeholder="you@example.com"
												value={resetEmail}
												onChange={(e) => setResetEmail(e.target.value)}
												className="pl-10 rounded-xl"
												required
											/>
										</div>
									</div>
									<Button
										type="submit"
										className="w-full rounded-xl"
										disabled={isResetLoading}>
										{isResetLoading ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											"Send OTP"
										)}
									</Button>
								</form>
							)}

							{resetStep === "otp" && (
								<form onSubmit={handleVerifyOTP} className="space-y-4 mt-4">
									<div className="space-y-2">
										<Label htmlFor="otp">6-Digit OTP</Label>
										<div className="relative">
											<Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
											<Input
												id="otp"
												type="text"
												maxLength={6}
												placeholder="000000"
												value={otp}
												onChange={(e) =>
													setOtp(e.target.value.replace(/\D/g, ""))
												}
												className="pl-10 text-center text-2xl tracking-widest rounded-xl"
												required
											/>
										</div>
										<p className="text-xs text-muted-foreground text-center mt-2">
											Didn't receive the code?{" "}
											<button
												type="button"
												onClick={handleSendOTP}
												className="text-primary hover:underline">
												Resend OTP
											</button>
										</p>
									</div>
									<Button
										type="submit"
										className="w-full rounded-xl"
										disabled={isResetLoading}>
										{isResetLoading ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											"Verify OTP"
										)}
									</Button>
								</form>
							)}

							{resetStep === "reset" && (
								<form onSubmit={handleResetPassword} className="space-y-4 mt-4">
									<div className="space-y-2">
										<Label htmlFor="newPassword">New Password</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
											<Input
												id="newPassword"
												type="password"
												placeholder="••••••••"
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												className="pl-10 rounded-xl"
												required
											/>
										</div>
										<p className="text-xs text-muted-foreground">
											Minimum 6 characters
										</p>
									</div>
									<div className="space-y-2">
										<Label htmlFor="confirmPassword">Confirm Password</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
											<Input
												id="confirmPassword"
												type="password"
												placeholder="••••••••"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												className="pl-10 rounded-xl"
												required
											/>
										</div>
									</div>
									<Button
										type="submit"
										className="w-full rounded-xl"
										disabled={isResetLoading}>
										{isResetLoading ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											"Reset Password"
										)}
									</Button>
								</form>
							)}

							<div className="mt-4 text-center text-sm">
								<button
									type="button"
									onClick={closeForgotPassword}
									className="text-primary hover:underline">
									Back to Login
								</button>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
