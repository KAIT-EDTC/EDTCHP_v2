import { getCollection, type CollectionEntry } from 'astro:content';
import { BLOG_TAG_INFO } from './tags';

export type BlogEntry = CollectionEntry<'blog'>;

/** 新しい順の全記事 */
export async function getPosts(): Promise<BlogEntry[]> {
    const posts = await getCollection('blog');
    return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 記事に付いているタグ（使われている数の多い順、同数は名前順） */
export function getTags(posts: BlogEntry[]): string[] {
    const counts = new Map<string, number>();
    for (const tag of posts.flatMap((p) => p.data.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    return [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)! || a.localeCompare(b, 'ja'));
}

export interface BlogSection {
    tag: string;
    slug: string;
    intro?: string;
    posts: BlogEntry[];
}

/** タグ（活動）ごとの記事。並びは BLOG_TAG_INFO の順 → それ以外のタグを使用数順 → タグなしは「その他」 */
export function getSections(posts: BlogEntry[]): BlogSection[] {
    const tags = [...new Set([...Object.keys(BLOG_TAG_INFO), ...getTags(posts)])];
    return [
        ...tags.map((tag) => ({
            tag,
            // ponytail: BLOG_TAG_INFO に無いタグはタグ名がそのままURLになる（/ # ? を含むと引けない）
            slug: BLOG_TAG_INFO[tag]?.slug ?? tag,
            intro: BLOG_TAG_INFO[tag]?.intro,
            posts: posts.filter((p) => p.data.tags.includes(tag)),
        })),
        { tag: 'その他', slug: 'other', posts: posts.filter((p) => p.data.tags.length === 0) },
    ].filter((s) => s.posts.length > 0);
}

/** 日付は JST の暦日として扱う（date: 2026-10-17 は UTC 0時にパースされるため UTC で整形すればずれない） */
export function formatDate(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
}
