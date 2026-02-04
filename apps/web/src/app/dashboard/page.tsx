"use client";

import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardPage() {
	const { user, isAuthenticated, isLoading, logout } = useAuth();
	const router = useRouter();

	// Redirect về login nếu chưa đăng nhập
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isLoading, isAuthenticated, router]);

	if (isLoading) {
		return (
			<main className="min-h-screen flex items-center justify-center">
				<p>Loading...</p>
			</main>
		);
	}

	if (!isAuthenticated || !user) {
		return null;
	}

	return (
		<main className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<div className="flex gap-4">
						<Link href="/" className="text-blue-500 hover:underline">
							Trang chủ
						</Link>
						<button onClick={logout} className="text-red-500 hover:underline">
							Đăng xuất
						</button>
					</div>
				</div>

				<div className="grid gap-6">
					{/* User Info Card */}
					<div className="p-6 border rounded-lg bg-white shadow-sm">
						<h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>
						<div className="space-y-2">
							<p>
								<strong>ID:</strong> {user.id}
							</p>
							<p>
								<strong>Email:</strong> {user.email}
							</p>
							{user.firstName && (
								<p>
									<strong>Họ tên:</strong> {user.firstName} {user.lastName}
								</p>
							)}
							{user.phone && (
								<p>
									<strong>SĐT:</strong> {user.phone}
								</p>
							)}
							{user.address && (
								<p>
									<strong>Địa chỉ:</strong> {user.address}
								</p>
							)}
							<p>
								<strong>Role ID:</strong> {user.roleId}
							</p>
							<p>
								<strong>Ngày tạo:</strong>{" "}
								{new Date(user.createdAt).toLocaleDateString("vi-VN")}
							</p>
						</div>
					</div>

					{/* Auth State Debug */}
					<div className="p-6 border rounded-lg bg-gray-50">
						<h2 className="text-xl font-semibold mb-4">Debug Auth State</h2>
						<pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
							{JSON.stringify(
								{
									isAuthenticated,
									isLoading,
									user,
									token:
										typeof window !== "undefined"
											? localStorage.getItem("token")?.substring(0, 20) + "..."
											: null,
								},
								null,
								2,
							)}
						</pre>
					</div>
				</div>
			</div>
		</main>
	);
}
