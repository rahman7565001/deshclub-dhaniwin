import {
    b8 as q,
    at as N,
    d as A,
    dD as I,
    u as L,
    J as M,
    aZ as m,
    aU as s,
    bd as y,
    b0 as n,
    a_ as f,
    ba as o,
    c as C,
    bb as a,
    b1 as x,
    K as W,
    O as z,
    cV as H,
    a$ as l,
    aT as d,
    bO as E,
    aY as J
} from "./index-BgAwOX9Q.js";
import {
    p as K
} from "./pre-D84pmYLY.js";
import {
    c as U
} from "./currency-DTUBf2lI.js";
import {
    u as Y
} from "./useProtocol-CmBEKSqV.js";
const Z = "/images/question-DynP9t_R.webp",
    j = "/images/gift-BPLBBdSP.webp",
    F = {
        class: "head-left"
    },
    G = {
        class: "route-name"
    },
    Q = {
        class: "extra"
    },
    X = ["src"],
    _ = ["src"],
    ee = {
        key: 0,
        class: "amount"
    },
    te = ["src"],
    se = q({
        __name: "index",
        props: {
            isTransparent: {
                type: Boolean,
                default: !1
            },
            extra: {},
            title: {
                type: Boolean,
                default: !0
            },
            showAmount: {
                type: Boolean
            },
            isOverfllow: {
                type: Boolean,
                default: !0
            },
            isBorder: {
                type: Boolean,
                default: !0
            },
            isBackHome: {
                type: Boolean,
                default: !1
            }
        },
        setup(t) {
            const T = N(),
                {
                    totalBalance: h
                } = A(),
                P = I(),
                {
                    t: k,
                    locale: D
                } = L(),
                O = C(() => !P.title),
                {
                    richText: S,
                    getProtocol: $
                } = Y(4),
                R = C(() => (D.value, k("t230"))),
                v = M({
                    props: {
                        title: R,
                        isShowConfirmBtn: !0,
                        onConfirm: () => v.close()
                    },
                    slots: {
                        default: () => W("div", {
                            innerHTML: S.value || "",
                            class: "rich_div"
                        })
                    }
                });

            function i(r) {
                H.push({
                    name: r
                })
            }

            function V() {
                $(), v.open()
            }
            return (r, e) => (s(), m("div", {
                class: y(["page-wrapper", {
                    isOverfllow: !!t.isOverfllow
                }])
            }, [n("header", {
                class: y({
                    bg: !t.isTransparent,
                    hearder_bottom_border: t.isBorder
                })
            }, [n("div", F, [f(r.$slots, "left", {}, () => [z(l, {
                name: "icon_return_01",
                class: "back",
                onClick: e[0] || (e[0] = () => {
                    t.isBackHome ? i("home") : a(H).go(-1)
                })
            })], !0)]), n("div", {
                class: y({
                    "head-title": !0,
                    noTitle: O.value
                })
            }, [t.title ? f(r.$slots, "title", {
                key: 0
            }, () => {
                var u, c;
                return [n("div", G, x(a(k)((c = (u = a(T)) == null ? void 0 : u.meta) == null ? void 0 : c.pageTitle) || ""), 1)]
            }, !0) : o("", !0)], 2), n("div", Q, [f(r.$slots, "extra", {}, () => {
                var u, c, B, g, w, b, p;
                return [(u = t.extra) != null && u.includes("service") ? (s(), d(l, {
                    key: 0,
                    name: "icon_wa_service",
                    class: "icon",
                    onClick: e[1] || (e[1] = () => i("workOrder"))
                })) : o("", !0), (c = t.extra) != null && c.includes("question") ? (s(), m("img", {
                    key: 1,
                    src: a(Z),
                    onClick: e[2] || (e[2] = E(() => V(), ["stop"]))
                }, null, 8, X)) : o("", !0), (B = t.extra) != null && B.includes("history") ? (s(), d(l, {
                    key: 2,
                    name: "icon_History",
                    class: "icon",
                    onClick: e[3] || (e[3] = () => i("turntableHistory"))
                })) : o("", !0), (g = t.extra) != null && g.includes("depositHistory") ? (s(), d(l, {
                    key: 3,
                    name: "icon_History",
                    class: "icon",
                    onClick: e[4] || (e[4] = () => i("DepositHistory"))
                })) : o("", !0), (w = t.extra) != null && w.includes("withdrawal") ? (s(), d(l, {
                    key: 4,
                    name: "icon_History",
                    class: "icon",
                    onClick: e[5] || (e[5] = () => i("WithdrawHistory"))
                })) : o("", !0), (b = t.extra) != null && b.includes("gift") ? (s(), m("img", {
                    key: 5,
                    src: a(j),
                    onClick: e[6] || (e[6] = () => i("home"))
                }, null, 8, _)) : o("", !0), (p = t.extra) != null && p.includes("records") ? (s(), d(l, {
                    key: 6,
                    name: "icon_History",
                    class: "icon",
                    onClick: e[7] || (e[7] = () => i("Records-Detail"))
                })) : o("", !0)]
            }, !0)]), t.showAmount ? (s(), m("div", ee, [n("img", {
                src: a(K)
            }, null, 8, te), n("span", null, x(a(U)(a(h))), 1)])) : o("", !0)], 2), f(r.$slots, "default", {}, void 0, !0)], 2))
        }
    }),
    re = J(se, [
        ["__scopeId", "data-v-f21f2634"]
    ]);
export {
    re as P
};