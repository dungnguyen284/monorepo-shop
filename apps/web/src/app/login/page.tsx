"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
	const { login, isLoggingIn, loginError, isAuthenticated } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	// Redirect nếu đã đăng nhập
	if (isAuthenticated) {
		router.push("/");
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			await login({ email, password });
			router.push("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
		}
	};

	return (
		<main className="min-h-screen flex items-center justify-center p-8">
			<div className="w-full max-w-md">
				<h1 className="text-3xl font-bold mb-8 text-center">Đăng nhập</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-1">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="email@example.com"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium mb-1"
						>
							Mật khẩu
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
							required
						/>
					</div>

					{(error || loginError) && (
						<p className="text-red-500 text-sm">
							{error || loginError?.message}
						</p>
					)}

					<button
						type="submit"
						disabled={isLoggingIn}
						className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoggingIn ? "Đang đăng nhập..." : "Đăng nhập"}
					</button>
				</form>

				<p className="mt-4 text-center text-sm">
					Chưa có tài khoản?{" "}
					<Link href="/register" className="text-blue-500 hover:underline">
						Đăng ký
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
