// 旧サイトの記事JSON（EDTCHP）を content/blog/<id>/index.md に変換する一回限りのスクリプト。
// 使い方: node scripts/migrate-legacy-blog.mjs ../EDTCHP
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const src = process.argv[2];
if (!src) throw new Error('旧リポジトリのパスを指定してください');
const contentsDir = join(src, 'public/blog/contents');
const imgDir = join(src, 'public/blog/img');

const q = (s) => JSON.stringify(s ?? '');
let count = 0;
for (const file of readdirSync(contentsDir)) {
    if (!file.endsWith('.json') || file.startsWith('_')) continue;
    const a = JSON.parse(readFileSync(join(contentsDir, file), 'utf8'));
    const dir = join('content/blog', a.id);
    mkdirSync(dir, { recursive: true });

    const copy = (name) => {
        if (!name) return;
        if (!existsSync(join(imgDir, name))) return console.warn(`画像なし: ${a.id} ${name}`);
        copyFileSync(join(imgDir, name), join(dir, name));
    };

    const body = [];
    for (const s of a.sections ?? []) {
        if (s.image) {
            copy(s.image);
            body.push(`![${(s.imageAlt ?? '').replace(/[\[\]]/g, '')}](./${s.image})`);
        }
        for (const p of s.paragraphs ?? []) body.push(p.split('\n').join('\\\n'));
    }
    copy(a.thumbnail);

    const fm = [
        '---',
        `title: ${q(a.title)}`,
        `date: ${a.date}`,
        `author: ${q(a.author)}`,
        `description: ${q(a.caption)}`,
        `tags: ${JSON.stringify(a.tags ?? [])}`,
        ...(a.thumbnail && existsSync(join(dir, a.thumbnail)) ? [`thumbnail: ./${a.thumbnail}`] : []),
        '---',
        '',
    ];
    writeFileSync(join(dir, 'index.md'), fm.join('\n') + '\n' + body.join('\n\n') + '\n');
    count++;
}
console.log(`${count}件を変換しました`);
