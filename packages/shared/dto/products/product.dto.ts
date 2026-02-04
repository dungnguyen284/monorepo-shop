export type CreateProductDto = {
	name: string;
	description?: string;
	price: number;
	stock?: number;
	image?: string;
	isActive?: boolean;
	categoryId: number;
};

export type UpdateProductDto = Partial<CreateProductDto>;

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

export type ProductQueryDto = {
	page?: number;
	limit?: number;
	search?: string;
	categoryId?: number;
	minPrice?: number;
	maxPrice?: number;
	isActive?: boolean;
};
