import {
    b8 as C,
    bA as L,
    bo as R,
    cl as w,
    bm as B,
    r as h,
    cm as N,
    R as v,
    cn as O,
    P as U,
    bE as _,
    co as j,
    c as y,
    O as r,
    p as A,
    U as x,
    cp as F,
    bs as H,
    ar as I
} from "./index-BgAwOX9Q.js";
import {
    u as M
} from "./use-tab-status-B8-Im3BY.js";
const [V, o, q] = B("list"), z = {
    error: Boolean,
    offset: w(300),
    loading: Boolean,
    disabled: Boolean,
    finished: Boolean,
    scroller: Object,
    errorText: String,
    direction: R("down"),
    loadingText: String,
    finishedText: String,
    immediateCheck: L
};
var D = C({
    name: V,
    props: z,
    emits: ["load", "update:error", "update:loading"],
    setup(e, {
        emit: c,
        slots: a
    }) {
        const d = h(e.loading),
            u = h(),
            g = h(),
            s = M(),
            T = N(u),
            m = y(() => e.scroller || T.value),
            n = () => {
                A(() => {
                    if (d.value || e.finished || e.disabled || e.error || (s == null ? void 0 : s.value) === !1) return;
                    const {
                        direction: t
                    } = e, l = +e.offset, i = x(m);
                    if (!i.height || F(u)) return;
                    let f = !1;
                    const b = x(g);
                    t === "up" ? f = i.top - b.top <= l : f = b.bottom - i.bottom <= l, f && (d.value = !0, c("update:loading", !0), c("load"))
                })
            },
            P = () => {
                if (e.finished) {
                    const t = a.finished ? a.finished() : e.finishedText;
                    if (t) return r("div", {
                        class: o("finished-text")
                    }, [t])
                }
            },
            k = () => {
                c("update:error", !1), n()
            },
            S = () => {
                if (e.error) {
                    const t = a.error ? a.error() : e.errorText;
                    if (t) return r("div", {
                        role: "button",
                        class: o("error-text"),
                        tabindex: 0,
                        onClick: k
                    }, [t])
                }
            },
            E = () => {
                if (d.value && !e.finished && !e.disabled) return r("div", {
                    class: o("loading")
                }, [a.loading ? a.loading() : r(H, {
                    class: o("loading-icon")
                }, {
                    default: () => [e.loadingText || q("loading")]
                })])
            };
        return v(() => [e.loading, e.finished, e.error], n), s && v(s, t => {
            t && n()
        }), O(() => {
            d.value = e.loading
        }), U(() => {
            e.immediateCheck && n()
        }), _({
            check: n
        }), j("scroll", n, {
            target: m,
            passive: !0
        }), () => {
            var t;
            const l = (t = a.default) == null ? void 0 : t.call(a),
                i = r("div", {
                    ref: g,
                    class: o("placeholder")
                }, null);
            return r("div", {
                ref: u,
                role: "feed",
                class: o(),
                "aria-busy": d.value
            }, [e.direction === "down" ? l : i, E(), P(), S(), e.direction === "up" ? l : i])
        }
    }
});
const K = I(D);
export {
    K as L
};