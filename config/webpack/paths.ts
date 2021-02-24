import path from 'path';

const basePath = path.resolve(__dirname, '../../');

const base = <T extends string>(path: T) => `${basePath}/${path}` as const;

export default {
  distDir: base('dist'),
  appDir: base('src'),
  appIndexFile: base('src/index.ts'),
  appIndexHtml: base('src/index.html'),
  serverDistDir: base('dist/server'),
  configDir: base('config'),
};
