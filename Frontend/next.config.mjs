/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '9000',
                pathname: '/users/media/avatars/**',
            },
        ],
        unoptimized: true,
        
    },
    reactStrictMode: false,
};

export default nextConfig;
