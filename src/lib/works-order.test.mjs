// npm test（node --test）。@types/node を入れずに済むよう .mjs にしている（astro check の型検査の対象外）
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { otherWorks, sortWorks } from './works-order.ts';

const work = (id) => ({ id });

test('一覧の並び順は ORDER の順で、残りは ID 順', () => {
    const works = [work('z'), work('SumoRobot'), work('LineTracer'), work('a')];
    assert.deepEqual(sortWorks(works).map((w) => w.id), ['LineTracer', 'SumoRobot', 'a', 'z']);
});

test('ほかの制作物は一覧で次に並ぶものから順に取得する', () => {
    const works = sortWorks([work('a'), work('b'), work('c'), work('d')]);
    assert.deepEqual(otherWorks(work('a'), works).map((w) => w.id), ['b', 'c', 'd']);
});

test('末尾まで行ったら先頭へ回り込む', () => {
    const works = sortWorks([work('a'), work('b'), work('c'), work('d')]);
    assert.deepEqual(otherWorks(work('d'), works).map((w) => w.id), ['a', 'b', 'c']);
});

test('制作物が 3 件未満でも自分を除いた残りを返す', () => {
    const works = sortWorks([work('a'), work('b')]);
    assert.deepEqual(otherWorks(work('a'), works).map((w) => w.id), ['b']);
});

