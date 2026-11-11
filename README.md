# EDTCHP v2

神奈川工科大学EDTCの公式サイト（https://kaitedtc.com）です。

Astro で生成する静的サイトで、Cloudflare Workers（静的アセット）で配信します。

ブログは [dashboard](https://github.com/KAIT-EDTC/dashboard) で執筆してください。  
(EDTC メンバーは誰でも利用できます！)

## 開発

Node.js 22 以上（`.nvmrc`）。

```sh
npm install
npm run dev        # http://localhost:4321
npm test           # src/**/*.test.mjs（node --test）
npm run build      # 型・コンテンツのチェック（astro check）+ テスト
npx wrangler dev   # 本番と同じ Cloudflare の配信（リダイレクト・404）で dist/ を確認
```

## デプロイ・プレビュー

Cloudflare の Workers Builds（Git 連携）でビルド・デプロイしています。  
main に push することで本番環境に自動でデプロイされます。
また、PR では自動的にプレビューが作成されます。開発メンバー以外にも簡単に共有できます。

## ブログ

ブログは dashboard で書いて提出すると、このリポジトリに PR が作られます。
CI が通り、レビューしてマージすればデプロイで公開されます。(個人情報などの扱いに気をつけること)

現状 HP と dashboard の種別は手動で合わせているので、種別の追加・削除・更新の際は両方を直してください。(HPは `src/lib/series.ts`、 dashboard は `shared/src/blog.ts` 参照)  
(今後解決策を考えたい。)

ブログのメタ情報は フロントマター で書きます。

```markdown
---
title: "第5回 遊行塾ではんだ付けに挑戦！"
date: 2026-11-11
author: "神工　太郎"
description: "一覧やOGPに出る概要"
series: yugyou                  # イベント種別（必須）。現在は、yugyou / offcampus / oncampus / play のいずれか
pickup: true                    # trueであればブログトップの「ピックアップ」に掲載されます。
thumbnail: ./img-k3x9a0qz.webp
---

```

ブログごとに種別（`series`）を1つ選ぶ。種別は現状 4 つで、遊行塾・レク以外は学内か学外かで選びます。

  | 種別 | 表示名 | 内容 |
  | --- | --- | --- |
  | `yugyou` | 遊行塾 | 藤嶺学園藤沢中学校での授業 |
  | `offcampus` | 学外イベント | 大学の外のイベント・施設での活動 |
  | `oncampus` | 学内イベント | キャンパスでのイベント、学内サークルとの交流 |
  | `play` | レク | 親睦会・レクリエーション |


