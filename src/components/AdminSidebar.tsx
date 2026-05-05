"use client";

import {
	ArrowLeft,
	Calendar,
	FileText,
	LayoutDashboard,
	MessageSquare,
	Plus,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
	{ title: "Overview", icon: LayoutDashboard, url: "/admin" },
	{ title: "Manage Events", icon: Calendar, url: "/admin/events" },
	{ title: "Subscribers", icon: Users, url: "/admin/subscribers" },
	{ title: "Forum Moderation", icon: MessageSquare, url: "/admin/forum" },
	{ title: "CMS Content", icon: FileText, url: "/admin/content" },
];

export function AdminSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar
			variant="inset"
			collapsible="icon"
			className="border-r border-primary/5">
			<SidebarHeader className="p-4">
				<div className="flex items-center gap-2 px-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<LayoutDashboard className="h-5 w-5" />
					</div>
					<span className="font-bold text-lg tracking-tight text-primary">
						Revival Admin
					</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Management</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={pathname === item.url}
										tooltip={item.title}
										className="hover:bg-primary/5 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground">
										<Link href={item.url}>
											<item.icon className="h-4 w-4" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Actions</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild className="hover:bg-primary/5">
									<Link href="/admin/events/new">
										<Plus className="h-4 w-4" />
										<span>Create New Event</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild className="hover:bg-primary/5">
									<Link href="/">
										<ArrowLeft className="h-4 w-4" />
										<span>Back to Public View</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="p-4 border-t border-primary/5">
				<div className="flex items-center gap-2 px-2 py-1">
					<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
						AD
					</div>
					<div className="flex flex-col">
						<span className="text-xs font-bold">Admin User</span>
						<span className="text-[10px] text-muted-foreground">
							admin@revival.com
						</span>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
