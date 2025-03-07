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
	const tickFormatter = (value: string) => {
		const limit = 10; // put your maximum character
		if (value.length < limit) return value;
		return `${value.substring(0, limit)}...`;
	};

	return (
		<ChartContainer config={chartConfig} className="min-h-fit w-full">
			<BarChart accessibilityLayer data={products} layout="vertical">
				<CartesianGrid horizontal={false} />
				<XAxis type="number" />
				<ChartTooltip content={<ChartTooltipContent />} />
				<Bar dataKey="quantity" fill="var(--color-orange-300)" />
				<YAxis
					type="category"
					width={120}
					dataKey="name"
					interval={0}
					tickFormatter={tickFormatter}
					className="text-nowrap break"
				/>
			</BarChart>
		</ChartContainer>
	);
}
