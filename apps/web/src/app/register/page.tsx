"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
	const { register, isRegistering, registerError, isAuthenticated } = useAuth();
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
	});
	const [error, setError] = useState("");

	// Redirect nếu đã đăng nhập
	if (isAuthenticated) {
		router.push("/");
		return null;
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Mật khẩu xác nhận không khớp");
			return;
		}

		try {
			await register({
				email: formData.email,
				password: formData.password,
				firstName: formData.firstName || undefined,
				lastName: formData.lastName || undefined,
			});
			router.push("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Đăng ký thất bại");
		}
	};

	return (
		<main className="min-h-screen flex items-center justify-center p-8">
			<div className="w-full max-w-md">
				<h1 className="text-3xl font-bold mb-8 text-center">Đăng ký</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="firstName"
								className="block text-sm font-medium mb-1"
							>
								Họ
							</label>
							<input
								id="firstName"
								name="firstName"
								type="text"
								value={formData.firstName}
								onChange={handleChange}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
								placeholder="Nguyễn"
							/>
						</div>
						<div>
							<label
								htmlFor="lastName"
								className="block text-sm font-medium mb-1"
							>
								Tên
							</label>
							<input
								id="lastName"
								name="lastName"
								type="text"
								value={formData.lastName}
								onChange={handleChange}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
								placeholder="Văn A"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-1">
							Email *
						</label>
						<input
							id="email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
							placeholder="email@example.com"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium mb-1"
						>
							Mật khẩu *
						</label>
						<input
							id="password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
							placeholder="••••••••"
							required
							minLength={6}
						/>
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium mb-1"
						>
							Xác nhận mật khẩu *
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							value={formData.confirmPassword}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
							placeholder="••••••••"
							required
						/>
					</div>

					{(error || registerError) && (
						<p className="text-red-500 text-sm">
							{error || registerError?.message}
						</p>
					)}

					<button
						type="submit"
						disabled={isRegistering}
						className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isRegistering ? "Đang đăng ký..." : "Đăng ký"}
					</button>
				</form>

				<p className="mt-4 text-center text-sm">
					Đã có tài khoản?{" "}
					<Link href="/login" className="text-blue-500 hover:underline">
						Đăng nhập
					</Link>
				</p>

				<Link
					href="/"
					className="block mt-4 text-center text-sm text-gray-500 hover:underline"
				>
					← Quay lại trang chủ
				</Link>
			</div>
		</main>
	);
}
