export type ApiResponse<T = any> = {
	success: boolean;
	message?: string;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: any;
	};
};

export type ApiSuccessResponse<T = any> = {
	success: true;
	message?: string;
	data: T;
};

export type ApiErrorResponse = {
	success: false;
	message: string;
	error: {
		code: string;
		message: string;
		details?: any;
	};
};
