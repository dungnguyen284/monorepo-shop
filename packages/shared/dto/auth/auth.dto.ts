import type { UserResponseDto } from "../user/user.response.dto";

// Re-export types from schemas for backward compatibility
export type { AuthLoginDto, AuthRegisterDto } from "../../schemas/auth.schema";

export type LoginResponseDto = {
	accessToken: string;
};

export type RegisterResponseDto = {
	user: UserResponseDto;
	accessToken: string;
};
