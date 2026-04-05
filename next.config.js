/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
<<<<<<< HEAD
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
=======
  basePath: '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
>>>>>>> origin/local-preservation
