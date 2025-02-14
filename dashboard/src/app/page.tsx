import { OrderList } from "@/components/order-list";

export default function Home() {
	return (
		<div className="container mx-auto p-4 w-full">
			<h1 className="text-2xl font-bold mb-4">Restaurant Dashboard</h1>
			<OrderList />
		</div>
	);
}
