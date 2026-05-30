import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    transpilePackages: ["@greenledger/shared"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
