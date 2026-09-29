import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/products/*.{webp,png,jpg,jpeg}', {
    eager: true,
});

export function productImage(name?: string): ImageMetadata | undefined {
    return name ? images[`/src/assets/products/${name}`]?.default : undefined;
}

/** 一覧の並び順は従来どおり（新しいものが上）。ここに無いIDは末尾にID順 */
const ORDER = ['LineTracer', 'SumoRobot', 'buruburu', 'buzzer', 'ArtoRo', 'LogicLineTracerV2', 'MazeLineTracer'];

export async function getProducts() {
    const list = await getCollection('products');
    const rank = (id: string) => (ORDER.includes(id) ? ORDER.indexOf(id) : ORDER.length);
    return list.sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id));
}
