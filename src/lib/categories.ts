import type { BlogEntry } from './blog.ts';

/**
 * ブログのカテゴリ(ブログごとに 1 つ)
 * dashboard の shared/src/blog.ts の BLOG_CATEGORIES と必ず同じにする（変更するときは両方のリポジトリを直す）。
 */
export const BLOG_CATEGORIES = [
    {
        id: 'yugyou',
        label: '遊行塾',
        intro: '藤嶺学園藤沢中学校で行う全10回のロボット工作授業。はんだ付けからArduinoのプログラミングまで、中学生と一緒にライントレーサーを作ります。',
    },
    { id: 'offcampus', label: '学外イベント', intro: '大学の外のイベントや施設に出向いて、ロボットの展示や工作教室を行った記録です。' },
    { id: 'oncampus', label: '学内イベント', intro: '神奈川工科大学のキャンパスで行ったイベントや、学内のサークルとの交流の記録です。' },
    { id: 'play', label: 'レク', intro: 'メンバー同士の親睦会やレクリエーションの様子です。' },
] as const;

export type BlogCategoryId = (typeof BLOG_CATEGORIES)[number]['id'];
export const BLOG_CATEGORY_IDS = BLOG_CATEGORIES.map((c) => c.id) as [BlogCategoryId, ...BlogCategoryId[]];

/** 一覧に出すブログのまとまり。*/
export interface Category {
    id: string;
    label: string;
    intro: string;
}

export interface CategoryWithPosts extends Category {
    posts: BlogEntry[];
}

const PICKUP: Category = { id: 'pickup', label: 'ピックアップ', intro: 'EDTCの活動の中から、特に読んでほしい記事です。' };

// この配列の順がフロントの並び順になるので、ピックアップが一番上であとは BLOG_CATEGORIES の順にする
const CATEGORIES: Category[] = [PICKUP, ...BLOG_CATEGORIES];

/** ピックアップだけは frontmatter の pickup で個別に指定する。(他は category で指定する) */
const belongsTo = (post: BlogEntry, category: Category) => (
    category === PICKUP
    ? post.data.pickup
    : post.data.category === category.id
);

export const categoryHref = (id: string) => `/blog/category/${id}/`;

/** 合致するカテゴリとブログをセットで返す。 */
export function getCategories(posts: BlogEntry[]): CategoryWithPosts[] {
    return CATEGORIES
        .map((category) => ({ ...category, posts: posts.filter((post) => belongsTo(post, category)) }))
        // そもそもブログがないカテゴリは出すべきではないが念の為(カテゴリが孤立している場合は削除対象)
        .filter((c) => c.posts.length > 0);
}

/** ブログが属するカテゴリを返す。 */
export function categoriesOf(post: BlogEntry): Category[] {
    return CATEGORIES.filter((category) => belongsTo(post, category));
}

/** 年度（4月〜翌年3月）。2026-03-31 は 2025年度、2026-04-01 は 2026年度。日付は UTC 0時にパースされるので UTC で数える */
const fiscalYear = (date: Date) => (date.getUTCMonth() >= 3 ? date.getUTCFullYear() : date.getUTCFullYear() - 1);

/** 年度ごとに分ける。年度もブログも渡した順のまま（新しい順で渡せば新しい年度から） */
export function byFiscalYear(posts: BlogEntry[]): { year: number; posts: BlogEntry[] }[] {
    return [...Map.groupBy(posts, (p) => fiscalYear(p.data.date))].map(([year, posts]) => ({ year, posts }));
}
