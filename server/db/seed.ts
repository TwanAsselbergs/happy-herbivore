import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Product {
	name: string;
	categoryId: number;
	description?: string;
	price: number;
	kcal: number;
	filename: string;
}

async function main() {
	// Delete existing data (order matters due to foreign key constraints)
	await prisma.orderProduct.deleteMany({});
	await prisma.order.deleteMany({});
	await prisma.product.deleteMany({});
	await prisma.category.deleteMany({});
	await prisma.image.deleteMany({});
	await prisma.orderStatus.deleteMany({});

	await prisma.image.createMany({
		data: [
			{ filename: "/img/categories/breakfast-no-background.png" },
			{ filename: "/img/categories/lunch-no-background.png" },
			{ filename: "/img/categories/sides-no-background.png" },
			{ filename: "/img/categories/snacks-no-background.png" },
			{ filename: "/img/categories/dips-no-background.png" },
			{ filename: "/img/categories/drinks-no-background.png" },
		],
	});

	const categoryImages = await prisma.image.findMany({
		select: {
			id: true,
			filename: true,
		},
	});

	await prisma.category.createMany({
		data: [
			{
				name: "Breakfast",
				imageId:
					categoryImages.find(
						(img) => img.filename === "/img/categories/breakfast-no-background.png"
					)?.id || 0,
			},
			{
				name: "Lunch & Dinner",
				imageId:
					categoryImages.find(
						(img) => img.filename === "/img/categories/lunch-no-background.png"
					)?.id || 0,
			},
			{
				name: "Sides",
				imageId:
					categoryImages.find(
						(img) => img.filename === "/img/categories/sides-no-background.png"
					)?.id || 0,
			},
			{
				name: "Snacks",
				imageId:
					categoryImages.find(
						(img) => img.filename === "/img/categories/snacks-no-background.png"
					)?.id || 0,
			},
			{
				name: "Dips",
				imageId:
					categoryImages.find(
						(img) => img.filename === "/img/categories/dips-no-background.png"
					)?.id || 0,
			},
			{
				name: "Drinks",
				imageId:
					categoryImages.find(
						(img) => img.filename === "/img/categories/drinks-no-background.png"
					)?.id || 0,
			},
		],
		skipDuplicates: true,
	});

	const categoryIds = await prisma.category.findMany({
		select: { id: true, name: true },
	});

	await prisma.orderStatus.createMany({
		data: [
			{ description: "Started" },
			{ description: "Placed and paid" },
			{ description: "Preparing" },
			{ description: "Ready for pickup" },
			{ description: "Picked up" },
		],
		skipDuplicates: true,
	});

	const filenames = [
		"apple-cinnamon-chips.png",
		"morning-boost-smoothie-bowl.png",
		"eggcellent-wrap.png",
		"peanut-butter-power-toast.png",
		"protein-packed-bowl.png",
		"supergreen-salad.png",
		"zesty-chickpea-wrap.png",
		"sweet-potato-wedges.png",
		"quinoa-salad-cup.png",
		"mini-veggie-platter.png",
		"brown-rice-edamame-bowl.png",
		"roasted-chickpeas-spicy-or-herb.png",
		"trail-mix-cup.png",
		"chia-pudding-cup.png",
		"baked-falafel-bites-4-pcs.png",
		"mini-whole-grain-breadsticks.png",
		"zucchini-fries.png",
		"classic-hummus.png",
		"avocado-lime-dip.png",
		"greek-yogurt-ranch.png",
		"spicy-sriracha-mayo.png",
		"garlic-tahini-sauce.png",
		"zesty-tomato-salsa.png",
		"peanut-dipping-sauce.png",
		"green-glow-smoothie.png",
		"iced-matcha-latte.png",
		"fruit-infused-water.png",
		"berry-blast-smoothie.png",
		"citrus-cooler.png",
	];

	const imageData = filenames.map((filename) => ({
		filename: `/img/products/${filename}`,
	}));

	await prisma.image.createMany({
		data: imageData,
	});

	const images = await prisma.image.findMany({
		select: { id: true, filename: true },
	});

	const products = [
		{
			category: "Breakfast",
			name: "Morning Boost Smoothie Bowl",
			description:
				"A blend of acai, banana, and mixed berries topped with granola, chia seeds, and coconut flakes.",
			price: 4.5,
			kcal: 300,
			filename: "smoothie-bowl.png",
		},
		{
			category: "Breakfast",
			name: "Eggcellent Wrap",
			description:
				"Whole-grain wrap filled with scrambled eggs, spinach, and a light yogurt-based sauce.",
			price: 3.5,
			kcal: 250,
			filename: "eggcellent-wrap.png",
		},
		{
			category: "Breakfast",
			name: "Peanut Butter Power Toast",
			description:
				"Whole-grain toast with natural peanut butter and banana slices.",
			price: 2.8,
			kcal: 220,
			filename: "peanut-butter-toast.png",
		},
		{
			category: "Lunch & Dinner",
			name: "Protein Packed Bowl",
			description:
				"Quinoa, grilled tofu, roasted vegetables, and a tahini dressing.",
			price: 6.0,
			kcal: 450,
			filename: "protein-packed-bowl.png",
		},
		{
			category: "Lunch & Dinner",
			name: "Supergreen Salad",
			description:
				"Kale, spinach, avocado, edamame, cucumber, and a lemon-olive oil vinaigrette.",
			price: 5.0,
			kcal: 300,
			filename: "supergreen-salad.png",
		},
		{
			category: "Lunch & Dinner",
			name: "Zesty Chickpea Wrap",
			description:
				"Whole-grain wrap with spiced chickpeas, shredded carrots, lettuce, and hummus.",
			price: 4.5,
			kcal: 400,
			filename: "zesty-chickpea-wrap.png",
		},
		{
			category: "Sides",
			name: "Sweet Potato Wedges",
			description:
				"Oven-baked sweet potato wedges seasoned with paprika and a touch of olive oil.",
			price: 3.5,
			kcal: 250,
			filename: "sweet-potato-wedges.png",
		},
		{
			category: "Sides",
			name: "Quinoa Salad Cup",
			description:
				"Mini cup of quinoa mixed with cucumber, cherry tomatoes, parsley, and lemon dressing.",
			price: 3.0,
			kcal: 200,
			filename: "quinoa-salad-cup.png",
		},
		{
			category: "Sides",
			name: "Mini Veggie Platter",
			description:
				"A selection of carrot sticks, celery, cucumber slices, and cherry tomatoes served with a dip of your choice.",
			price: 3.0,
			kcal: 150,
			filename: "mini-veggie-platter.webp",
		},
		{
			category: "Sides",
			name: "Brown Rice & Edamame Bowl",
			description:
				"A small portion of brown rice topped with steamed edamame and a drizzle of soy sauce.",
			price: 3.5,
			kcal: 300,
			filename: "brown-rice-bowl.png",
		},
		{
			category: "Snacks",
			name: "Roasted Chickpeas (Spicy or Herb)",
			description:
				"Crunchy roasted chickpeas with your choice of spicy paprika or herb seasoning.",
			price: 2.5,
			kcal: 180,
			filename: "roasted-chickpeas.png",
		},
		{
			category: "Snacks",
			name: "Trail Mix Cup",
			description: "A mix of nuts, dried fruits, and seeds for an energy boost.",
			price: 2.0,
			kcal: 200,
			filename: "trail-mix-cup.png",
		},
		{
			category: "Snacks",
			name: "Chia Pudding Cup",
			description:
				"Creamy chia pudding made with almond milk and topped with fresh fruit.",
			price: 3.0,
			kcal: 250,
			filename: "chia-pudding-cup.png",
		},
		{
			category: "Snacks",
			name: "Baked Falafel Bites (4 pcs)",
			description: "Baked falafel balls served with a dip of your choice.",
			price: 3.5,
			kcal: 220,
			filename: "baked-falafel-bites.png",
		},
		{
			category: "Snacks",
			name: "Mini Whole-Grain Breadsticks",
			description:
				"Crisp, wholesome breadsticks perfect for pairing with hummus or salsa.",
			price: 2.0,
			kcal: 150,
			filename: "whole-grain-bread-sticks.png",
		},
		{
			category: "Snacks",
			name: "Apple & Cinnamon Chips",
			description: "Baked apple slices lightly dusted with cinnamon.",
			price: 2.5,
			kcal: 100,
			filename: "apple-cinnamon-chips.png",
		},
		{
			category: "Snacks",
			name: "Zucchini Fries",
			description: "Baked zucchini sticks coated in a light breadcrumb crust.",
			price: 3.0,
			kcal: 180,
			filename: "zucchini-fries.png",
		},
		{
			category: "Dips",
			name: "Classic Hummus",
			price: 0.8,
			kcal: 70,
			filename: "classic-hummus.png",
		},
		{
			category: "Dips",
			name: "Avocado Lime Dip",
			price: 1.0,
			kcal: 80,
			filename: "avocado-lime-dip.png",
		},
		{
			category: "Dips",
			name: "Greek Yogurt Ranch",
			price: 0.7,
			kcal: 50,
			filename: "greek-yogurt-ranch.png",
		},
		{
			category: "Dips",
			name: "Spicy Sriracha Mayo",
			price: 0.7,
			kcal: 60,
			filename: "spicy-sriracha-mayo.png",
		},
		{
			category: "Dips",
			name: "Garlic Tahini Sauce",
			price: 0.9,
			kcal: 90,
			filename: "garlic-tahini-sauce.png",
		},
		{
			category: "Dips",
			name: "Zesty Tomato Salsa",
			price: 0.6,
			kcal: 20,
			filename: "zesty-tomato-salsa.png",
		},
		{
			category: "Dips",
			name: "Peanut Dipping Sauce",
			price: 0.9,
			kcal: 100,
			filename: "peanut-dipping-sauce.png",
		},
		{
			category: "Drinks",
			name: "Green Glow Smoothie",
			description: "Spinach, pineapple, cucumber, and coconut water.",
			price: 3.5,
			kcal: 120,
			filename: "green-glow-smoothie.png",
		},
		{
			category: "Drinks",
			name: "Iced Matcha Latte",
			description: "Lightly sweetened matcha green tea with almond milk.",
			price: 3.0,
			kcal: 90,
			filename: "iced-matcha-latte.png",
		},
		{
			category: "Drinks",
			name: "Fruit-Infused Water",
			description:
				"Freshly infused water with a choice of lemon-mint, strawberry-basil, or cucumber-lime.",
			price: 1.5,
			kcal: 0,
			filename: "fruit-infused-water.png",
		},
		{
			category: "Drinks",
			name: "Berry Blast Smoothie",
			description:
				"A creamy blend of strawberries, blueberries, and raspberries with almond milk.",
			price: 3.8,
			kcal: 140,
			filename: "berry-blast-smoothie.png",
		},
		{
			category: "Drinks",
			name: "Citrus Cooler",
			description:
				"A refreshing mix of orange juice, sparkling water, and a hint of lime.",
			price: 3.0,
			kcal: 90,
			filename: "citrus-cooler.png",
		},
	];

	for (const product of products) {
		const categoryId =
			categoryIds.find((c) => c.name === product.category)?.id || 0;

		const filename = product.name.toLowerCase().replace(/ /g, "-") + ".png";

		createProduct({
			name: product.name,
			description: product.description,
			categoryId,
			filename: product.filename,
			price: product.price,
			kcal: product.kcal,
		});
	}

	console.log("Seeding complete!");
}

async function createProduct(product: Product) {
	const image = await prisma.image.create({
		data: {
			filename: `/img/products/${product.filename}`,
		},
		select: {
			id: true,
		},
	});

	await prisma.product.create({
		data: {
			categoryId: product.categoryId,
			imageId: image.id,
			name: product.name,
			description: product.description,
			price: product.price,
			kcal: product.kcal,
			available: true,
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
