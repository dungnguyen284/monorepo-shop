import type {
	ApiResponse,
	AuthLoginDto,
	AuthRegisterDto,
	UserResponseDto,
	LoginResponseDto,
	RegisterResponseDto,
} from "@monorepo-shop/shared";
import { apiClient } from "@/lib/axios";

export const authService = {
	async login(data: AuthLoginDto): Promise<ApiResponse<LoginResponseDto>> {
		const response = await apiClient.post<ApiResponse<LoginResponseDto>>(
			"/auth/login",
			data,
		);
		return response.data;
	},

	async register(
		data: AuthRegisterDto,
	): Promise<ApiResponse<RegisterResponseDto>> {
		const response = await apiClient.post<ApiResponse<RegisterResponseDto>>(
			"/auth/register",
			data,
		);
		return response.data;
	},

	async me(): Promise<ApiResponse<UserResponseDto>> {
		const response =
			await apiClient.get<ApiResponse<UserResponseDto>>("/auth/me");
		return response.data;
	},

	async logout(): Promise<void> {
		if (typeof window !== "undefined") {
			localStorage.removeItem("token");
		}
	},
};
