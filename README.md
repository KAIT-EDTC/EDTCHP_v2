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
  works/<ID>/index.md      # 制作物（教材・ロボット）＋画像
src/
  content.config.ts        # 記事・制作物のスキーマ（frontmatter の検証）
  lib/tags.ts              # ブログの種別 BLOG_SERIES（URL・並び順・説明文。dashboard と同期する）
  lib/blog.ts              # 記事の取得、一覧のセクション分け、年度の計算
  pages/                   # 1ファイル = 1URL
    index.astro            # /
    about.astro            # /about/
    blog/index.astro       # /blog/                種別ごとのセクション（横に送れるカルーセル）
    blog/tag/[slug].astro  # /blog/tag/<種別>/     種別（とピックアップ）の全記事を年度別に
    blog/[id].astro        # /blog/<記事ID>/
    works/…                # /works/, /works/<ID>/（旧 /products/ は _redirects で転送）
    contact.astro          # /contact/             Googleフォーム
  components/ layouts/     # ヘッダー・フッター・共通の <head>
  scripts/                 # クライアントJS（トップのスライダー）。ブログ一覧のカルーセルは pages/blog/index.astro 内
  styles/                  # 旧サイトのCSSを引き継いだもの
  assets/                  # サイトで使う画像（ビルド時に最適化される）
public/                    # そのまま配信するファイル（favicon, _redirects, 旧URLの転送ページ）
```

## ブログ

記事は dashboard で書いて「提出」すると、このリポジトリに PR が作られる。CI（`npm run build`）が通り、レビューしてマージすれば main へのデプロイで公開される。

```
content/blog/26-10-17-yugyou/       # 記事ID = YY-MM-DD-種別（同じ日・同じ種別の2件目以降は -2, -3…）
├── index.md                        # URL は /blog/26-10-17-yugyou/
└── img-k3x9a0qz.webp
```

```markdown
---
title: "第5回 遊行塾ではんだ付けに挑戦！"
date: 2026-10-17
author: "山田　太郎"
description: "一覧やOGPに出る概要"
series: yugyou                  # 種別（必須）。yugyou / offcampus / oncampus / play
pickup: true                    # 「ピックアップ」に載せるときだけ
thumbnail: ./img-k3x9a0qz.webp
---

本文（GFM）。画像は ![説明](./img-xxxx.webp) のように記事フォルダ内を相対パスで参照する。
```

- 記事ごとに種別（`series`）を1つ選ぶ。種別は固定の4つで、遊行塾・レク以外は学内か学外かで選ぶ

  | `series` | 表示名 | 内容 |
  | --- | --- | --- |
  | `yugyou` | 遊行塾 | 藤嶺学園藤沢中学校での授業 |
  | `offcampus` | 学外イベント | 大学の外のイベント・施設での活動 |
  | `oncampus` | 学内イベント | キャンパスでのイベント、学内サークルとの交流 |
  | `play` | レク | 親睦会・レクリエーション |

- `pickup: true` の記事は、`/blog/` の「ピックアップ」セクションにも載る
- **種別を増やす・変えるときは、`src/lib/tags.ts` の `BLOG_SERIES` と、dashboard の `shared/src/blog.ts` の `BLOG_SERIES` の両方を直す**（管理画面はない）。`series` は `BLOG_SERIES` の id で検証するので、片方だけだとビルドが落ちる
- 旧ルールの記事ID（`26-05-16-yugyou01` のような `YY-MM-DD-slug`）もそのまま使える。`series` はフォルダ名と別に frontmatter に持つ
- ブログ一覧は `/blog/` で種別ごとのセクションに分け、新しい順に最大12件を横に送れるカルーセルで見せる。全記事は「年度別に見る」の `/blog/tag/<種別>/` で、年度（4月〜翌年3月）ごとの見出しで並ぶ。URL のスラッグは種別の id（ピックアップは `pickup`）
- 記事の正は dashboard。PR上で直接直しても、再提出で上書きされる
- 手で記事を書く場合も同じ形式でよい

旧サイトの JSON 記事は `scripts/migrate-legacy-blog.mjs` でこの形式に変換済み。

## 制作物

ブログと同じく Markdown。ID = フォルダ名（URL は /works/<ID>/）。一覧は全件を並べ（絞り込みはない）、並び順は `src/lib/works.ts` の `ORDER`。

```markdown
---
title: "ぶるぶるくん"
description: "一覧やOGPに出る概要"
headline: "詳細ページのリード文"
maker: "製作者"
age: 小学生                 # 対象年齢（任意の文字列）。詳細ページの情報欄にだけ表示する
capacity: "10人ほど"        # 対応人数（任意）
duration: "1時間ほど"       # 授業時間（任意）
thumbnail: ./buruburu.webp
images: [./buruburu-single.webp]   # 2枚目以降（任意）。あるとサムネイルと一緒にスライダーになる
---

本文（GFM）。注意書きは > で囲むと目立つ枠になる。
```

## デプロイ

Cloudflare の Workers Builds（Git 連携）でビルド・デプロイする。GitHub Actions は使わない。デプロイ先は dashboard と同じ団体の Cloudflare アカウント（kait.edtc@gmail.com）で、`wrangler.jsonc` の `account_id` で固定している。

- **main に push（PR をマージ）**: `npm run build` → `npx wrangler deploy` で本番に反映
- **それ以外のブランチ・PR**: `npx wrangler preview`（Previews）で本番に出ないプレビューを作り、プレビューURLを PR のコメントとチェックに出す。ダッシュボードから来た記事PRも、マージ前に実際のページで確認できる
- ビルド（`astro check` を含む）が失敗すると PR のチェックが赤くなる。記事の frontmatter の不備などはここで分かる

設定は Cloudflare ダッシュボードの Workers & Pages → `edtc-homepage` → Settings → Builds にある（Build command: `npm run build` / Deploy command: `npx wrangler deploy` / Non-production branch deploy command: `npx wrangler preview`）。`wrangler preview` のために `wrangler.jsonc` に空の `previews` ブロックを置いている。

手元からデプロイする場合は `npx wrangler login`（団体アカウント）のうえで `npm run deploy`。

**公開URL**: 当面は `https://edtc-homepage.kait-edtc.workers.dev`。`kaitedtc.com` の DNS はさくらインターネットにあるため、Cloudflare にゾーンを移してから `wrangler.jsonc` の `workers_dev` を外し `routes`（`custom_domain: true`）を追加する。旧URL（`base.html`, `blog-post.html?id=…` など）は `public/_redirects` と `public/*-post.html` で新URLに転送する。
