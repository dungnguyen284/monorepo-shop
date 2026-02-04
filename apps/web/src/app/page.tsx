"use client";

import { useAuth } from "@/context/auth.context";
import Link from "next/link";

export default function Home() {
	const { user, isAuthenticated, isLoading, logout } = useAuth();

	if (isLoading) {
		return (
			<main className="min-h-screen flex items-center justify-center">
				<p>Loading...</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen p-8">
			<h1 className="text-3xl font-bold mb-8">Monorepo Shop</h1>

			<div className="mb-8 p-4 border rounded-lg">
				<h2 className="text-xl font-semibold mb-4">Auth Status</h2>
				<p>
					<strong>Authenticated:</strong> {isAuthenticated ? "Yes ✅" : "No ❌"}
				</p>
				{user && (
					<div className="mt-2">
						<p>
							<strong>Email:</strong> {user.email}
						</p>
						<p>
							<strong>User ID:</strong> {user.id}
						</p>
						{user.firstName && (
							<p>
								<strong>Name:</strong> {user.firstName} {user.lastName}
							</p>
						)}
					</div>
				)}
			</div>

			<div className="flex gap-4">
				{isAuthenticated ? (
					<>
						<Link
							href="/dashboard"
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Dashboard
						</Link>
						<button
							onClick={logout}
							className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
						>
							Logout
						</button>
					</>
				) : (
					<>
						<Link
							href="/login"
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Login
						</Link>
						<Link
							href="/register"
							className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
						>
							Register
						</Link>
					</>
				)}
			</div>
		</main>
	);
}
