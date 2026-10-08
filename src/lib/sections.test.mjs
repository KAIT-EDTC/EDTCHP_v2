// npm test（node --test）。@types/node を入れずに済むよう .mjs にしている（astro check の型検査の対象外）
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { byFiscalYear, getSections, sectionsOf } from './sections.ts';

// 日付は frontmatter の date: 2026-06-01 と同じく UTC 0時
const post = (id, date, series, pickup = false) => ({ id, data: { date: new Date(date), series, pickup } });

const a = post('a', '2026-06-01', 'play', true);
const b = post('b', '2026-05-01', 'yugyou');
const c = post('c', '2026-04-01', 'play');

test('セクションは ピックアップ → 種別の順で、記事のないものは出さない', () => {
    const sections = getSections([a, b, c]);
    assert.deepEqual(
        sections.map((s) => [s.id, s.posts.map((p) => p.id)]),
        [
            ['pickup', ['a']],
            ['yugyou', ['b']],
            ['play', ['a', 'c']],
        ],
    );
    assert.deepEqual(
        sections.map((s) => s.href),
        ['/blog/tag/pickup/', '/blog/tag/yugyou/', '/blog/tag/play/'],
    );
});

test('記事が属するセクションは一覧と同じ順', () => {
    assert.deepEqual(
        sectionsOf(a).map((s) => [s.label, s.href]),
        [
            ['ピックアップ', '/blog/tag/pickup/'],
            ['レク', '/blog/tag/play/'],
        ],
    );
    assert.deepEqual(
        sectionsOf(b).map((s) => s.label),
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
