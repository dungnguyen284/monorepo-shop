import { z } from "zod";

// Create Product
export const createProductSchema = z.object({
	name: z.string().min(1, "Tên sản phẩm là bắt buộc").max(255),
	description: z.string().max(1000).optional(),
	price: z.number().positive("Giá phải lớn hơn 0"),
	stock: z.number().int().min(0).default(0),
	image: z.string().url().optional(),
	isActive: z.boolean().default(true),
	categoryId: z.number().int().positive("Category là bắt buộc"),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;

// Update Product
export const updateProductSchema = createProductSchema.partial();

export type UpdateProductDto = z.infer<typeof updateProductSchema>;

// Product Query
export const productQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	search: z.string().optional(),
	categoryId: z.coerce.number().int().positive().optional(),
	minPrice: z.coerce.number().min(0).optional(),
	maxPrice: z.coerce.number().min(0).optional(),
	isActive: z.coerce.boolean().optional(),
});

export type ProductQueryDto = z.infer<typeof productQuerySchema>;
