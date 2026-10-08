import type { BlogEntry } from './blog.ts';
import { BLOG_SERIES } from './series.ts';

/** セクション（GLOSSARY.md）。/blog/ のカルーセル、/blog/tag/<id>/ のページ、記事詳細のチップになる */
export interface Section {
    id: string;
    label: string;
    intro: string;
    href: string;
}

export interface SectionWithPosts extends Section {
    posts: BlogEntry[];
}

/** 並び順がそのまま表示順。ピックアップ → 種別（BLOG_SERIES の順） */
const DEFS: (Omit<Section, 'href'> & { has: (post: BlogEntry) => boolean })[] = [
    { id: 'pickup', label: 'ピックアップ', intro: 'EDTCの活動の中から、特に読んでほしい記事です。', has: (p) => p.data.pickup },
    ...BLOG_SERIES.map((s) => ({ id: s.id, label: s.label, intro: s.intro, has: (p: BlogEntry) => p.data.series === s.id })),
];

// URL の tag はタグ時代の名残。リンクを壊さないよう変えない
const toSection = ({ id, label, intro }: Omit<Section, 'href'>): Section => ({ id, label, intro, href: `/blog/tag/${id}/` });

/** 記事のあるセクションだけを、属する記事（渡した順のまま）と一緒に返す */
export function getSections(posts: BlogEntry[]): SectionWithPosts[] {
    return DEFS.map((d) => ({ ...toSection(d), posts: posts.filter(d.has) })).filter((s) => s.posts.length > 0);
}

/** 記事が属するセクション（記事詳細のチップ）。並びは getSections と同じ */
export function sectionsOf(post: BlogEntry): Section[] {
    return DEFS.filter((d) => d.has(post)).map(toSection);
}

/** 年度（4月〜翌年3月）。2026-03-31 は 2025年度、2026-04-01 は 2026年度。日付は UTC 0時にパースされるので UTC で数える */
const fiscalYear = (date: Date) => (date.getUTCMonth() >= 3 ? date.getUTCFullYear() : date.getUTCFullYear() - 1);

/** 年度ごとに分ける。年度も記事も渡した順のまま（新しい順で渡せば新しい年度から） */
export function byFiscalYear(posts: BlogEntry[]): { year: number; posts: BlogEntry[] }[] {
    return [...Map.groupBy(posts, (p) => fiscalYear(p.data.date))].map(([year, posts]) => ({ year, posts }));
}
