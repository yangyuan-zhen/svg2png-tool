/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/svg2png-tool' : '',
  assetPrefix: isGithubPages ? '/svg2png-tool/' : '',
  trailingSlash: true, // 避免刷新路径 404
};

module.exports = nextConfig;
