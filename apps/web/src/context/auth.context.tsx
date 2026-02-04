"use client";

import {
	createContext,
	useContext,
	useCallback,
	useMemo,
	type ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
	AuthLoginDto,
	AuthRegisterDto,
	UserResponseDto,
} from "@monorepo-shop/shared";
import { authService } from "@/services/auth.service";

type AuthContextType = {
	user: UserResponseDto | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (data: AuthLoginDto) => Promise<void>;
	register: (data: AuthRegisterDto) => Promise<void>;
	logout: () => Promise<void>;
	loginError: Error | null;
	registerError: Error | null;
	isLoggingIn: boolean;
	isRegistering: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_QUERY_KEY = ["auth", "me"];

export function AuthProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();

	// Query để lấy thông tin user hiện tại
	const {
		data: user,
		isLoading,
		isError,
	} = useQuery({
		queryKey: AUTH_QUERY_KEY,
		queryFn: async () => {
			const token =
				typeof window !== "undefined" ? localStorage.getItem("token") : null;
			if (!token) return null;

			const response = await authService.me();
			if (response.success && response.data) {
				return response.data;
			}
			return null;
		},
		retry: false,
		staleTime: 5 * 60 * 1000, // 5 phút
	});

	// Mutation đăng nhập
	const loginMutation = useMutation({
		mutationFn: authService.login,
		onSuccess: (response) => {
			if (response.success && response.data) {
				localStorage.setItem("token", response.data.accessToken);
				// Refetch user data sau khi có token
				queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
			}
		},
	});

	// Mutation đăng ký
	const registerMutation = useMutation({
		mutationFn: authService.register,
		onSuccess: (response) => {
			if (response.success && response.data) {
				localStorage.setItem("token", response.data.accessToken);
				queryClient.setQueryData(AUTH_QUERY_KEY, response.data.user);
			}
		},
	});

	// Hàm đăng nhập
	const login = useCallback(
		async (data: AuthLoginDto) => {
			const response = await loginMutation.mutateAsync(data);
			if (!response.success) {
				throw new Error(response.error?.message || "Đăng nhập thất bại");
			}
		},
		[loginMutation],
	);

	// Hàm đăng ký
	const register = useCallback(
		async (data: AuthRegisterDto) => {
			const response = await registerMutation.mutateAsync(data);
			if (!response.success) {
				throw new Error(response.error?.message || "Đăng ký thất bại");
			}
		},
		[registerMutation],
	);

	// Hàm đăng xuất
	const logout = useCallback(async () => {
		await authService.logout();
		queryClient.setQueryData(AUTH_QUERY_KEY, null);
		queryClient.clear();
	}, [queryClient]);

	const value = useMemo(
		() => ({
			user: user ?? null,
			isLoading,
			isAuthenticated: !!user && !isError,
			login,
			register,
			logout,
			loginError: loginMutation.error,
			registerError: registerMutation.error,
			isLoggingIn: loginMutation.isPending,
			isRegistering: registerMutation.isPending,
		}),
		[
			user,
			isLoading,
			isError,
			login,
			register,
			logout,
			loginMutation.error,
			loginMutation.isPending,
			registerMutation.error,
			registerMutation.isPending,
		],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
