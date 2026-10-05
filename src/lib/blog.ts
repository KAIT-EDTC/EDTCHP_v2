import { getCollection, type CollectionEntry } from 'astro:content';
import { BLOG_SERIES } from './tags';

export type BlogEntry = CollectionEntry<'blog'>;

/** 新しい順の全記事 */
export async function getPosts(): Promise<BlogEntry[]> {
    const posts = await getCollection('blog');
    return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export interface BlogSection {
    tag: string;
    slug: string;
    intro?: string;
    posts: BlogEntry[];
}

/** 一覧のセクション。ピックアップ → 種別（BLOG_SERIES の順）。記事のないセクションは出さない */
export function getSections(posts: BlogEntry[]): BlogSection[] {
    return [
        { tag: 'ピックアップ', slug: 'pickup', intro: 'EDTCの活動の中から、特に読んでほしい記事です。', posts: posts.filter((p) => p.data.pickup) },
        ...BLOG_SERIES.map((s) => ({ tag: s.label, slug: s.id, intro: s.intro, posts: posts.filter((p) => p.data.series === s.id) })),
    ].filter((s) => s.posts.length > 0);
}

/** 年度（4月〜翌年3月）。2026-03-31 は 2025年度、2026-04-01 は 2026年度。日付は UTC 0時にパースされるので UTC で数える */
export function fiscalYear(date: Date): number {
    return date.getUTCMonth() >= 3 ? date.getUTCFullYear() : date.getUTCFullYear() - 1;
}

/** 日付は JST の暦日として扱う（date: 2026-10-17 は UTC 0時にパースされるため UTC で整形すればずれない） */
export function formatDate(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
}

/** 関連記事: 同じ種別を先に、同じ並びの中では実施日が近い順 */
export function relatedPosts(post: BlogEntry, posts: BlogEntry[], count = 4): BlogEntry[] {
    const shared = (p: BlogEntry) => (p.data.series === post.data.series ? 1 : 0);
    const distance = (p: BlogEntry) => Math.abs(p.data.date.valueOf() - post.data.date.valueOf());
    return posts
        .filter((p) => p.id !== post.id)
        .sort((a, b) => shared(b) - shared(a) || distance(a) - distance(b))
        .slice(0, count);
}
