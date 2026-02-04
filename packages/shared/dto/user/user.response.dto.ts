export type UserResponseDto = {
	id: number;
	email: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	address?: string;
	roleId: number;
	createdAt: Date;
	updatedAt: Date;
};

export type AuthenticatedUserDto = {
	id: number;
	email: string;
};
