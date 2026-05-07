// components/AdminSidebar.tsx
"use client";

import { useRevival } from "@/hooks/useRevival";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	FileText,
	FileTextIcon,
	LayoutDashboard,
	LogOut,
	Settings,
	Tag,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const menuItems = [
	{ href: "/admin", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/events", label: "Manage Events", icon: Calendar },
	{ href: "/admin/users", label: "Users", icon: Users },
	{ href: "/admin/categories", label: "Categories", icon: Tag },
	{ href: "/admin/blogs", label: "Blogs", icon: FileTextIcon },
	// { href: "/admin/reviews", label: "Reviews", icon: AlertCircle },
	// { href: "/admin/messages", label: "Messages", icon: MessageSquare },
	{ href: "/admin/resources", label: "Resources", icon: FileText },
	{ href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { user, logout } = useRevival();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleLogout = async () => {
		logout();
		toast.success("Logged out successfully");
		router.push("/");
	};

	return (
		<aside
			className={`${
				isCollapsed ? "w-20" : "w-72"
			} bg-white dark:bg-gray-900 border-r border-primary/5 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out group/sidebar z-50`}>
			{/* Toggle Button */}
			<button
				onClick={() => setIsCollapsed(!isCollapsed)}
				className="absolute -right-3 top-10 bg-primary text-white rounded-full p-1 border-2 border-white dark:border-gray-900 hover:scale-110 transition-transform z-50 shadow-md">
				{isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
			</button>

			{/* Brand Logo Section */}
			<div className={`p-6 ${isCollapsed ? "px-3" : "p-8"}`}>
				<div className="flex flex-col items-start gap-3">
					<div className="shrink-0 rounded-xl bg-primary p-1 flex items-center justify-center">
						<Image
							src="/images/logo.png"
							alt="Logo"
							width={140}
							height={40}
							className="brightness-0 invert"
						/>
					</div>
					{!isCollapsed && (
						<div className="whitespace-nowrap overflow-hidden transition-opacity duration-300">
							<h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
								Admin Panel
							</h1>
						</div>
					)}
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
				<div
					className={`mb-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest ${
						isCollapsed ? "hidden" : "block"
					}`}>
					Main Menu
				</div>
				<ul className="space-y-1.5">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<li key={item.href}>
								<Link
									href={item.href}
									title={isCollapsed ? item.label : ""}
									className={`flex items-center ${
										isCollapsed ? "justify-center" : "justify-between"
									} px-4 py-3 rounded-2xl transition-all duration-200 group ${
										isActive
											? "bg-primary text-white shadow-md shadow-primary/20"
											: "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
									}`}>
									<div className="flex items-center gap-3">
										<Icon
											size={20}
											className={
												isActive
													? "text-white"
													: "text-gray-400 group-hover:text-primary"
											}
										/>
										{!isCollapsed && (
											<span className="text-sm font-medium whitespace-nowrap">
												{item.label}
											</span>
										)}
									</div>
									{!isCollapsed && isActive && (
										<ChevronRight size={14} className="opacity-70" />
									)}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* User Profile & Logout */}
			<div
				className={`p-4 mt-auto transition-all ${
					isCollapsed ? "px-2" : "p-4"
				}`}>
				<div
					className={`bg-gray-50 dark:bg-gray-800 rounded-[24px] border border-gray-100 dark:border-gray-700 overflow-hidden ${
						isCollapsed ? "p-2" : "p-4"
					}`}>
					<div className="flex items-center gap-3 mb-4">
						<div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
							{user?.name?.charAt(0).toUpperCase() || "A"}
						</div>
						{!isCollapsed && (
							<div className="overflow-hidden">
								<p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">
									{user?.name?.split(" ")[0] || "Admin"}
								</p>
								<p className="text-[10px] text-gray-400 capitalize font-medium">
									{user?.role || "Admin"} Access
								</p>
							</div>
						)}
					</div>

					<button
						onClick={handleLogout}
						title={isCollapsed ? "Sign Out" : ""}
						className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 hover:border-red-100 dark:hover:border-red-800 transition-all`}>
						<LogOut size={14} />
						{!isCollapsed && <span>Sign Out</span>}
					</button>
				</div>
			</div>
		</aside>
	);
}
