import {
    b8 as K,
    c5 as F,
    c6 as O,
    c7 as Q,
    c as i,
    r as n,
    P as W,
    bH as I,
    c8 as ee,
    c9 as te,
    aZ as c,
    aU as r,
    b0 as ae,
    ba as y,
    be as _,
    bh as L,
    bi as P,
    a_ as se,
    bd as z,
    aT as A,
    a$ as E,
    ca as le,
    p as oe,
    aY as ne
} from "./index-BgAwOX9Q.js";
import {
    u as ue
} from "./common-D-vNz206.js";
const re = K({
        __name: "index",
        props: F({
            modelValue: {
                type: Number,
                default: 1
            },
            items: {
                type: Array
            },
            interval: {
                type: Number,
                default: 5e3
            },
            transitionTime: {
                type: Number,
                default: 300
            },
            dotsBottom: {
                type: [String, Number],
                require: !1
            }
        }, {
            loop: {
                type: Boolean,
                default: !0
            },
            loopModifiers: {}
        }),
        emits: F(["update:modelValue"], ["update:loop"]),
        setup(b, {
            emit: R
        }) {
            const h = n(null),
                t = b,
                a = O(b, "loop"),
                x = n(!0),
                p = n(!1),
                U = R,
                q = i(() => {
                    if (t.dotsBottom) {
                        if (typeof t.dotsBottom == "number") return `${t.dotsBottom}px`;
                        if (typeof t.dotsBottom == "string") return t.dotsBottom
                    }
                }),
                d = i(() => {
                    var e, s;
                    return [(e = t.items) == null ? void 0 : e[t.items.length - 1], ...t.items || [], (s = t.items) == null ? void 0 : s[0]].filter(Boolean)
                }),
                l = i({
                    get: () => t.modelValue + 1,
                    set: e => {
                        U("update:modelValue", e - 1)
                    }
                }),
                v = n(0),
                $ = n(0),
                k = n(-100),
                B = n(!1),
                m = n(!1),
                C = i(() => l.value === 0 ? t.items.length - 1 : l.value === d.value.length - 1 ? 0 : l.value - 1),
                w = i(() => ({
                    transform: `translateX(calc(${-l.value*100}% + ${v.value}px))`,
                    transition: B.value ? "none" : `transform ${t.transitionTime}ms ease`
                })),
                {
                    pause: f,
                    resume: D
                } = Q(() => N(), t.interval),
                o = n(null),
                T = () => {
                    var e;
                    k.value = -100, (e = o.value) == null || e.call(o), o.value = ue(() => k.value += 1.05, (t.interval - t.transitionTime - 500) / 100)
                },
                N = () => V(l.value + 1),
                H = () => V(l.value - 1),
                Y = i(() => l.value >= d.value.length - 1),
                Z = i(() => l.value <= 0),
                g = n(null),
                V = e => {
                    m.value = !0, l.value = e, a.value && T()
                },
                j = e => {
                    var s;
                    p.value || m.value || (a.value && f(), (s = o.value) == null || s.call(o), $.value = e.touches[0].clientX)
                },
                G = e => {
                    p.value || m.value || (v.value = e.touches[0].clientX - $.value)
                },
                J = () => {
                    if (!p.value) {
                        if (m.value) {
                            v.value = 0;
                            return
                        }
                        Math.abs(v.value) > 50 && (v.value > 0 ? H() : N()), a.value && D(), a.value && T(), v.value = 0
                    }
                };

            function M() {
                var s;
                (((s = t.items) == null ? void 0 : s.length) || 0) <= 1 && (a.value = !1, x.value = !1, p.value = !0), D(), h.value && (a.value && T(), !a.value && f(), g.value = le(h.value, "transitionend", () => {
                    m.value = !1, oe(() => {
                        B.value = !0, Y.value ? l.value = 1 : Z.value && (l.value = d.value.length - 2), setTimeout(() => {
                            B.value = !1
                        })
                    })
                }))
            }

            function S() {
                var e, s;
                (e = g.value) == null || e.call(g), (s = o.value) == null || s.call(o), f == null || f(), m.value = !1
            }
            return W(() => {
                M(), I(() => {
                    S()
                })
            }), ee(() => {
                M()
            }), te(() => {
                S()
            }), (e, s) => (r(), c("div", {
                class: "carousel",
                onTouchstart: j,
                onTouchmove: G,
                onTouchend: J
            }, [ae("div", {
                ref_key: "trackRef",
                ref: h,
                class: "track",
                style: _(w.value)
            }, [(r(!0), c(L, null, P(d.value, (X, u) => (r(), c("div", {
                class: "slide",
                key: u
            }, [se(e.$slots, "default", {
                data: X,
                index: u > 0 && u < d.value.length - 1 ? u - 1 : u
            }, void 0, !0)]))), 128))], 4), x.value ? (r(), c("div", {
                key: 0,
                class: z({
                    dots: !0,
                    "no-progress-dots": !a.value
                }),
                style: _({
                    bottom: q.value
                })
            }, [a.value ? y("", !0) : (r(), A(E, {
                key: 0,
                name: "icon_left1",
                iconClass: "icon"
            })), (r(!0), c(L, null, P(b.items, (X, u) => (r(), c("div", {
                class: z({
                    dot: !0,
                    active: u === C.value,
                    "no-progress": !a.value
                }),
                key: u
            }, [u === C.value && a.value ? (r(), c("div", {
                key: 0,
                class: "progress",
                style: _({
                    "--d": `${k.value}%`
                })
            }, null, 4)) : y("", !0)], 2))), 128)), a.value ? y("", !0) : (r(), A(E, {
                key: 1,
                name: "icon_right",
                iconClass: "icon"
            }))], 6)) : y("", !0)], 32))
        }
    }),
    ve = ne(re, [
        ["__scopeId", "data-v-3a7b95b6"]
    ]);
export {
    ve as C
};