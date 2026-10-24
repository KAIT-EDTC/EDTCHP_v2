import { getCollection, type CollectionEntry } from 'astro:content';
import { sortWorks } from './works-order.ts';

export type Work = CollectionEntry<'works'>;

/** 全制作物を一覧の並び順で取得 */
export async function getWorks(): Promise<Work[]> {
    const list = await getCollection('works');
    return sortWorks(list);
}
