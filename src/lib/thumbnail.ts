import type { ImageMetadata } from 'astro';
import fallback from '../assets/img/EDTC-icon.webp';

/** サムネイルが無ければ EDTC アイコン（表示用。OGP の Base には本物の thumbnail を渡す） */
export const thumbnailOf = (entry: { data: { thumbnail?: ImageMetadata } }) => entry.data.thumbnail ?? fallback;
