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
    学外イベント: { slug: 'offcampus', intro: '大学の外のイベントや施設に出向いて、ロボットの展示や工作教室を行った記録です。' },
    学内イベント: { slug: 'oncampus', intro: '神奈川工科大学のキャンパスで行ったイベントや、学内のサークルとの交流の記録です。' },
    遊び: { slug: 'play', intro: 'メンバー同士の親睦会やレクリエーションの様子です。' },
};

export const WORK_TAGS = ['小学生', '中学生', '高校生', '全年齢'] as const;
