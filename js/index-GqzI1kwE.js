import {
    b8 as d,
    bA as S,
    bo as h,
    bm as m,
    bD as w,
    c as p,
    O as v,
    bp as A,
    cl as E,
    cv as x,
    an as C,
    ar as b
} from "./index-BgAwOX9Q.js";
const [y, _] = m("row"), $ = Symbol(y), R = {
    tag: h("div"),
    wrap: S,
    align: String,
    gutter: {
        type: [String, Number, Array],
        default: 0
    },
    justify: String
};
var j = d({
    name: y,
    props: R,
    setup(s, {
        slots: o
    }) {
        const {
            children: f,
            linkChildren: c
        } = w($), i = p(() => {
            const t = [
                []
            ];
            let e = 0;
            return f.forEach((a, r) => {
                e += Number(a.span), e > 24 ? (t.push([r]), e -= 24) : t[t.length - 1].push(r)
            }), t
        }), n = p(() => {
            let t = 0;
            Array.isArray(s.gutter) ? t = Number(s.gutter[0]) || 0 : t = Number(s.gutter);
            const e = [];
            return t && i.value.forEach(a => {
                const r = t * (a.length - 1) / a.length;
                a.forEach((u, N) => {
                    if (N === 0) e.push({
                        right: r
                    });
                    else {
                        const g = t - e[u - 1].right,
                            P = r - g;
                        e.push({
                            left: g,
                            right: P
                        })
                    }
                })
            }), e
        }), l = p(() => {
            const {
                gutter: t
            } = s, e = [];
            if (Array.isArray(t) && t.length > 1) {
                const a = Number(t[1]) || 0;
                if (a <= 0) return e;
                i.value.forEach((r, u) => {
                    u !== i.value.length - 1 && r.forEach(() => {
                        e.push({
                            bottom: a
                        })
                    })
                })
            }
            return e
        });
        return c({
            spaces: n,
            verticalSpaces: l
        }), () => {
            const {
                tag: t,
                wrap: e,
                align: a,
                justify: r
            } = s;
            return v(t, {
                class: _({
                    [`align-${a}`]: a,
                    [`justify-${r}`]: r,
                    nowrap: !e
                })
            }, {
                default: () => {
                    var u;
                    return [(u = o.default) == null ? void 0 : u.call(o)]
                }
            })
        }
    }
});
const [k, O] = m("col"), B = {
    tag: h("div"),
    span: E(0),
    offset: A
};
var D = d({
    name: k,
    props: B,
    setup(s, {
        slots: o
    }) {
        const {
            parent: f,
            index: c
        } = x($), i = p(() => {
            if (!f) return;
            const {
                spaces: n,
                verticalSpaces: l
            } = f;
            let t = {};
            if (n && n.value && n.value[c.value]) {
                const {
                    left: a,
                    right: r
                } = n.value[c.value];
                t = {
                    paddingLeft: a ? `${a}px` : null,
                    paddingRight: r ? `${r}px` : null
                }
            }
            const {
                bottom: e
            } = l.value[c.value] || {};
            return C(t, {
                marginBottom: e ? `${e}px` : null
            })
        });
        return () => {
            const {
                tag: n,
                span: l,
                offset: t
            } = s;
            return v(n, {
                style: i.value,
                class: O({
                    [l]: l,
                    [`offset-${t}`]: t
                })
            }, {
                default: () => {
                    var e;
                    return [(e = o.default) == null ? void 0 : e.call(o)]
                }
            })
        }
    }
});
const K = b(D),
    L = b(j);
export {
    K as C, L as R
};