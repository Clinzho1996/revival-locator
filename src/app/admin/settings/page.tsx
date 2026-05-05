// app/admin/settings/page.tsx
"use client";

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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRevival } from "@/hooks/useRevival";
import {
	Bell,
	Eye,
	EyeOff,
	Globe,
	Loader2,
	Save,
	Shield,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
	const { user, updateProfile, changePassword, isLoading } = useRevival();

	const [profileForm, setProfileForm] = useState({
		name: "",
		email: "",
	});

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [isSavingProfile, setIsSavingProfile] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [settings, setSettings] = useState({
		siteName: "Revival Locator",
		siteDescription: "Find your next divine encounter",
		emailNotifications: true,
		allowUserEvents: true,
		requireApproval: true,
	});

	useEffect(() => {
		if (user) {
			setProfileForm({
				name: user.name || "",
				email: user.email || "",
			});
		}
	}, [user]);

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!profileForm.name.trim()) {
			toast.error("Name is required");
			return;
		}

		setIsSavingProfile(true);
		try {
			await updateProfile({ name: profileForm.name });
			toast.success("Profile updated successfully");
		} catch (error: any) {
			toast.error("Failed to update profile", {
				description: error.message,
			});
		} finally {
			setIsSavingProfile(false);
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!passwordForm.currentPassword) {
			toast.error("Current password is required");
			return;
		}
		if (passwordForm.newPassword.length < 6) {
			toast.error("New password must be at least 6 characters");
			return;
		}
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setIsChangingPassword(true);
		try {
			await changePassword(
				passwordForm.currentPassword,
				passwordForm.newPassword,
			);
			toast.success("Password changed successfully");
			setPasswordForm({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error: any) {
			toast.error("Failed to change password", {
				description: error.message,
			});
		} finally {
			setIsChangingPassword(false);
		}
	};

	const handleSaveSettings = () => {
		toast.success("Settings saved successfully");
		// In a real app, you would save these to your backend
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight text-primary">
					Settings
				</h1>
				<p className="text-muted-foreground">
					Manage your account and platform preferences
				</p>
			</div>

			<Tabs defaultValue="profile" className="space-y-6">
				<TabsList className="bg-primary/5 p-1 rounded-2xl">
					<TabsTrigger value="profile" className="rounded-xl px-6">
						<User className="w-4 h-4 mr-2" />
						Profile
					</TabsTrigger>
					<TabsTrigger value="security" className="rounded-xl px-6">
						<Shield className="w-4 h-4 mr-2" />
						Security
					</TabsTrigger>
					<TabsTrigger value="general" className="rounded-xl px-6">
						<Globe className="w-4 h-4 mr-2" />
						General
					</TabsTrigger>
					<TabsTrigger value="notifications" className="rounded-xl px-6">
						<Bell className="w-4 h-4 mr-2" />
						Notifications
					</TabsTrigger>
				</TabsList>

				{/* Profile Settings */}
				<TabsContent value="profile">
					<Card className="border-primary/5 shadow-md">
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
							<CardDescription>
								Update your personal information
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={handleUpdateProfile}
								className="space-y-6 max-w-md">
								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input
										id="name"
										value={profileForm.name}
										onChange={(e) =>
											setProfileForm({ ...profileForm, name: e.target.value })
										}
										className="rounded-xl"
										disabled={isSavingProfile}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input
										id="email"
										value={profileForm.email}
										disabled
										className="rounded-xl bg-muted"
									/>
									<p className="text-xs text-muted-foreground">
										Email cannot be changed
									</p>
								</div>
								<Button type="submit" disabled={isSavingProfile}>
									{isSavingProfile ? (
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
							</form>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Security Settings */}
				<TabsContent value="security">
					<Card className="border-primary/5 shadow-md">
						<CardHeader>
							<CardTitle>Change Password</CardTitle>
							<CardDescription>
								Update your password to keep your account secure
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={handleChangePassword}
								className="space-y-6 max-w-md">
								<div className="space-y-2">
									<Label htmlFor="currentPassword">Current Password</Label>
									<div className="relative">
										<Input
											id="currentPassword"
											type={showCurrentPassword ? "text" : "password"}
											value={passwordForm.currentPassword}
											onChange={(e) =>
												setPasswordForm({
													...passwordForm,
													currentPassword: e.target.value,
												})
											}
											className="rounded-xl pr-10"
											disabled={isChangingPassword}
										/>
										<button
											type="button"
											onClick={() =>
												setShowCurrentPassword(!showCurrentPassword)
											}
											className="absolute right-3 top-1/2 -translate-y-1/2">
											{showCurrentPassword ? (
												<EyeOff className="w-4 h-4" />
											) : (
												<Eye className="w-4 h-4" />
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
											value={passwordForm.newPassword}
											onChange={(e) =>
												setPasswordForm({
													...passwordForm,
													newPassword: e.target.value,
												})
											}
											className="rounded-xl pr-10"
											disabled={isChangingPassword}
										/>
										<button
											type="button"
											onClick={() => setShowNewPassword(!showNewPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2">
											{showNewPassword ? (
												<EyeOff className="w-4 h-4" />
											) : (
												<Eye className="w-4 h-4" />
											)}
										</button>
									</div>
									<p className="text-xs text-muted-foreground">
										Minimum 6 characters
									</p>
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm New Password</Label>
									<Input
										id="confirmPassword"
										type="password"
										value={passwordForm.confirmPassword}
										onChange={(e) =>
											setPasswordForm({
												...passwordForm,
												confirmPassword: e.target.value,
											})
										}
										className="rounded-xl"
										disabled={isChangingPassword}
									/>
									{passwordForm.confirmPassword &&
										passwordForm.newPassword !==
											passwordForm.confirmPassword && (
											<p className="text-xs text-red-500">
												Passwords do not match
											</p>
										)}
								</div>
								<Button type="submit" disabled={isChangingPassword}>
									{isChangingPassword ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Changing Password...
										</>
									) : (
										"Change Password"
									)}
								</Button>
							</form>
						</CardContent>
					</Card>
				</TabsContent>

				{/* General Settings */}
				<TabsContent value="general">
					<Card className="border-primary/5 shadow-md">
						<CardHeader>
							<CardTitle>General Settings</CardTitle>
							<CardDescription>
								Configure platform-wide settings
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2 max-w-md">
								<Label htmlFor="siteName">Site Name</Label>
								<Input
									id="siteName"
									value={settings.siteName}
									onChange={(e) =>
										setSettings({ ...settings, siteName: e.target.value })
									}
									className="rounded-xl"
								/>
							</div>
							<div className="space-y-2 max-w-md">
								<Label htmlFor="siteDescription">Site Description</Label>
								<Input
									id="siteDescription"
									value={settings.siteDescription}
									onChange={(e) =>
										setSettings({
											...settings,
											siteDescription: e.target.value,
										})
									}
									className="rounded-xl"
								/>
							</div>
							<div className="flex items-center justify-between max-w-md">
								<div>
									<Label>Allow User Events</Label>
									<p className="text-xs text-muted-foreground">
										Allow regular users to create events
									</p>
								</div>
								<Switch
									checked={settings.allowUserEvents}
									onCheckedChange={(checked) =>
										setSettings({ ...settings, allowUserEvents: checked })
									}
								/>
							</div>
							<div className="flex items-center justify-between max-w-md">
								<div>
									<Label>Require Approval</Label>
									<p className="text-xs text-muted-foreground">
										Require admin approval for new events
									</p>
								</div>
								<Switch
									checked={settings.requireApproval}
									onCheckedChange={(checked) =>
										setSettings({ ...settings, requireApproval: checked })
									}
								/>
							</div>
							<Button onClick={handleSaveSettings}>
								<Save className="w-4 h-4 mr-2" />
								Save Settings
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Notification Settings */}
				<TabsContent value="notifications">
					<Card className="border-primary/5 shadow-md">
						<CardHeader>
							<CardTitle>Notification Preferences</CardTitle>
							<CardDescription>
								Configure how you receive notifications
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between max-w-md">
								<div>
									<Label>Email Notifications</Label>
									<p className="text-xs text-muted-foreground">
										Receive updates via email
									</p>
								</div>
								<Switch
									checked={settings.emailNotifications}
									onCheckedChange={(checked) =>
										setSettings({ ...settings, emailNotifications: checked })
									}
								/>
							</div>
							<div className="mt-6">
								<Button onClick={handleSaveSettings}>
									<Save className="w-4 h-4 mr-2" />
									Save Preferences
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
