// app/admin/users/page.tsx
"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useRevival } from "@/hooks/useRevival";
import {
	Calendar,
	Loader2,
	Mail,
	MoreVertical,
	Search,
	Shield,
	ShieldAlert,
	Trash,
	UserCheck,
	Users as UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
	_id: string;
	name: string;
	email: string;
	avatar?: string;
	role: "user" | "admin";
	bookmarks: string[];
	createdAt: string;
	updatedAt: string;
}

export default function AdminUsersPage() {
	const {
		getAllUsers,
		allUsers,
		updateUserRole,
		deleteUser,
		isLoading,
		user: currentUser,
	} = useRevival();

	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [roleFilter, setRoleFilter] = useState("all");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [roleDialogOpen, setRoleDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [newRole, setNewRole] = useState<"user" | "admin">("user");
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			await getAllUsers();
		} catch (error) {
			console.error("Failed to fetch users:", error);
			toast.error("Failed to load users");
		}
	};

	// Filter users based on search term and role
	useEffect(() => {
		let filtered = [...allUsers];

		if (searchTerm) {
			filtered = filtered.filter(
				(user) =>
					user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.email.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}

		if (roleFilter !== "all") {
			filtered = filtered.filter((user) => user.role === roleFilter);
		}

		setFilteredUsers(filtered);
	}, [allUsers, searchTerm, roleFilter]);

	const handleDeleteClick = (user: User) => {
		if (user._id === currentUser?._id) {
			toast.error("Cannot delete your own account", {
				description:
					"You cannot delete the account you are currently logged into.",
			});
			return;
		}
		setUserToDelete(user);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!userToDelete) return;

		setIsProcessing(true);
		try {
			await deleteUser(userToDelete._id);
			toast.success(`User "${userToDelete.name}" has been deleted.`);
			setDeleteDialogOpen(false);
			setUserToDelete(null);
			await fetchUsers(); // Refresh the list
		} catch (error: any) {
			toast.error("Failed to delete user", {
				description: error.message || "Please try again later.",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const handleRoleChange = (user: User) => {
		setSelectedUser(user);
		setNewRole(user.role === "admin" ? "user" : "admin");
		setRoleDialogOpen(true);
	};

	const handleRoleConfirm = async () => {
		if (!selectedUser) return;

		setIsProcessing(true);
		try {
			await updateUserRole(selectedUser._id, newRole);
			toast.success(
				`${selectedUser.name}'s role has been updated to ${newRole === "admin" ? "Administrator" : "User"}.`,
			);
			setRoleDialogOpen(false);
			setSelectedUser(null);
			await fetchUsers(); // Refresh the list
		} catch (error: any) {
			toast.error("Failed to update user role", {
				description: error.message || "Please try again later.",
			});
		} finally {
			setIsProcessing(false);
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

	const getRoleBadge = (role: string) => {
		if (role === "admin") {
			return (
				<Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30 rounded-full px-3 py-1">
					<ShieldAlert className="w-3 h-3 mr-1" />
					Administrator
				</Badge>
			);
		}
		return (
			<Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 rounded-full px-3 py-1">
				<UserCheck className="w-3 h-3 mr-1" />
				User
			</Badge>
		);
	};

	if (isLoading && allUsers.length === 0) {
		return (
			<div className="flex justify-center items-center h-96">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
					<p className="text-muted-foreground">Loading users...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-primary">
						Users
					</h1>
					<p className="text-muted-foreground">
						Manage platform users and their permissions
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Total Users</p>
							<p className="text-3xl font-bold">{allUsers.length}</p>
						</div>
						<UsersIcon className="w-8 h-8 text-primary/40" />
					</div>
				</div>
				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Administrators</p>
							<p className="text-3xl font-bold">
								{allUsers.filter((u) => u.role === "admin").length}
							</p>
						</div>
						<Shield className="w-8 h-8 text-primary/40" />
					</div>
				</div>
				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Regular Users</p>
							<p className="text-3xl font-bold">
								{allUsers.filter((u) => u.role === "user").length}
							</p>
						</div>
						<UsersIcon className="w-8 h-8 text-primary/40" />
					</div>
				</div>
				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">New This Month</p>
							<p className="text-3xl font-bold">
								{
									allUsers.filter((u) => {
										const created = new Date(u.createdAt);
										const now = new Date();
										return (
											created.getMonth() === now.getMonth() &&
											created.getFullYear() === now.getFullYear()
										);
									}).length
								}
							</p>
						</div>
						<Calendar className="w-8 h-8 text-primary/40" />
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-grow">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<Input
						placeholder="Search users by name or email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 h-11 bg-background border-primary/10 focus-visible:ring-primary/20 rounded-xl"
					/>
				</div>
				<select
					value={roleFilter}
					onChange={(e) => setRoleFilter(e.target.value)}
					className="h-11 px-4 rounded-xl border border-primary/10 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
					<option value="all">All Roles</option>
					<option value="admin">Admins</option>
					<option value="user">Regular Users</option>
				</select>
				{(searchTerm || roleFilter !== "all") && (
					<Button
						variant="outline"
						onClick={() => {
							setSearchTerm("");
							setRoleFilter("all");
						}}
						className="h-11 rounded-xl">
						Clear Filters
					</Button>
				)}
			</div>

			{/* Users Table */}
			<div className="bg-card rounded-2xl border border-primary/5 shadow-xl overflow-hidden">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="bg-primary/5">
							<TableRow className="hover:bg-transparent border-primary/10">
								<TableHead className="font-bold py-4">User</TableHead>
								<TableHead className="font-bold">Email</TableHead>
								<TableHead className="font-bold">Role</TableHead>
								<TableHead className="font-bold">Joined</TableHead>
								<TableHead className="font-bold text-center">
									Bookmarks
								</TableHead>
								<TableHead className="text-right font-bold">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.length > 0 ? (
								filteredUsers.map((user) => (
									<TableRow
										key={user._id}
										className="hover:bg-primary/[0.02] border-primary/5">
										<TableCell className="py-4">
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10">
													<AvatarImage src={user.avatar} />
													<AvatarFallback className="bg-primary/10 text-primary">
														{getInitials(user.name)}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-bold text-sm">{user.name}</p>
													<p className="text-xs text-muted-foreground">
														ID: {user._id.slice(-8)}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Mail className="w-4 h-4 text-muted-foreground" />
												<span className="text-sm">{user.email}</span>
											</div>
										</TableCell>
										<TableCell>{getRoleBadge(user.role)}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Calendar className="w-4 h-4 text-muted-foreground" />
												<span className="text-sm">
													{new Date(user.createdAt).toLocaleDateString()}
												</span>
											</div>
										</TableCell>
										<TableCell className="text-center">
											<Badge variant="secondary" className="rounded-full">
												{user.bookmarks?.length || 0}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-9 w-9">
														<MoreVertical className="w-4 h-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-48">
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleRoleChange(user)}>
														<Shield className="w-4 h-4 mr-2" />
														{user.role === "admin"
															? "Remove Admin"
															: "Make Admin"}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleDeleteClick(user)}
														className="text-red-600"
														disabled={user._id === currentUser?._id}>
														<Trash className="w-4 h-4 mr-2" />
														Delete User
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-center py-12 text-muted-foreground">
										{searchTerm || roleFilter !== "all"
											? "No users match your filters."
											: "No users found."}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete User</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete user "{userToDelete?.name}"? This
							action cannot be undone and will remove all user data including
							bookmarks and reviews.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isProcessing}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							disabled={isProcessing}
							className="bg-red-600 hover:bg-red-700">
							{isProcessing ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete User"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Change Role Dialog */}
			<Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
				<DialogContent className="sm:max-w-[425px] rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">
							{selectedUser?.role === "admin"
								? "Remove Admin Rights"
								: "Make Administrator"}
						</DialogTitle>
						<DialogDescription>
							{selectedUser?.role === "admin"
								? `Remove admin privileges from ${selectedUser?.name}. They will become a regular user.`
								: `Grant admin privileges to ${selectedUser?.name}. This will give them full access to the admin panel.`}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4">
						<Button
							variant="outline"
							onClick={() => setRoleDialogOpen(false)}
							disabled={isProcessing}>
							Cancel
						</Button>
						<Button
							onClick={handleRoleConfirm}
							disabled={isProcessing}
							className={
								selectedUser?.role === "admin"
									? "bg-yellow-600 hover:bg-yellow-700"
									: "bg-primary hover:bg-primary/90"
							}>
							{isProcessing ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Updating...
								</>
							) : selectedUser?.role === "admin" ? (
								"Remove Admin"
							) : (
								"Make Admin"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
