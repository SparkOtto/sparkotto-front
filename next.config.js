const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
      includePaths: [path.join(__dirname, 'public/styles')],
    },
    env: {
      backendAPI: 'http://localhost:3001',
    },
};
  
module.exports = nextConfig;