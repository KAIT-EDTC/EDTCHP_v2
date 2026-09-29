import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://kaitedtc.com',
    output: 'static',
    trailingSlash: 'always',
    build: { format: 'directory' },
    image: {
        // Markdown 本文の画像も srcset 付きで縮小して出力する（元画像は最大1600px想定だが旧記事は大きいものがある）
        layout: 'constrained',
    },
});
