import { z } from "zod";

// Login
export const loginSchema = z.object({
	email: z.string().email("Email không hợp lệ"),
	password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export type AuthLoginDto = z.infer<typeof loginSchema>;

// Register
export const registerSchema = z.object({
	email: z.string().email("Email không hợp lệ"),
	password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
	firstName: z.string().max(50).optional(),
	lastName: z.string().max(50).optional(),
	phone: z.string().max(20).optional(),
	address: z.string().max(255).optional(),
});

export type AuthRegisterDto = z.infer<typeof registerSchema>;
