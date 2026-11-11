# 開発ルール

コードを書くときの決まりごと。開発手順・構成・記事の書き方は [README.md](README.md)、用語は [GLOSSARY.md](GLOSSARY.md) を見る。

## コンポーネント

- 1コンポーネント = 1つの `.astro`。マークアップ、scoped `<style>`、必要なら `<script>` を同じファイルに書く。`src/scripts/` は使わない。
- グローバル CSS は `src/styles/global.css` の1枚だけ。import するのは `src/layouts/Base.astro` だけで、ページやコンポーネントから CSS ファイルを import しない。
- ページの背景色は `Base` の `background` prop で決める。

## CSS

- クラス名は英語のケバブケース（`card-title`、`button-outline`）。
  - BEM の `__` `--` は使わない。
  - ローマ字、snake_case、ID セレクタ、`.title` のような汎用名は使わない。
  - ブロック名はコンポーネント名に合わせる（`Card.astro` なら `card`、`card-title`）。
- 状態は `aria-*` 属性か `is-*` クラスで表す。JS から要素を引くときは `data-*` 属性を使う（クラス名に依存しない）。
- 色・角丸・影・レイアウト幅は `global.css` の `:root` にあるトークンを使い、値を直書きしない。
  - `--color-*` `--radius-*` `--shadow-*` `--layout-*`
- 共通クラスがあるものは作り直さない: `.container` `.button` `.button-outline` `.panel` `.chips` `.chip` `.card-grid` `.prose`
- メディアクエリのブレークポイントは `600px` と `900px` の2つ。
- インライン `style` は CSS 変数を渡す `style="--x: …"` だけにする。

## コメント

- 日本語で、コードを読んでも分からない「なぜ」だけを書く。何をしているかの説明は書かない。

## Git

- ブランチは `fami-gb/<topic>`。
- コミットメッセージは日本語の [Conventional Commits](https://www.conventionalcommits.org/ja/)。type と scope は英語のまま。
  - 例: `fix(hero): 画面幅に合わせて高さを調整`
- main へは PR 経由でマージする。PR は `npm run build`（Cloudflare のビルド）が通ってから。
- PR 本文は日本語で書く。
