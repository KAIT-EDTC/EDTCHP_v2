import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

/** 新しい順の全記事 */
export async function getPosts(): Promise<BlogEntry[]> {
    const posts = await getCollection('blog');
    return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 日付は JST の暦日として扱う（date: 2026-10-17 は UTC 0時にパースされるため UTC で整形すればずれない） */
export function formatDate(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
}
