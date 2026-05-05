// app/profile/page.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRevival } from "@/hooks/useRevival";
import { format } from "date-fns";
import {
	Bookmark,
	Calendar,
	Calendar as CalendarIcon,
	Church,
	Edit2,
	Eye,
	EyeOff,
	Loader2,
	Mail,
	Save,
	Shield,
	User,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
	const router = useRouter();
	const {
		user,
		isAuthenticated,
		getProfile,
		updateProfile,
		getDashboard,
		dashboardData,
		isLoading,
		changePassword, // Add this
	} = useRevival();

	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [isSubmittingPassword, setIsSubmittingPassword] = useState(false); // Add this

	const [formData, setFormData] = useState({
		name: "",
		email: "",
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	useEffect(() => {
		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to view your profile",
				action: {
					label: "Login",
					onClick: () => router.push("/login"),
				},
			});
			router.push("/");
			return;
		}

		getProfile();
		getDashboard();
	}, [isAuthenticated, router, getProfile, getDashboard]);

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "",
				email: user.email || "",
			});
		}
	}, [user]);

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			toast.error("Name is required");
			return;
		}

		setIsSaving(true);
		try {
			await updateProfile({ name: formData.name });
			toast.success("Profile updated successfully!");
			setIsEditing(false);
			await getProfile(); // Refresh user data
		} catch (error: any) {
			toast.error("Failed to update profile", {
				description: error.message || "Please try again later",
			});
		} finally {
			setIsSaving(false);
		}
	};

	// Password strength checker
	const getPasswordStrength = (password: string) => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
		if (password.match(/\d/)) strength++;
		if (password.match(/[^a-zA-Z\d]/)) strength++;

		if (strength === 0) return { text: "Very Weak", color: "text-red-500" };
		if (strength === 1) return { text: "Weak", color: "text-orange-500" };
		if (strength === 2) return { text: "Fair", color: "text-yellow-500" };
		if (strength === 3) return { text: "Good", color: "text-blue-500" };
		return { text: "Strong", color: "text-green-500" };
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate current password
		if (!passwordData.currentPassword) {
			toast.error("Current password is required", {
				description: "Please enter your current password to continue.",
			});
			return;
		}

		// Validate new password length
		if (passwordData.newPassword.length < 6) {
			toast.error("Password too short", {
				description: "New password must be at least 6 characters long.",
			});
			return;
		}

		// Check if new passwords match
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error("Passwords do not match", {
				description: "Your new password and confirmation password must match.",
			});
			return;
		}

		// Check if new password is different from current
		if (passwordData.newPassword === passwordData.currentPassword) {
			toast.error("Same password", {
				description:
					"Please choose a different password than your current one.",
			});
			return;
		}

		setIsSubmittingPassword(true);

		try {
			// Call the changePassword API from your store
			await changePassword(
				passwordData.currentPassword,
				passwordData.newPassword,
			);

			// Show success message
			toast.success("Password changed successfully! 🔒", {
				description:
					"Your password has been updated. Please use your new password next time you log in.",
				duration: 5000,
			});

			// Reset form and close
			setShowPasswordForm(false);
			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error: any) {
			// Handle specific error cases
			const errorMessage = error.message || "Failed to change password";

			if (errorMessage.toLowerCase().includes("current password")) {
				toast.error("Incorrect current password", {
					description:
						"The current password you entered is incorrect. Please try again.",
				});
			} else if (errorMessage.toLowerCase().includes("same")) {
				toast.error("Password already in use", {
					description:
						"Please choose a different password than your current one.",
				});
			} else {
				toast.error("Failed to change password", {
					description:
						errorMessage ||
						"Please try again later. If the problem persists, contact support.",
				});
			}
		} finally {
			setIsSubmittingPassword(false);
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const getMemberSince = () => {
		if (user?.createdAt) {
			return format(new Date(user.createdAt), "MMMM d, yyyy");
		}
		return "Recently";
	};

	if (!isAuthenticated) {
		return null; // Will redirect in useEffect
	}

	if (isLoading && !user) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading profile...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
			<div className="container max-w-6xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-primary/10 rounded-2xl">
							<User className="w-8 h-8 text-primary" />
						</div>
						<div>
							<h1 className="text-4xl md:text-5xl font-bold">My Profile</h1>
							<p className="text-muted-foreground mt-2">
								Manage your account information and preferences
							</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Sidebar */}
					<div className="lg:col-span-1 space-y-6">
						{/* Profile Card */}
						<Card className="border-primary/10 shadow-lg rounded-2xl overflow-hidden">
							<div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
							<CardContent className="pt-0 text-center">
								<div className="relative -mt-12 mb-4">
									<Avatar className="w-24 h-24 mx-auto border-4 border-background shadow-xl">
										<AvatarImage src={user?.avatar} />
										<AvatarFallback className="bg-primary/20 text-primary text-2xl">
											{user && getInitials(user.name)}
										</AvatarFallback>
									</Avatar>
								</div>
								<h2 className="text-xl font-bold">{user?.name}</h2>
								<p className="text-sm text-muted-foreground">{user?.email}</p>
								<div className="mt-3 flex justify-center">
									{user?.role === "admin" ? (
										<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/20 text-purple-500 text-xs font-semibold">
											<Shield className="w-3 h-3" />
											Administrator
										</span>
									) : (
										<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
											<User className="w-3 h-3" />
											Member
										</span>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Stats Cards */}
						<Card className="border-primary/10 shadow-lg rounded-2xl">
							<CardHeader>
								<CardTitle className="text-lg">Statistics</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-primary/10 rounded-xl">
											<CalendarIcon className="w-4 h-4 text-primary" />
										</div>
										<span className="text-sm">Member Since</span>
									</div>
									<span className="text-sm font-semibold">
										{getMemberSince()}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-primary/10 rounded-xl">
											<Bookmark className="w-4 h-4 text-primary" />
										</div>
										<span className="text-sm">Bookmarked Events</span>
									</div>
									<span className="text-sm font-semibold">
										{dashboardData?.stats?.totalBookmarks || 0}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-primary/10 rounded-xl">
											<CalendarIcon className="w-4 h-4 text-primary" />
										</div>
										<span className="text-sm">My Events</span>
									</div>
									<span className="text-sm font-semibold">
										{dashboardData?.stats?.totalEvents || 0}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-primary/10 rounded-xl">
											<Users className="w-4 h-4 text-primary" />
										</div>
										<span className="text-sm">Total Attendees</span>
									</div>
									<span className="text-sm font-semibold">
										{dashboardData?.myEvents?.reduce(
											(sum, e) => sum + (e.attendees || 0),
											0,
										) || 0}
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<Card className="border-primary/10 shadow-lg rounded-2xl">
							<CardHeader>
								<CardTitle className="text-lg">Quick Actions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button
									variant="outline"
									className="w-full justify-start rounded-xl"
									onClick={() => router.push("/my-events")}>
									<CalendarIcon className="w-4 h-4 mr-2" />
									My Events
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start rounded-xl"
									onClick={() => router.push("/bookmarks")}>
									<Bookmark className="w-4 h-4 mr-2" />
									View Bookmarks
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start rounded-xl"
									onClick={() => router.push("/events/create")}>
									<Church className="w-4 h-4 mr-2" />
									Create New Event
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Profile Information */}
						<Card className="border-primary/10 shadow-lg rounded-2xl">
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle>Profile Information</CardTitle>
									<CardDescription>
										Update your personal information
									</CardDescription>
								</div>
								{!isEditing && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsEditing(true)}>
										<Edit2 className="w-4 h-4 mr-2" />
										Edit
									</Button>
								)}
							</CardHeader>
							<CardContent>
								{isEditing ? (
									<form onSubmit={handleUpdateProfile} className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="name">Full Name</Label>
											<Input
												id="name"
												value={formData.name}
												onChange={(e) =>
													setFormData({ ...formData, name: e.target.value })
												}
												className="rounded-xl"
												disabled={isSaving}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="email">Email Address</Label>
											<Input
												id="email"
												value={formData.email}
												disabled
												className="rounded-xl bg-muted"
											/>
											<p className="text-xs text-muted-foreground">
												Email cannot be changed. Contact support for assistance.
											</p>
										</div>
										<div className="flex gap-3">
											<Button type="submit" disabled={isSaving}>
												{isSaving ? (
													<>
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
														Saving...
													</>
												) : (
													<>
														<Save className="w-4 h-4 mr-2" />
														Save Changes
													</>
												)}
											</Button>
											<Button
												type="button"
												variant="outline"
												onClick={() => {
													setIsEditing(false);
													setFormData({
														name: user?.name || "",
														email: user?.email || "",
													});
												}}
												disabled={isSaving}>
												Cancel
											</Button>
										</div>
									</form>
								) : (
									<div className="space-y-4">
										<div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
											<User className="w-5 h-5 text-primary" />
											<div>
												<p className="text-sm text-muted-foreground">
													Full Name
												</p>
												<p className="font-semibold">{user?.name}</p>
											</div>
										</div>
										<div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
											<Mail className="w-5 h-5 text-primary" />
											<div>
												<p className="text-sm text-muted-foreground">
													Email Address
												</p>
												<p className="font-semibold">{user?.email}</p>
											</div>
										</div>
										<div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
											<Calendar className="w-5 h-5 text-primary" />
											<div>
												<p className="text-sm text-muted-foreground">
													Member Since
												</p>
												<p className="font-semibold">{getMemberSince()}</p>
											</div>
										</div>
										<div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
											<Shield className="w-5 h-5 text-primary" />
											<div>
												<p className="text-sm text-muted-foreground">
													Account Type
												</p>
												<p className="font-semibold capitalize">
													{user?.role || "User"}
												</p>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Change Password */}
						<Card className="border-primary/10 shadow-lg rounded-2xl">
							<CardHeader>
								<CardTitle>Security</CardTitle>
								<CardDescription>
									Manage your password and security settings
								</CardDescription>
							</CardHeader>
							<CardContent>
								{!showPasswordForm ? (
									<Button
										variant="outline"
										onClick={() => setShowPasswordForm(true)}>
										Change Password
									</Button>
								) : (
									<form onSubmit={handleChangePassword} className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="currentPassword">Current Password</Label>
											<div className="relative">
												<Input
													id="currentPassword"
													type={showCurrentPassword ? "text" : "password"}
													value={passwordData.currentPassword}
													onChange={(e) =>
														setPasswordData({
															...passwordData,
															currentPassword: e.target.value,
														})
													}
													className="rounded-xl pr-10"
													required
													disabled={isSubmittingPassword}
												/>
												<button
													type="button"
													onClick={() =>
														setShowCurrentPassword(!showCurrentPassword)
													}
													className="absolute right-3 top-1/2 -translate-y-1/2">
													{showCurrentPassword ? (
														<EyeOff className="w-4 h-4 text-muted-foreground" />
													) : (
														<Eye className="w-4 h-4 text-muted-foreground" />
													)}
												</button>
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="newPassword">New Password</Label>
											<div className="relative">
												<Input
													id="newPassword"
													type={showNewPassword ? "text" : "password"}
													value={passwordData.newPassword}
													onChange={(e) =>
														setPasswordData({
															...passwordData,
															newPassword: e.target.value,
														})
													}
													className="rounded-xl pr-10"
													required
													disabled={isSubmittingPassword}
												/>
												<button
													type="button"
													onClick={() => setShowNewPassword(!showNewPassword)}
													className="absolute right-3 top-1/2 -translate-y-1/2">
													{showNewPassword ? (
														<EyeOff className="w-4 h-4 text-muted-foreground" />
													) : (
														<Eye className="w-4 h-4 text-muted-foreground" />
													)}
												</button>
											</div>
											{passwordData.newPassword && (
												<p
													className={`text-xs mt-1 ${getPasswordStrength(passwordData.newPassword).color}`}>
													Password strength:{" "}
													{getPasswordStrength(passwordData.newPassword).text}
												</p>
											)}
											<p className="text-xs text-muted-foreground">
												Password must be at least 6 characters and should
												include a mix of letters, numbers, and symbols.
											</p>
										</div>
										<div className="space-y-2">
											<Label htmlFor="confirmPassword">
												Confirm New Password
											</Label>
											<Input
												id="confirmPassword"
												type="password"
												value={passwordData.confirmPassword}
												onChange={(e) =>
													setPasswordData({
														...passwordData,
														confirmPassword: e.target.value,
													})
												}
												className="rounded-xl"
												required
												disabled={isSubmittingPassword}
											/>
											{passwordData.confirmPassword &&
												passwordData.newPassword !==
													passwordData.confirmPassword && (
													<p className="text-xs text-red-500 mt-1">
														Passwords do not match
													</p>
												)}
										</div>
										<div className="flex gap-3">
											<Button
												type="submit"
												disabled={
													isSubmittingPassword ||
													!passwordData.newPassword ||
													passwordData.newPassword !==
														passwordData.confirmPassword
												}>
												{isSubmittingPassword ? (
													<>
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
														Updating Password...
													</>
												) : (
													"Update Password"
												)}
											</Button>
											<Button
												type="button"
												variant="outline"
												onClick={() => {
													setShowPasswordForm(false);
													setPasswordData({
														currentPassword: "",
														newPassword: "",
														confirmPassword: "",
													});
												}}
												disabled={isSubmittingPassword}>
												Cancel
											</Button>
										</div>
									</form>
								)}
							</CardContent>
						</Card>

						{/* Recent Activity */}
						{dashboardData?.myEvents && dashboardData.myEvents.length > 0 && (
							<Card className="border-primary/10 shadow-lg rounded-2xl">
								<CardHeader>
									<CardTitle>Recent Events</CardTitle>
									<CardDescription>
										Your most recent created events
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									{dashboardData.myEvents.slice(0, 3).map((event) => (
										<div
											key={event._id}
											className="flex items-center justify-between p-3 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer"
											onClick={() => router.push(`/events/${event._id}`)}>
											<div>
												<p className="font-semibold">{event.title}</p>
												<p className="text-xs text-muted-foreground">
													{format(new Date(event.date), "MMM dd, yyyy")}
												</p>
											</div>
											<div className="flex items-center gap-2">
												{event.status === "approved" ? (
													<span className="text-xs text-green-600">
														Published
													</span>
												) : event.status === "pending" ? (
													<span className="text-xs text-yellow-600">
														Pending
													</span>
												) : (
													<span className="text-xs text-red-600">Rejected</span>
												)}
												<Users className="w-4 h-4 text-muted-foreground" />
												<span className="text-sm">{event.attendees || 0}</span>
											</div>
										</div>
									))}
									{dashboardData.myEvents.length > 3 && (
										<Button
											variant="ghost"
											className="w-full"
											onClick={() => router.push("/my-events")}>
											View All Events
										</Button>
									)}
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
