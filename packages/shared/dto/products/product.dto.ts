// Re-export types from schemas for backward compatibility
export type {
	CreateProductDto,
	UpdateProductDto,
	ProductQueryDto,
} from "../../schemas/product.schema";

export type ProductDto = {
	id: number;
	name: string;
	description: string | null;
	price: number;
	stock: number;
	image: string | null;
	isActive: boolean;
	categoryId: number;
	category?: {
		id: number;
		name: string;
	};
	createdAt: Date;
	updatedAt: Date;
};
