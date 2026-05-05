// app/admin/layout.tsx
"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { useRevival } from "@/hooks/useRevival";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated, user, isLoading } = useRevival();
	const router = useRouter();
	const pathname = usePathname();
	const [isChecking, setIsChecking] = useState(true);
	const [isMobile, setIsMobile] = useState(false);

	// Check if mobile view
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		// Check authentication
		if (!isLoading) {
			if (!isAuthenticated) {
				router.replace("/");
				return;
			}

			// Check if user is admin
			if (user?.role !== "admin") {
				router.replace("/");
				return;
			}

			setIsChecking(false);
		}
	}, [isAuthenticated, isLoading, user, router]);

	// Don't render if not admin
	if (!isAuthenticated || user?.role !== "admin") {
		return null;
	}

	return (
		<div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
			{/* Desktop Sidebar */}
			<div className="hidden lg:block">
				<AdminSidebar />
			</div>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Page Content */}
				<main
					className={`flex-1 overflow-y-auto ${
						!isMobile ? "p-6" : "p-4 pb-20"
					}`}>
					<div className="mx-auto max-w-7xl">{children}</div>
				</main>
			</div>
		</div>
	);
}
