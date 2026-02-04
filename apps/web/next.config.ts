import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	transpilePackages: ["@monorepo-shop/shared"],
	reactCompiler: true,
};

export default nextConfig;
