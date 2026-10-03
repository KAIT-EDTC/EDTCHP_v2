/** ブログのタグ。dashboard の shared/src/blog.ts の BLOG_TAGS と必ず同じにする */
export const BLOG_TAGS = ['ピックアップ', '遊行塾', 'イベント', '対外活動', '遊び'] as const;
export type BlogTag = (typeof BLOG_TAGS)[number];

export const WORK_TAGS = ['小学生', '中学生', '高校生', '全年齢'] as const;
