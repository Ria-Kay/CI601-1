/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    trailingSlash: false, // Ensures Vercel does not append .html
    output: "standalone", // Forces Vercel to use SSR instead of static HTML export
    experimental: {
        appDir: false, // Ensures proper routing
      }

};
  
  module.exports = nextConfig;

  
//check the stack overflow
