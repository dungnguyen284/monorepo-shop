export type PaginatedMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
};

export type PaginatedResponse<T = any> = {
	success: true;
	message?: string;
	data: T[];
	meta: PaginatedMeta;
};

export type PaginationQuery = {
	page?: number;
	limit?: number;
};
