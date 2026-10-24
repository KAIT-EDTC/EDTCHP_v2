import type { Work } from './works.ts';

/** 一覧の並び順は従来どおり（新しいものが上）。ここに無いIDは末尾にID順 */
const ORDER = ['LineTracer', 'SumoRobot', 'buruburu', 'buzzer', 'ArtoRo', 'LogicLineTracerV2', 'MazeLineTracer'];

const rank = (id: string) => (ORDER.includes(id) ? ORDER.indexOf(id) : ORDER.length);

/** 制作物を一覧の並び順に整える */
export function sortWorks(works: Work[]): Work[] {
    return [...works].sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id));
}

/** ほかの制作物: 一覧で次に並ぶものから順に count 件、末尾まで行ったら先頭へ回る。自分は含めない */
export function otherWorks(work: Work, works: Work[], count = 3): Work[] {
    const i = works.findIndex((w) => w.id === work.id);
    if (i === -1) return [];
    return [...works.slice(i + 1), ...works.slice(0, i)].slice(0, count);
}
