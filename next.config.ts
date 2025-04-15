/** @type {import('next').NextConfig} */
const isGithubPages = process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  // 如果你的仓库名不是根域名，需要设置 basePath 和 assetPrefix
  basePath: isGithubPages ? '/svg2png-tool' : '',
  assetPrefix: isGithubPages ? '/svg2png-tool/' : '',
};

module.exports = nextConfig;
