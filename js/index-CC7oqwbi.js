import {
    az as d,
    aA as m,
    r as y,
    aB as v,
    aC as R,
    R as h,
    aD as w,
    aE as S,
    aF as b,
    aG as k,
    aH as C
} from "./index-BgAwOX9Q.js";

function u(e) {
    return b() ? (k(e), !0) : !1
}
const l = typeof window < "u" && typeof document < "u",
    D = typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope,
    W = () => {};

function G(...e) {
    if (e.length !== 1) return d(...e);
    const t = e[0];
    return typeof t == "function" ? m(v(() => ({
        get: t,
        set: W
    }))) : y(t)
}

function I(e, t = 1e3, r = {}) {
    const {
        immediate: c = !0,
        immediateCallback: p = !1
    } = r;
    let a = null;
    const n = w(!1);

    function i() {
        a && (clearInterval(a), a = null)
    }

    function f() {
        n.value = !1, i()
    }

    function s() {
        const o = C(t);
        o <= 0 || (n.value = !0, p && e(), i(), n.value && (a = setInterval(e, o)))
    }
    if (c && l && s(), R(t) || typeof t == "function") {
        const o = h(t, () => {
            n.value && l && s()
        });
        u(o)
    }
    return u(f), {
        isActive: S(n),
        pause: f,
        resume: s
    }
}
export {
    u as a, D as b, l as i, G as t, I as u
};