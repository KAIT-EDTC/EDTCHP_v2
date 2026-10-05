import { getCollection, type CollectionEntry } from 'astro:content';

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

/** 一覧の絞り込み条件。年は1つ、タグは複数（すべてを含む記事に絞る） */
export interface BlogFilter {
    year?: number;
    tags: string[];
}

const byName = (a: string, b: string) => a.localeCompare(b, 'ja');
const yearOf = (post: BlogEntry) => post.data.date.getUTCFullYear();

/** 一覧ページのパス（`/blog/` 以降）。タグは名前順に並べ、同じ絞り込みが同じURLになるようにする */
export function filterSegments({ year, tags }: BlogFilter): string[] {
    return [...(year ? ['year', String(year)] : []), ...(tags.length ? ['tag', ...[...tags].sort(byName)] : [])];
}

export function filterHref(filter: BlogFilter): string {
    return `/blog/${filterSegments(filter).map((s) => `${encodeURIComponent(s)}/`).join('')}`;
}

/**
 * 記事が1件以上ある絞り込み（年 × タグの組み合わせ）をすべて列挙する。
 * 記事ごとに「その記事のタグの部分集合 × 年（指定なし or その記事の年）」を集めるので、
 * 存在しない組み合わせは作られない。
 * ponytail: 1記事のタグ数 n に対して 2^n 通り増える（現状は数個）。タグが10個超の記事が出たら上限を設ける
 */
export function getFilters(posts: BlogEntry[]): (BlogFilter & { items: BlogEntry[] })[] {
    const filters = new Map<string, BlogFilter>();
    for (const post of posts) {
        const tags = [...new Set(post.data.tags)].sort(byName);
        for (let mask = 0; mask < 1 << tags.length; mask++) {
            const subset = tags.filter((_, i) => mask & (1 << i));
            for (const year of [undefined, yearOf(post)]) {
                const filter = { year, tags: subset };
                filters.set(filterHref(filter), filter);
            }
        }
    }
    return [...filters.values()].map((f) => ({
        ...f,
        items: posts.filter((p) => (!f.year || yearOf(p) === f.year) && f.tags.every((t) => p.data.tags.includes(t))),
    }));
}

/** 日付は JST の暦日として扱う（date: 2026-10-17 は UTC 0時にパースされるため UTC で整形すればずれない） */
export function formatDate(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
}
