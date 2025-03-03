import "@/app/globals.css";
import { Inter } from "next/font/google";
import type React from "react";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<main className="flex-1 overflow-y-auto w-full">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
