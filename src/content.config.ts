import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BLOG_TAGS, WORK_TAGS } from './lib/tags';

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

/** 制作物。content/works/<ID>/index.md。ID = フォルダ名（旧 /products/<ID>/ と同じ） */
const works = defineCollection({
    loader: glob({
        pattern: '*/index.md',
        base: './content/works',
        generateId: ({ entry }) => entry.split('/')[0],
    }),
    schema: ({ image }) =>
        z.object({
            title: z.string().min(1),
            description: z.string().default(''),
            headline: z.string().optional(),
            maker: z.string().optional(),
            tags: z.array(z.enum(WORK_TAGS)).default([]),
            capacity: z.string().optional(),
            duration: z.string().optional(),
            thumbnail: image().optional(),
            images: z.array(image()).default([]), // サムネイルに続けて上のスライダーに並ぶ
        }),
});

export const collections = { blog, works };
