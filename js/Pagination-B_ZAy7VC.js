import {
    b8 as k,
    aZ as v,
    ba as b,
    c as r,
    aU as p,
    b0 as m,
    O as g,
    a$ as y,
    bh as P,
    bi as V,
    bd as C,
    b1 as E,
    aY as x
} from "./index-BgAwOX9Q.js";
const $ = {
        key: 0,
        class: "pagination"
    },
    B = ["disabled"],
    I = ["onClick"],
    N = ["disabled"],
    j = k({
        __name: "Pagination",
        props: {
            totalItems: {},
            itemsPerPage: {},
            modelValue: {},
            maxVisiblePages: {}
        },
        emits: ["update:modelValue", "changePage"],
        setup(_, {
            emit: f
        }) {
            const u = _,
                d = f,
                n = r(() => Math.ceil(u.totalItems / (u.itemsPerPage || 10))),
                l = r({
                    get: () => u.modelValue || 1,
                    set: s => d("update:modelValue", s)
                }),
                h = r(() => {
                    const s = u.maxVisiblePages || 5,
                        e = [];
                    if (n.value <= s)
                        for (let o = 1; o <= n.value; o++) e.push({
                            key: o,
                            value: o
                        });
                    else {
                        const t = n.value,
                            i = Math.floor(s / 2);
                        if (l.value <= i) {
                            for (let a = 1; a <= s - 2; a++) e.push({
                                key: a,
                                value: a
                            });
                            e.push({
                                key: "ellipsis-right",
                                value: "..."
                            }), e.push({
                                key: t,
                                value: t
                            })
                        } else if (l.value >= n.value - i) {
                            e.push({
                                key: 1,
                                value: 1
                            }), e.push({
                                key: "ellipsis-left",
                                value: "..."
                            });
                            for (let a = n.value - s + 3; a <= n.value; a++) e.push({
                                key: a,
                                value: a
                            })
                        } else {
                            e.push({
                                key: 1,
                                value: 1
                            }), e.push({
                                key: "ellipsis-left",
                                value: "..."
                            });
                            for (let a = l.value - i + 1; a <= l.value + i - 1; a++) e.push({
                                key: a,
                                value: a
                            });
                            e.push({
                                key: "ellipsis-right",
                                value: "..."
                            }), e.push({
                                key: t,
                                value: t
                            })
                        }
                    }
                    return e
                }),
                c = s => {
                    typeof s == "number" && s >= 1 && s <= n.value && (l.value = s, d("changePage", s))
                };
            return (s, e) => {
                const o = y;
                return n.value > 1 ? (p(), v("div", $, [m("button", {
                    class: "pagination-button",
                    disabled: l.value <= 1,
                    onClick: e[0] || (e[0] = t => c(l.value - 1))
                }, [g(o, {
                    name: "icon_enjoy_03",
                    class: "left"
                })], 8, B), (p(!0), v(P, null, V(h.value, t => (p(), v("span", {
                    key: t.key,
                    class: C([{
                        active: t.value === l.value
                    }, t.value === "..." ? "pagination-ellipsis" : "pagination-page"]),
                    onClick: i => c(t.value)
                }, E(t.value), 11, I))), 128)), m("button", {
                    class: "pagination-button",
                    disabled: l.value >= n.value,
                    onClick: e[1] || (e[1] = t => c(l.value + 1))
                }, [g(o, {
                    name: "icon_enjoy_02",
                    iconClass: "right"
                })], 8, N)])) : b("", !0)
            }
        }
    }),
    z = x(j, [
        ["__scopeId", "data-v-8c0a01c4"]
    ]);
export {
    z as _
};