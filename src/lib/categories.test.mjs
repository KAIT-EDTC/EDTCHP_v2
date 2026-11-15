// npm test（node --test）。@types/node を入れずに済むよう .mjs にしている（astro check の型検査の対象外）
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { byFiscalYear, getCategories, categoryHref, categoriesOf } from './categories.ts';

// 日付は frontmatter の date: 2026-06-01 と同じく UTC 0時
const post = (id, date, category, pickup = false) => ({ id, data: { date: new Date(date), category, pickup } });

const a = post('a', '2026-06-01', 'play', true);
const b = post('b', '2026-05-01', 'yugyou');
const c = post('c', '2026-04-01', 'play');

test('カテゴリは ピックアップ → カテゴリの順で、ブログのないものは出さない', () => {
    const categories = getCategories([a, b, c]);
    assert.deepEqual(
        categories.map((c) => [c.id, c.posts.map((p) => p.id)]),
        [
            ['pickup', ['a']],
            ['yugyou', ['b']],
            ['play', ['a', 'c']],
        ],
    );
    assert.deepEqual(
        categories.map((c) => categoryHref(c.id)),
        ['/blog/category/pickup/', '/blog/category/yugyou/', '/blog/category/play/'],
    );
});

test('ブログが属するカテゴリは一覧と同じ順', () => {
    assert.deepEqual(
        categoriesOf(a).map((c) => [c.label, categoryHref(c.id)]),
        [
            ['ピックアップ', '/blog/category/pickup/'],
            ['レク', '/blog/category/play/'],
        ],
    );
    assert.deepEqual(
        categoriesOf(b).map((c) => c.label),
        ['遊行塾'],
    );
});

test('年度は4月始まりで、渡した順のまま分ける', () => {
    const posts = [post('p1', '2026-04-01', 'play'), post('p2', '2026-03-31', 'play'), post('p3', '2025-04-01', 'play'), post('p4', '2025-03-31', 'play')];
    assert.deepEqual(
        byFiscalYear(posts).map((g) => [g.year, g.posts.map((p) => p.id)]),
        [
            [2026, ['p1']],
            [2025, ['p2', 'p3']],
            [2024, ['p4']],
        ],
    );
});
