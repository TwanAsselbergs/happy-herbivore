import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<SidebarProvider>
					<div className="flex h-screen overflow-hidden w-full">
						<AppSidebar />
						<main className="flex-1 overflow-y-auto bg-background w-full">
							{children}
						</main>
					</div>
				</SidebarProvider>
			</body>
		</html>
	);
}
