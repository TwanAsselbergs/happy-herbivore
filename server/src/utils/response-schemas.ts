import { PickupType } from "@prisma/client";

export const langQuery = {
	querystring: {
		type: "object",
		properties: {
			lang: { type: "string", enum: ["en", "nl"] },
		},
	},
};

export const categoriesResponseSchema = {
	schema: {
		description:
			"Get all categories. Add a 'lang' value to the query params to retrieve the categories in a certain language (default is English).",
		tags: ["Categories"],
		...langQuery,
		response: {
			200: {
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
			},
		},
	},
};

export const productSchema = {
	schema: {
		description:
			"Get info about a specific product. Add a 'lang' value to the query params to retrieve the product in a certain language (default is English).",
		tags: ["Products"],
		response: {
			200: {
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
			404: {
				type: "object",
				description: "Product does not exist",
				properties: {
					error: { type: "string" },
				},
			},
			400: {
				type: "object",
				description:
					"Bad request: check if ID is present in the URL and make sure it's a number",
				properties: {
					error: { type: "string" },
				},
			},
		},
		...langQuery,
	},
};

export const ordersResponseSchema = {
	schema: {
		description: "Get today's orders",
		tags: ["Orders"],
		response: {
			200: {
				description: "Successful response",
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
								pickupType: PickupType,
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
			},
		},
	},
};

export const ordersRequestSchema = {
	schema: {
		description: "Place a new order",
		tags: ["Orders"],
		body: {
			type: "object",
			properties: {
				order: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: { type: "number" },
							quantity: { type: "number" },
						},
						required: ["id", "quantity"],
					},
				},
			},
			required: ["order"],
		},
		response: {
			200: {
				description: "Order placed successfully",
				type: "object",
				properties: {
					order: {
						type: "object",
						properties: {
							id: { type: "number" },
							price: { type: "number" },
							pickupNumber: { type: "number" },
						},
					},
				},
			},
		},
	},
};

export const productsSchema = {
	schema: {
		description:
			"Get all products. Add a 'lang' value to the query params to retrieve the products in a certain language (default is English).",
		tags: ["Products"],
		response: {
			200: {
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
			},
		},
		...langQuery,
	},
};
