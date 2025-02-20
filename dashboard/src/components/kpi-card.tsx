import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export default function KpiCard({
	title,
	value,
	description,
	icon,
	trend,
}: Readonly<{
	title: string;
	value: string;
	description: string;
	icon: React.ReactNode;
	trend: "up" | "down";
}>) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground">
					{trend === "up" ? (
						<ArrowUpIcon className="mr-1 h-4 w-4 text-green-500 inline" />
					) : (
						<ArrowDownIcon className="mr-1 h-4 w-4 text-red-500 inline" />
					)}
					{description}
				</p>
			</CardContent>
		</Card>
	);
}
