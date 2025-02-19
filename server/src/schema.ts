import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);

export const PlaceOrderSchema = z
	.object({
		id: z.number({
			required_error: "Id is required",
			invalid_type_error: "Id must be a number",
		}),
		quantity: z
			.number({
				required_error: "Quantity is required",
				invalid_type_error: "Quantity must be a number",
			})
			.min(1, { message: "Quantity must be at least 1" }),
	})
	.array()
	.nonempty({ message: "order array cannot be empty" });
