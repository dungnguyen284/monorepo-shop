import type { UserResponseDto } from "../user/user.response.dto";

export type AuthLoginDto = {
	email: string;
	password: string;
};

export type AuthRegisterDto = {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	address?: string;
};

export type LoginResponseDto = {
	accessToken: string;
};

export type RegisterResponseDto = {
	user: UserResponseDto;
	accessToken: string;
};
