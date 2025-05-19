const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
      includePaths: [path.join(__dirname, 'public/styles')],
    },
    env: {
      backendAPI: 'http://192.168.207.89:3001',
    },
};
  
module.exports = nextConfig;