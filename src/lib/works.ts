import { getCollection } from 'astro:content';

/** 一覧の並び順は従来どおり（新しいものが上）。ここに無いIDは末尾にID順 */
const ORDER = ['LineTracer', 'SumoRobot', 'buruburu', 'buzzer', 'ArtoRo', 'LogicLineTracerV2', 'MazeLineTracer'];

export async function getWorks() {
    const list = await getCollection('works');
    const rank = (id: string) => (ORDER.includes(id) ? ORDER.indexOf(id) : ORDER.length);
    return list.sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id));
}
