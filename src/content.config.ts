import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BLOG_TAGS, PRODUCT_TAGS } from './lib/tags';

/**
 * ブログ記事。ダッシュボードが PR で送る content/blog/<YY-MM-DD-slug>/index.md をそのまま受け入れる。
 * 記事ID = フォルダ名。画像は記事フォルダ内に相対パスで置く。
 */
const blog = defineCollection({
    loader: glob({
        pattern: '*/index.md',
        base: './content/blog',
        generateId: ({ entry }) => entry.split('/')[0],
    }),
    schema: ({ image }) =>
        z.object({
            title: z.string().min(1),
            date: z.coerce.date(),
            author: z.string().default(''),
            description: z.string().default(''),
            tags: z.array(z.enum(BLOG_TAGS)).default([]),
            thumbnail: image().optional(),
        }),
});

const products = defineCollection({
    loader: glob({
        pattern: '*.json',
        base: './content/products',
        // ファイル名をそのままIDにする（既定では小文字化される）
        generateId: ({ entry }) => entry.replace(/\.json$/, ''),
    }),
    schema: z.object({
        title: z.string(),
        /** src/assets/products/ 内のファイル名 */
        thumbnail: z.string().optional(),
        caption: z.string().default(''),
        headline: z.string().optional(),
        maker: z.string().optional(),
        price: z.string().optional(),
        target: z.string().optional(),
        tags: z.array(z.enum(PRODUCT_TAGS)).default([]),
        sections: z.array(z.object({ paragraphs: z.array(z.string()).default([]) })).default([]),
    }),
});

export const collections = { blog, products };
