import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    transpilePackages: ["@greenledger/shared"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
        formats: ["image/avif", "image/webp"],
    },
    experimental: {
        optimizePackageImports: [
            "framer-motion",
            "recharts",
            "react-icons",
            "date-fns",
            "react-select",
            "ogl",
            "@material-symbols/font-400",
        ],
    },
};

export default nextConfig;