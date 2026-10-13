import {
    p as u
} from "./index-BJQObbE4.js";
import {
    an as l,
    ao as p,
    ap as m,
    aq as f
} from "./index-BgAwOX9Q.js";
const y = l({}, u, {
        modelValue: m(),
        filter: Function,
        formatter: {
            type: Function,
            default: (t, e) => e
        }
    }),
    x = Object.keys(u);

function d(t, e) {
    if (t < 0) return [];
    const a = Array(t);
    let n = -1;
    for (; ++n < t;) a[n] = e(n);
    return a
}
const k = (t, e) => 32 - new Date(t, e - 1, 32).getDate(),
    V = (t, e, a, n, r, s) => {
        const o = d(e - t + 1, i => {
            const c = p(t + i);
            return n(a, {
                text: c,
                value: c
            })
        });
        return r ? r(a, o, s) : o
    },
    D = (t, e) => t.map((a, n) => {
        const r = e[n];
        if (r.length) {
            const s = +r[0].value,
                o = +r[r.length - 1].value;
            return p(f(+a, s, o))
        }
        return a
    });
export {
    k as a, D as f, V as g, x as p, y as s
};