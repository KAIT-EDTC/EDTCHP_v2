# EDTCHP v2

神奈川工科大学EDTCの公式サイト（https://kaitedtc.com）。[Astro](https://astro.build) で生成する静的サイトで、Cloudflare Workers（静的アセット）で配信する。

メンバー専用機能（ログイン・イベント・ブログ執筆など）は [dashboard](https://github.com/KAIT-EDTC/dashboard) が担当し、このリポジトリには動的な処理を持たない。

## 開発

Node.js 22 以上（`.nvmrc`）。

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # 型・コンテンツのチェック（astro check）+ dist/ に出力
npm run preview    # dist/ を確認
npx wrangler dev   # 本番と同じ Cloudflare の配信（リダイレクト・404）で dist/ を確認
```

## 構成

```
content/
  blog/<記事ID>/index.md   # ブログ記事（dashboard がPRで追加する）＋画像
  products/<ID>.json       # プロダクト
src/
  content.config.ts        # 記事・プロダクトのスキーマ（frontmatter の検証）
  lib/tags.ts              # タグの語彙（dashboard と同期する）
  pages/                   # 1ファイル = 1URL
    index.astro            # /
    about.astro            # /about/
    blog/index.astro       # /blog/          一覧（年・タグの絞り込みはクライアント側）
    blog/[id].astro        # /blog/<記事ID>/
    products/…             # /products/, /products/<ID>/
    contact.astro          # /contact/       Googleフォーム
  components/ layouts/     # ヘッダー・フッター・共通の <head>
  styles/                  # 旧サイトのCSSを引き継いだもの
  assets/                  # サイトで使う画像（ビルド時に最適化される）
public/                    # そのまま配信するファイル（favicon, _redirects, 旧URLの転送ページ）
```

## ブログ

記事は dashboard で書いて「提出」すると、このリポジトリに PR が作られる。CI（`npm run build`）が通り、レビューしてマージすれば main へのデプロイで公開される。

```
content/blog/26-10-17-yugyou05/     # 記事ID = YY-MM-DD-slug（URL は /blog/26-10-17-yugyou05/）
├── index.md
└── img-k3x9a0qz.webp
```

```markdown
---
title: "第5回 遊行塾ではんだ付けに挑戦！"
date: 2026-10-17
author: "山田　太郎"
description: "一覧やOGPに出る概要"
tags: ["遊行塾"]
thumbnail: ./img-k3x9a0qz.webp
---

本文（GFM）。画像は ![説明](./img-xxxx.webp) のように記事フォルダ内を相対パスで参照する。
```

- `tags` は `src/lib/tags.ts` の `BLOG_TAGS` のみ。**タグを増やすときは dashboard の `shared/src/blog.ts` と両方を変える**（片方だけだとビルドが落ちる）
- 記事の正は dashboard。PR上で直接直しても、再提出で上書きされる
- 手で記事を書く場合も同じ形式でよい

旧サイトの JSON 記事は `scripts/migrate-legacy-blog.mjs` でこの形式に変換済み。

## デプロイ

main に push（PR をマージ）すると GitHub Actions がビルドして `wrangler deploy` する（`.github/workflows/ci.yml`）。デプロイ先は dashboard と同じ団体の Cloudflare アカウント（kait.edtc@gmail.com）で、`wrangler.jsonc` の `account_id` で固定している。

**初回のみ**

1. 団体アカウントで Cloudflare にログインし、My Profile → API Tokens →「Edit Cloudflare Workers」テンプレートでトークンを作る（Account Resources は団体アカウントのみ）
2. GitHub のリポジトリ Settings → Environments に `production` を作り、Secret `CLOUDFLARE_API_TOKEN` に登録

手元からデプロイする場合は `npx wrangler login`（団体アカウント）のうえで `npm run deploy`。

**公開URL**: 当面は `https://edtc-homepage.kait-edtc.workers.dev`。`kaitedtc.com` の DNS はさくらインターネットにあるため、Cloudflare にゾーンを移してから `wrangler.jsonc` の `workers_dev` を外し `routes`（`custom_domain: true`）を追加する。旧URL（`base.html`, `blog-post.html?id=…` など）は `public/_redirects` と `public/*-post.html` で新URLに転送する。
