import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Product {
	categoryId: number;
	price: number;
	kcal: number;
	filename: string;
	dietType: "VEGGIE" | "VEGAN";
	translations: ProductTranslation[];
}

interface ProductTranslation {
	languageId: number;
	name: string;
	description?: string;
}

async function main() {
	await prisma.orderProduct.deleteMany({});
	await prisma.order.deleteMany({});
	await prisma.product.deleteMany({});
	await prisma.category.deleteMany({});
	await prisma.image.deleteMany({});
	await prisma.language.deleteMany({});

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

	await prisma.language.createMany({
		data: [
			{
				code: "en",
				name: "English",
			},
			{
				code: "nl",
				name: "Dutch",
			},
		],
	});

	const englishLanguageId = (
		await prisma.language.findFirst({
			where: {
				code: "en",
			},
			select: {
				id: true,
			},
		})
	)?.id;

	const dutchLanguageId = (
		await prisma.language.findFirst({
			where: {
				code: "nl",
			},
			select: {
				id: true,
			},
		})
	)?.id;

	if (!dutchLanguageId || !englishLanguageId) {
		throw new Error("Languages did not seed properly, try again.");
	}

	const categoryImages = await prisma.image.findMany({
		select: {
			id: true,
			filename: true,
		},
	});

	const categories: {
		imageId: number;
		categoryTranslations: {
			languageId: number;
			name: string;
			description: string;
		}[];
	}[] = [
		{
			imageId:
				categoryImages.find(
					(img) => img.filename === "/img/categories/breakfast-no-background.png"
				)?.id ?? 0,
			categoryTranslations: [
				{
					languageId: englishLanguageId,
					name: "Breakfast",
					description: "",
				},
				{
					languageId: dutchLanguageId,
					name: "Ontbijt",
					description: "",
				},
			],
		},
		{
			imageId:
				categoryImages.find(
					(img) => img.filename === "/img/categories/lunch-no-background.png"
				)?.id ?? 0,
			categoryTranslations: [
				{
					languageId: englishLanguageId,
					name: "Lunch & Dinner",
					description: "",
				},
				{
					languageId: dutchLanguageId,
					name: "Lunch & Diner",
					description: "",
				},
			],
		},
		{
			imageId:
				categoryImages.find(
					(img) => img.filename === "/img/categories/sides-no-background.png"
				)?.id ?? 0,
			categoryTranslations: [
				{
					languageId: englishLanguageId,
					name: "Sides",
					description: "",
				},
				{
					languageId: dutchLanguageId,
					name: "Bijgerechten",
					description: "",
				},
			],
		},
		{
			imageId:
				categoryImages.find(
					(img) => img.filename === "/img/categories/snacks-no-background.png"
				)?.id ?? 0,
			categoryTranslations: [
				{
					languageId: englishLanguageId,
					name: "Snacks",
					description: "",
				},
				{
					languageId: dutchLanguageId,
					name: "Snacks",
					description: "",
				},
			],
		},
		{
			imageId:
				categoryImages.find(
					(img) => img.filename === "/img/categories/dips-no-background.png"
				)?.id ?? 0,
			categoryTranslations: [
				{
					languageId: englishLanguageId,
					name: "Dips",
					description: "",
				},
				{
					languageId: dutchLanguageId,
					name: "Dips",
					description: "",
				},
			],
		},
		{
			imageId:
				categoryImages.find(
					(img) => img.filename === "/img/categories/drinks-no-background.png"
				)?.id ?? 0,
			categoryTranslations: [
				{
					languageId: englishLanguageId,
					name: "Drinks",
					description: "",
				},
				{
					languageId: dutchLanguageId,
					name: "Dranken",
					description: "",
				},
			],
		},
	];

	for (const category of categories) {
		await createCategory(category);
	}

	async function createCategory({
		categoryTranslations,
		imageId,
	}: {
		imageId: number;
		categoryTranslations: {
			languageId: number;
			name: string;
			description: string;
		}[];
	}) {
		await prisma.category.create({
			data: {
				imageId,
				categoryTranslations: {
					createMany: {
						data: categoryTranslations,
					},
				},
			},
		});
	}

	const categoryIds: { id: number; name: string }[] = (
		await prisma.category.findMany({
			select: {
				id: true,
				categoryTranslations: {
					select: { name: true },
					where: { language: { code: "en" } },
				},
			},
		})
	).map((category) => ({
		...category,
		name: category.categoryTranslations[0].name,
	}));

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

	const products: (Omit<Product, "categoryId"> & { category: string })[] = [
		{
			category: "Breakfast",
			price: 4.5,
			kcal: 300,
			filename: "smoothie-bowl.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Morning Boost Smoothie Bowl",
					description:
						"A blend of acai, banana, and mixed berries topped with granola, chia seeds, and coconut flakes.",
				},
				{
					languageId: dutchLanguageId,
					name: "Morning Boost Smoothie Bowl",
					description:
						"Een mix van acai, banaan en gemengde bessen, gegarneerd met granola, chiazaad en kokosvlokken.",
				},
			],
		},
		{
			category: "Breakfast",
			price: 3.5,
			kcal: 500,
			filename: "eggcellent-wrap.png",
			dietType: "VEGGIE",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Eggcellent Wrap",
					description:
						"Whole-grain wrap filled with scrambled eggs, spinach, and a light yogurt-based sauce.",
				},
				{
					languageId: dutchLanguageId,
					name: "Eggcellent Wrap",
					description:
						"Volkorenwrap gevuld met roerei, spinazie en een lichte saus op basis van yoghurt.",
				},
			],
		},
		{
			category: "Breakfast",
			price: 2.8,
			kcal: 220,
			filename: "peanut-butter-toast.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Peanut Butter Power Toast",
					description:
						"Whole-grain toast with natural peanut butter and banana slices.",
				},
				{
					languageId: dutchLanguageId,
					name: "Pindakaas Power Toast",
					description: "Volkorenbrood met natuurlijke pindakaas en plakjes banaan.",
				},
			],
		},
		{
			category: "Lunch & Dinner",
			price: 6.0,
			kcal: 450,
			filename: "protein-packed-bowl.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Protein Packed Bowl",
					description:
						"Quinoa, grilled tofu, roasted vegetables, and a tahini dressing.",
				},
				{
					languageId: dutchLanguageId,
					name: "Protein Packed Bowl",
					description:
						"Quinoa, gegrilde tofu, geroosterde groenten en een tahindressing.",
				},
			],
		},
		{
			category: "Lunch & Dinner",
			price: 5.0,
			kcal: 300,
			filename: "supergreen-salad.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Supergreen Salad",
					description:
						"Kale, spinach, avocado, edamame, cucumber, and a lemon-olive oil vinaigrette.",
				},
				{
					languageId: dutchLanguageId,
					name: "Supergroene Salade",
					description:
						"Boerenkool, spinazie, avocado, edamame, komkommer en een citroen-olijfolie vinaigrette.",
				},
			],
		},
		{
			category: "Lunch & Dinner",
			price: 4.5,
			kcal: 400,
			filename: "zesty-chickpea-wrap.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Zesty Chickpea Wrap",
					description:
						"Whole-grain wrap with spiced chickpeas, shredded carrots, lettuce, and hummus.",
				},
				{
					languageId: dutchLanguageId,
					name: "Zesty Chickpea Wrap",
					description:
						"Volkorenwrap met gekruide kikkererwten, geraspte wortels, sla en hummus.",
				},
			],
		},
		{
			category: "Sides",
			price: 3.5,
			kcal: 250,
			filename: "sweet-potato-wedges.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Sweet Potato Wedges",
					description:
						"Oven-baked sweet potato wedges seasoned with paprika and a touch of olive oil.",
				},
				{
					languageId: dutchLanguageId,
					name: "Sweet Potato Wedges",
					description:
						"In de oven gebakken zoete aardappelpartjes, op smaak gebracht met paprika en een scheutje olijfolie.",
				},
			],
		},
		{
			category: "Sides",
			price: 3.0,
			kcal: 200,
			filename: "quinoa-salad-cup.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Quinoa Salad Cup",
					description:
						"Mini cup of quinoa mixed with cucumber, cherry tomatoes, parsley, and lemon dressing.",
				},
				{
					languageId: dutchLanguageId,
					name: "Quinoa Salad Cup",
					description:
						"Mini kopje quinoa gemengd met komkommer, cherrytomaatjes, peterselie en citroendressing.",
				},
			],
		},
		{
			category: "Sides",
			price: 3.0,
			kcal: 150,
			filename: "mini-veggie-platter.webp",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Mini Veggie Platter",
					description:
						"A selection of carrot sticks, celery, cucumber slices, and cherry tomatoes served with a dip of your choice.",
				},
				{
					languageId: dutchLanguageId,
					name: "Mini Veggie Platter",
					description:
						"Een selectie van worteltjes, selderij, komkommerschijfjes en cherrytomaatjes, geserveerd met een dip naar keuze.",
				},
			],
		},
		{
			category: "Sides",
			price: 3.5,
			kcal: 300,
			filename: "brown-rice-bowl.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Brown Rice & Edamame Bowl",
					description:
						"A small portion of brown rice topped with steamed edamame and a drizzle of soy sauce.",
				},
				{
					languageId: dutchLanguageId,
					name: "Brown Rice & Edamame Bowl",
					description:
						"Een klein portie bruine rijst met gestoomde edamame en een scheutje sojasaus.",
				},
			],
		},
		{
			category: "Snacks",
			price: 2.5,
			kcal: 180,
			filename: "roasted-chickpeas.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Roasted Chickpeas (Spicy or Herb)",
					description:
						"Crunchy roasted chickpeas with your choice of spicy paprika or herb seasoning.",
				},
				{
					languageId: dutchLanguageId,
					name: "Roasted Chickpeas (Pittig of Gekruid)",
					description:
						"Knapperige geroosterde kikkererwten met pittige paprika- of kruidenkruiden naar keuze.",
				},
			],
		},
		{
			category: "Snacks",
			price: 2.0,
			kcal: 200,
			filename: "trail-mix-cup.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Trail Mix Cup",
					description: "A mix of nuts, dried fruits, and seeds for an energy boost.",
				},
				{
					languageId: dutchLanguageId,
					name: "Trail Mix Cup",
					description:
						"Een mix van noten, gedroogd fruit en zaden voor een energieboost.",
				},
			],
		},
		{
			category: "Snacks",
			price: 3.0,
			kcal: 250,
			filename: "chia-pudding-cup.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Chia Pudding Cup",
					description:
						"Creamy chia pudding made with almond milk and topped with fresh fruit.",
				},
				{
					languageId: dutchLanguageId,
					name: "Chia Pudding Cup",
					description:
						"Romige chiapudding gemaakt met amandelmelk en gegarneerd met vers fruit.",
				},
			],
		},
		{
			category: "Snacks",
			price: 3.5,
			kcal: 220,
			filename: "baked-falafel-bites.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Baked Falafel Bites (4 pcs)",
					description: "Baked falafel balls served with a dip of your choice.",
				},
				{
					languageId: dutchLanguageId,
					name: "Baked Falafel Bites (4 st)",
					description:
						"Gebakken falafelballetjes geserveerd met een dip naar keuze.",
				},
			],
		},
		{
			category: "Snacks",
			price: 2.0,
			kcal: 150,
			filename: "whole-grain-bread-sticks.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Mini Whole-Grain Breadsticks",
					description:
						"Crisp, wholesome breadsticks perfect for pairing with hummus or salsa.",
				},
				{
					languageId: dutchLanguageId,
					name: "Mini Whole-Grain Breadsticks",

					description:
						"Knapperige, voedzame broodstengels, perfect te combineren met hummus of salsa.",
				},
			],
		},
		{
			category: "Snacks",
			price: 2.5,
			kcal: 100,
			filename: "apple-cinnamon-chips.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Apple & Cinnamon Chips",
					description: "Baked apple slices lightly dusted with cinnamon.",
				},
				{
					languageId: dutchLanguageId,
					name: "Apple & Cinnamon Chips",
					description: "Gebakken appelschijfjes, licht bestrooid met kaneel.",
				},
			],
		},
		{
			category: "Snacks",
			price: 3.0,
			kcal: 180,
			filename: "zucchini-fries.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Zucchini Fries",
					description: "Baked zucchini sticks coated in a light breadcrumb crust.",
				},
				{
					languageId: dutchLanguageId,
					name: "Zucchini Fries",

					description:
						"Gebakken courgettereepjes bedekt met een dun laagje broodkruim.",
				},
			],
		},
		{
			category: "Dips",
			price: 0.8,
			kcal: 70,
			filename: "classic-hummus.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Classic Hummus",
				},
				{
					languageId: dutchLanguageId,
					name: "Classic Hummus",
				},
			],
		},
		{
			category: "Dips",
			price: 1.0,
			kcal: 80,
			filename: "avocado-lime-dip.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Avocado Lime Dip",
				},
				{
					languageId: dutchLanguageId,
					name: "Avocado Lime Dip",
				},
			],
		},
		{
			category: "Dips",
			price: 0.7,
			kcal: 50,
			filename: "greek-yogurt-ranch.png",
			dietType: "VEGGIE",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Greek Yogurt Ranch",
				},
				{
					languageId: dutchLanguageId,
					name: "Greek Yogurt Ranch",
				},
			],
		},
		{
			category: "Dips",
			price: 0.7,
			kcal: 60,
			filename: "spicy-sriracha-mayo.png",
			dietType: "VEGGIE",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Spicy Sriracha Mayo",
				},
				{
					languageId: dutchLanguageId,
					name: "Spicy Sriracha Mayo",
				},
			],
		},
		{
			category: "Dips",
			price: 0.9,
			kcal: 90,
			filename: "garlic-tahini-sauce.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Garlic Tahini Sauce",
				},
				{
					languageId: dutchLanguageId,
					name: "Garlic Tahini Sauce",
				},
			],
		},
		{
			category: "Dips",
			price: 0.6,
			kcal: 20,
			filename: "zesty-tomato-salsa.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Zesty Tomato Salsa",
				},
				{
					languageId: dutchLanguageId,
					name: "Zesty Tomato Salsa",
				},
			],
		},
		{
			category: "Dips",
			price: 0.9,
			kcal: 100,
			filename: "peanut-dipping-sauce.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Peanut Dipping Sauce",
				},
				{
					languageId: dutchLanguageId,
					name: "Peanut Dipping Sauce",
				},
			],
		},
		{
			category: "Drinks",
			price: 3.5,
			kcal: 120,
			filename: "green-glow-smoothie.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Green Glow Smoothie",
					description: "Spinach, pineapple, cucumber, and coconut water.",
				},
				{
					languageId: dutchLanguageId,
					name: "Green Glow Smoothie",
					description: "Spinazie, ananas, komkommer en kokoswater.",
				},
			],
		},
		{
			category: "Drinks",
			price: 3.0,
			kcal: 90,
			filename: "iced-matcha-latte.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Iced Matcha Latte",
					description: "Lightly sweetened matcha green tea with almond milk.",
				},
				{
					languageId: dutchLanguageId,
					name: "Iced Matcha Latte",
					description: "Licht gezoete matcha groene thee met amandelmelk.",
				},
			],
		},
		{
			category: "Drinks",
			price: 1.5,
			kcal: 0,
			filename: "fruit-infused-water.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Fruit-Infused Water",
					description:
						"Freshly infused water with a choice of lemon-mint, strawberry-basil, or cucumber-lime.",
				},
				{
					languageId: dutchLanguageId,
					name: "Fruit-Infused Water",
					description:
						"Vers geperst water met een keuze uit citroen-munt, aardbei-basilicum of komkommer-limoen.",
				},
			],
		},
		{
			category: "Drinks",

			price: 3.8,
			kcal: 140,
			filename: "berry-blast-smoothie.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Berry Blast Smoothie",
					description:
						"A creamy blend of strawberries, blueberries, and raspberries with almond milk.",
				},
				{
					languageId: dutchLanguageId,
					name: "Berry Blast Smoothie",
					description:
						"Een romige mix van aardbeien, bosbessen en frambozen met amandelmelk.",
				},
			],
		},
		{
			category: "Drinks",
			price: 3.0,
			kcal: 90,
			filename: "citrus-cooler.png",
			dietType: "VEGAN",
			translations: [
				{
					languageId: englishLanguageId,
					name: "Citrus Cooler",
					description:
						"A refreshing mix of orange juice, sparkling water, and a hint of lime.",
				},
				{
					languageId: dutchLanguageId,
					name: "Citrus Cooler",

					description:
						"Een verfrissende mix van sinaasappelsap, bruisend water en een vleugje limoen.",
				},
			],
		},
	];

	for (const product of products) {
		const categoryId =
			categoryIds.find((c) => c.name === product.category)?.id ?? 0;

		createProduct({
			categoryId,
			filename: product.filename,
			price: product.price,
			kcal: product.kcal,
			dietType: product.dietType,
			translations: product.translations,
		});

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
				price: product.price,
				kcal: product.kcal,
				dietType: product.dietType,
				available: true,
				productTranslations: {
					createMany: {
						data: product.translations.map((translation) => ({
							name: translation.name,
							description: translation.description,
							languageId: translation.languageId,
						})),
					},
				},
			},
		});
	}
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
