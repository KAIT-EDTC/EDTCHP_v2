/**
 * ブログのタグごとの一覧ページ（/blog/tag/<slug>/）のURLと説明文。キーの順がセクションの並び順。
 * タグ自体はダッシュボードで管理者が増減するので、ここに無いタグも説明文なし・タグ名のURLで後ろに並ぶ（検証には使わない）。
 */
export const BLOG_TAG_INFO: Record<string, { slug: string; intro: string }> = {
    ピックアップ: { slug: 'pickup', intro: 'EDTCの活動の中から、特に読んでほしい記事です。' },
    遊行塾: {
        slug: 'yugyou',
        intro: '藤嶺学園藤沢中学校で行う全10回のロボット工作授業。はんだ付けからArduinoのプログラミングまで、中学生と一緒にライントレーサーを作ります。',
    },
    対外活動: { slug: 'outreach', intro: '学外のイベントや施設に出向き、ロボットの展示や工作教室を行っています。' },
    イベント: { slug: 'event', intro: '地域のお祭りや学内外のイベントへの参加・お手伝いの記録です。' },
    遊び: { slug: 'play', intro: 'メンバー同士の親睦会やレクリエーションの様子です。' },
};

export const WORK_TAGS = ['小学生', '中学生', '高校生', '全年齢'] as const;
