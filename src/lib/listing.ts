export const PAGE_SIZE = 15;

interface Group<T> {
    /** 一覧のパス（例: `tag/遊び`）。空ならルート */
    base?: string;
    items: T[];
    props?: Record<string, unknown>;
}

/** グループごとに PAGE_SIZE 件ずつへ分け、`[...list]` ルート用の getStaticPaths の戻り値にする */
export function paginate<T>(groups: Group<T>[]) {
    return groups.flatMap(({ base = '', items, props }) => {
        const total = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
        return Array.from({ length: total }, (_, i) => {
            const path = i === 0 ? base : `${base ? `${base}/` : ''}page/${i + 1}`;
            return {
                params: { list: path || undefined },
                props: { ...props, items: items.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE), page: i + 1, total, count: items.length },
            };
        });
    });
}
