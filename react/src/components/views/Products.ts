import { Product, Category, Image } from "../../lib/types";

const images: Image[] = [
	{
		id: 1,
		filename: "/img/products/smoothie-bowl.png",
		description: "Morning Boost Smoothie Bowl",
	},
	{
		id: 2,
		filename: "/img/products/eggcellent-wrap.png",
		description: "Eggcellent Wrap",
	},
	{
		id: 3,
		filename: "/img/products/peanut-butter-toast.png",
	},
	{
		id: 4,
		filename: "/img/breakfast.png",
	},
	{
		id: 5,
		filename: "/img/lunch.png",
	},
	{
		id: 6,
		filename: "/img/sides.png",
	},
	{
		id: 7,
		filename: "/img/products/protein-packed-bowl.png",
	},
	{
		id: 8,
		filename: "./img/products/supergreen-salad.png",
	},
	{
		id: 9,
		filename: "./img/products/zesty-chickpea-wrap.png",
	},
	{
		id: 10,
		filename: "./img/products/sweet-potato-wedges.png",
	},
	{
		id: 11,
		filename: "./img/products/quinoa-salad-cup.png",
	},
	{
		id: 12,
		filename: "./img/products/mini-veggie-platter.webp",
	},
	{
		id: 13,
		filename: "./img/products/brown-rice-bowl.png",
	},
	{
		id: 14,
		filename: "/img/snacks.png",
	},
	{
		id: 15,
		filename: "/img/dips.png",
	},
	{
		id: 16,
		filename: "./img/products/roasted-chickpeas.png",
	},
	{
		id: 17,
		filename: "./img/products/trail-mix-cup.png",
	},
	{
		id: 18,
		filename: "./img/products/chia-pudding-cup.png",
	},
	{
		id: 19,
		filename: "./img/products/baked-falafel-bites.png",
	},
	{
		id: 20,
		filename: "./img/products/whole-grain-bread-sticks.png",
	},
	{
		id: 21,
		filename: "./img/products/apple-cinnamon-chips.png",
	},
	{
		id: 22,
		filename: "./img/products/zucchini-fries.png",
	},
];

export const categories: Category[] = [
	{
		id: 0,
		name: "Breakfast",
		image: images[3],
	},
	{
		id: 1,
		name: "Lunch & Dinner",
		image: images[4],
	},
	{
		id: 2,
		name: "Sides",
		image: images[5],
	},
	{
		id: 3,
		name: "Snacks",
		image: images[13],
	},
	{
		id: 4,
		name: "Dips",
		image: images[14],
	},
];

export const products: Product[] = [
	{
		id: 1,
		category: categories[0],
		description:
			"A blend of acai, banana, and mixed berries topped with granola, chia seeds, and coconut flakes.",
		title: "Morning Boost Smoothie Bowl",
		available: true,
		image: images[0],
		kcal: 300,
		price: 4.5,
	},
	{
		id: 2,
		category: categories[0],
		description:
			"Whole-grain wrap filled with scrambled eggs, spinach, and a light yogurt-based sauce.",
		title: "Eggcellent Wrap",
		available: true,
		image: images[1],
		kcal: 250,
		price: 3.5,
	},
	{
		id: 3,
		category: categories[0],
		available: true,
		kcal: 220,
		price: 2.8,
		image: images[2],
		description:
			"Whole-grain toast with natural peanut butter and banana slices.",
		title: "Peanut Butter Toast",
	},
	{
		id: 4,
		category: categories[1],
		available: true,
		kcal: 450,
		price: 6.0,
		image: images[6],
		description:
			"Quinoa, grilled tofu, roasted vegetables, and a tahini dressing.",
		title: "Protein-Packed Bowl",
	},
	{
		id: 5,
		category: categories[1],
		available: true,
		kcal: 300,
		price: 5.0,
		image: images[7],
		description:
			"Kale, spinach, avocado, edamame, cucumber, and a lemon-olive oil vinaigrette.",
		title: "Supergreen Salad",
	},
	{
		id: 6,
		category: categories[1],
		available: true,
		kcal: 400,
		price: 4.5,
		image: images[8],
		description:
			"Whole-grain wrap with spiced chickpeas, shredded carrots, lettuce, and hummus.",
		title: "Zesty Chickpea Wrap",
	},
	{
		id: 7,
		category: categories[2],
		available: true,
		kcal: 250,
		price: 3.5,
		image: images[9],
		description:
			"Oven-baked sweet potato wedges seasoned with paprika and a touch of olive oil.",
		title: "Sweet Potato Wedges",
	},
	{
		id: 8,
		category: categories[2],
		available: true,
		kcal: 200,
		price: 3.0,
		image: images[10],
		description:
			"Mini cup of quinoa mixed with cucumber, cherry tomatoes, parsley, and lemon dressing.",
		title: "Quinoa Salad Cup",
	},
	{
		id: 9,
		category: categories[2],
		available: true,
		kcal: 150,
		price: 3.0,
		image: images[11],
		description:
			"A selection of carrot sticks, celery, cucumber slices, and cherry tomatoes served with a dip of your choice.",
		title: "Mini Veggie Platter",
	},
	{
		id: 10,
		category: categories[2],
		available: true,
		kcal: 300,
		price: 3.5,
		image: images[12],
		description:
			"A small portion of brown rice topped with steamed edamame and a drizzle of soy sauce.",
		title: "Brown Rice & Edamame Bowl",
	},
	{
		id: 11,
		category: categories[3],
		available: true,
		kcal: 180,
		price: 2.5,
		image: images[15],
		description:
			"Crunchy roasted chickpeas with your choice of spicy paprika or herb seasoning.",
		title: "Roasted Chickpeas (Spicy or Herb)",
	},
	{
		id: 12,
		category: categories[3],
		available: true,
		kcal: 200,
		price: 2.0,
		image: images[16],
		description: "A mix of nuts, dried fruits, and seeds for an energy boost.",
		title: "Trail Mix Cup",
	},
	{
		id: 13,
		category: categories[3],
		available: true,
		kcal: 250,
		price: 3.0,
		image: images[17],
		description:
			"Creamy chia pudding made with almond milk and topped with fresh fruit.",
		title: "Chia Pudding Cup",
	},
	{
		id: 13,
		category: categories[3],
		available: true,
		kcal: 220,
		price: 3.5,
		image: images[18],
		description: "Baked falafel balls served with a dip of your choice.",
		title: "Baked Falafel Bites (4 pcs)",
	},
	{
		id: 14,
		category: categories[3],
		available: true,
		kcal: 150,
		price: 2.0,
		image: images[19],
		description:
			"Crisp, wholesome breadsticks perfect for pairing with hummus or salsa.",
		title: "Mini Whole-Grain Breadsticks",
	},
	{
		id: 15,
		category: categories[3],
		available: true,
		kcal: 100,
		price: 2.5,
		image: images[20],
		description: "Baked apple slices lightly dusted with cinnamon.",
		title: "Apple & Cinnamon Chips",
	},
	{
		id: 16,
		category: categories[3],
		available: true,
		kcal: 180,
		price: 3.0,
		image: images[21],
		description: "Baked zucchini sticks coated in a light breadcrumb crust.",
		title: "Zucchini Fries",
	},
];
