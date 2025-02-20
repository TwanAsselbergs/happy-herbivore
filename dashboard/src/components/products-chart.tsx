import React from "react";
import {
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { MostOrderedProductType } from "@/types/common";

const chartConfig = {
	quantity: {
		label: "Quantity",
		color: "#2563eb",
	},
} satisfies ChartConfig;

export default function ProductsChart({
	products,
}: Readonly<{
	products: MostOrderedProductType[];
}>) {
	return (
		<ChartContainer
			config={chartConfig}
			className="min-h-[200px] max-h-[500px] w-full"
		>
			<BarChart accessibilityLayer data={products} layout="vertical">
				<CartesianGrid horizontal={false} />
				<XAxis type="number" />
				<ChartTooltip content={<ChartTooltipContent />} />
				<Bar
					dataKey="quantity"
					fill="var(--color-desktop)"
					radius={4}
					maxBarSize={50}
				/>
				<YAxis type="category" width={100} dataKey="name" />
			</BarChart>
		</ChartContainer>
	);
}
