/**
 * 一覧ページのカード（静的に全件出力済み）を、年・タグ・ページで表示/非表示にする。
 * 状態は URL（?year=&tags=a,b&page=）に保存し、戻る/進むにも対応する。
 */
const PAGE_SIZE = 15;

interface Options {
    /** クラス名の接頭辞（blog / works） */
    prefix: string;
    /** true: 選んだタグをすべて含む記事 / false: いずれかを含む記事 */
    matchAllTags: boolean;
}

interface State {
    year: string;
    tags: string[];
    page: number;
}

function readState(): State {
    const p = new URLSearchParams(location.search);
    return {
        year: p.get('year') ?? '',
        tags: (p.get('tags') ?? '').split(',').filter(Boolean),
        page: Math.max(1, Number(p.get('page')) || 1),
    };
}

function writeState(s: State) {
    const p = new URLSearchParams();
    if (s.year) p.set('year', s.year);
    if (s.tags.length) p.set('tags', s.tags.join(','));
    if (s.page > 1) p.set('page', String(s.page));
    const qs = p.toString();
    history.pushState(null, '', qs ? `?${qs}` : location.pathname);
}

export function initCardFilter({ prefix, matchAllTags }: Options) {
    const cards = [...document.querySelectorAll<HTMLElement>(`.${prefix}-card`)];
    const yearSelect = document.querySelector<HTMLSelectElement>('#year-select');
    const tagBtns = [...document.querySelectorAll<HTMLButtonElement>(`.${prefix}-filters__tag-btn`)];
    const countEl = document.querySelector<HTMLElement>(`.${prefix}-filters__count`)!;
    const clearBtn = document.querySelector<HTMLButtonElement>(`.${prefix}-filters__clear`)!;
    const emptyEl = document.querySelector<HTMLElement>(`.${prefix}-empty`)!;
    const pager = document.querySelector<HTMLElement>('.pagination-area--bottom')!;
    const unit = prefix === 'blog' ? '件の記事' : '件の制作物';

    function update(next: State) {
        writeState(next);
        render();
    }

    function render() {
        const s = readState();
        if (yearSelect) yearSelect.value = s.year;
        tagBtns.forEach((b) => {
            const tag = b.dataset.tag ?? '';
            b.setAttribute('aria-pressed', String(tag ? s.tags.includes(tag) : s.tags.length === 0));
        });

        const matched = cards.filter((c) => {
            if (s.year && c.dataset.year !== s.year) return false;
            if (!s.tags.length) return true;
            const tags = (c.dataset.tags ?? '').split('|');
            return matchAllTags ? s.tags.every((t) => tags.includes(t)) : s.tags.some((t) => tags.includes(t));
        });
        const totalPages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
        const page = Math.min(s.page, totalPages);
        const visible = new Set(matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
        cards.forEach((c) => (c.hidden = !visible.has(c)));

        countEl.textContent = `${matched.length}${unit}`;
        clearBtn.hidden = !s.year && !s.tags.length;
        emptyEl.hidden = matched.length > 0;
        renderPager(page, totalPages, s);
    }

    function renderPager(page: number, total: number, s: State) {
        pager.hidden = total <= 1;
        pager.replaceChildren();
        const btn = (label: string, target: number, cls: string, disabled = false) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = cls;
            b.textContent = label;
            b.disabled = disabled;
            b.addEventListener('click', () => {
                update({ ...s, page: target });
                document.querySelector(`.${prefix}-filters`)?.scrollIntoView({ behavior: 'smooth' });
            });
            return b;
        };
        pager.append(btn('‹', page - 1, 'pagination-area__arrow', page === 1));
        for (let i = 1; i <= total; i++) {
            const b = btn(String(i), i, i === page ? 'pagination-area__num pagination-area__current' : 'pagination-area__num');
            if (i === page) b.setAttribute('aria-current', 'page');
            pager.append(b);
        }
        pager.append(btn('›', page + 1, 'pagination-area__arrow', page === total));
    }

    yearSelect?.addEventListener('change', () => update({ ...readState(), year: yearSelect.value, page: 1 }));
    tagBtns.forEach((b) =>
        b.addEventListener('click', () => {
            const s = readState();
            const tag = b.dataset.tag ?? '';
            const tags = !tag ? [] : s.tags.includes(tag) ? s.tags.filter((t) => t !== tag) : [...s.tags, tag];
            update({ ...s, tags, page: 1 });
        }),
    );
    clearBtn.addEventListener('click', () => update({ year: '', tags: [], page: 1 }));
    window.addEventListener('popstate', render);
    render();
}
