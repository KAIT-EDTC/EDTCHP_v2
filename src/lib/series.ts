/**
 * ブログの種別（記事ごとに1つ。記事IDの末尾と /blog/tag/<id>/ のURLになる）。並び順がそのまま一覧の表示順（ピックアップの次から。sections.ts）。
 * dashboard の shared/src/blog.ts の BLOG_SERIES と必ず同じにする（増やすときは両方のリポジトリを直す）。
 */
export const BLOG_SERIES = [
    {
        id: 'yugyou',
        label: '遊行塾',
        intro: '藤嶺学園藤沢中学校で行う全10回のロボット工作授業。はんだ付けからArduinoのプログラミングまで、中学生と一緒にライントレーサーを作ります。',
    },
    { id: 'offcampus', label: '学外イベント', intro: '大学の外のイベントや施設に出向いて、ロボットの展示や工作教室を行った記録です。' },
    { id: 'oncampus', label: '学内イベント', intro: '神奈川工科大学のキャンパスで行ったイベントや、学内のサークルとの交流の記録です。' },
    { id: 'play', label: 'レク', intro: 'メンバー同士の親睦会やレクリエーションの様子です。' },
] as const;

export type BlogSeriesId = (typeof BLOG_SERIES)[number]['id'];
export const BLOG_SERIES_IDS = BLOG_SERIES.map((s) => s.id) as [BlogSeriesId, ...BlogSeriesId[]];
