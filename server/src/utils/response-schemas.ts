export const categoriesResponseSchema = {
	type: "array",
	items: {
		type: "object",
		properties: {
			id: { type: "number" },
			image: {
				type: "object",
				properties: {
					filename: { type: "string" },
				},
			},
			name: { type: "string" },
		},
	},
};

export const productSchema = {
	type: "object",
	properties: {
		category: {
			type: "object",
			properties: {
				id: { type: "integer" },
				image: {
					type: "object",
					properties: {
						id: { type: "integer" },
						filename: { type: "string" },
						description: { type: "string", nullable: true },
					},
					required: ["id", "filename"],
				},
				name: { type: "string" },
			},
			required: ["id", "image", "name"],
		},
		image: {
			type: "object",
			properties: {
				filename: { type: "string" },
				description: { type: "string", nullable: true },
			},
			required: ["filename"],
		},
		kcal: { type: "integer" },
		id: { type: "integer" },
		price: { type: "string" },
		dietType: {
			type: "string",
			enum: ["VEGGIE", "VEGAN"],
		},
		name: { type: "string" },
		description: { type: "string" },
	},
	required: [
		"category",
		"image",
		"kcal",
		"id",
		"price",
		"dietType",
		"name",
		"description",
	],
};

export const ordersResponseSchema = {
	type: "object",
	properties: {
		orders: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: { type: "number" },
					createdAt: { type: "string", format: "date-time" },
					price: { type: "string" },
					pickupNumber: { type: "number" },
					orderProducts: {
						type: "array",
						items: {
							type: "object",
							properties: {
								price: { type: "string" },
								quantity: { type: "number" },
								product: {
									type: "object",
									properties: {
										id: { type: "number" },
										productTranslations: {
											type: "array",
											items: {
												type: "object",
												properties: {
													name: { type: "string" },
													description: { type: "string" },
												},
											},
										},
										image: {
											type: "object",
											properties: {
												id: { type: "number" },
												filename: { type: "string" },
												description: { type: "string", nullable: true },
											},
										},
										name: { type: "string" },
									},
								},
								status: { type: "string" },
							},
						},
					},
					status: { type: "string" },
				},
			},
		},
	},
};

export const productsSchema = {
	type: "array",
	items: {
		type: "object",
		properties: {
			category: {
				type: "object",
				properties: {
					id: { type: "integer" },
					image: {
						type: "object",
						properties: {
							id: { type: "integer" },
							filename: { type: "string" },
							description: { type: "string", nullable: true },
						},
						required: ["id", "filename"],
					},
					name: { type: "string" },
				},
				required: ["id", "image", "name"],
			},
			image: {
				type: "object",
				properties: {
					filename: { type: "string" },
					description: { type: "string", nullable: true },
				},
				required: ["filename"],
			},
			kcal: { type: "integer" },
			id: { type: "integer" },
			price: { type: "string" },
			dietType: {
				type: "string",
				enum: ["VEGGIE", "VEGAN"],
			},
			name: { type: "string" },
			description: { type: "string" },
		},
		required: [
			"category",
			"image",
			"kcal",
			"id",
			"price",
			"dietType",
			"name",
			"description",
		],
	},
};

export const langQuery = {
	querystring: {
		type: "object",
		properties: {
			lang: { type: "string", enum: ["en", "nl"] },
		},
	},
};
