import {
    b8 as B,
    bo as P,
    bA as I,
    bp as d,
    bm as $,
    N,
    R as j,
    r as u,
    cM as D,
    bH as M,
    P as R,
    p as z,
    O as n,
    c as _,
    bN as C,
    bM as O,
    cy as S,
    bq as U,
    bx as f,
    bB as q,
    ar as A
} from "./index-BgAwOX9Q.js";
const [F, i] = $("image"), H = {
    src: String,
    alt: String,
    fit: String,
    position: String,
    round: Boolean,
    block: Boolean,
    width: d,
    height: d,
    radius: d,
    lazyLoad: Boolean,
    iconSize: d,
    showError: I,
    errorIcon: P("photo-fail"),
    iconPrefix: String,
    showLoading: I,
    loadingIcon: P("photo"),
    crossorigin: String,
    referrerpolicy: String
};
var T = B({
    name: F,
    props: H,
    emits: ["load", "error"],
    setup(r, {
        emit: g,
        slots: c
    }) {
        const t = u(!1),
            a = u(!0),
            o = u(),
            {
                $Lazyload: l
            } = N().proxy,
            x = _(() => {
                const e = {
                    width: f(r.width),
                    height: f(r.height)
                };
                return q(r.radius) && (e.overflow = "hidden", e.borderRadius = f(r.radius)), e
            });
        j(() => r.src, () => {
            t.value = !1, a.value = !0
        });
        const v = e => {
                a.value && (a.value = !1, g("load", e))
            },
            m = () => {
                const e = new Event("load");
                Object.defineProperty(e, "target", {
                    value: o.value,
                    enumerable: !0
                }), v(e)
            },
            h = e => {
                t.value = !0, a.value = !1, g("error", e)
            },
            b = (e, s, L) => L ? L() : n(U, {
                name: e,
                size: r.iconSize,
                class: s,
                classPrefix: r.iconPrefix
            }, null),
            E = () => {
                if (a.value && r.showLoading) return n("div", {
                    class: i("loading")
                }, [b(r.loadingIcon, i("loading-icon"), c.loading)]);
                if (t.value && r.showError) return n("div", {
                    class: i("error")
                }, [b(r.errorIcon, i("error-icon"), c.error)])
            },
            k = () => {
                if (t.value || !r.src) return;
                const e = {
                    alt: r.alt,
                    class: i("img"),
                    style: {
                        objectFit: r.fit,
                        objectPosition: r.position
                    },
                    crossorigin: r.crossorigin,
                    referrerpolicy: r.referrerpolicy
                };
                return r.lazyLoad ? C(n("img", S({
                    ref: o
                }, e), null), [
                    [O("lazy"), r.src]
                ]) : n("img", S({
                    ref: o,
                    src: r.src,
                    onLoad: v,
                    onError: h
                }, e), null)
            },
            y = ({
                el: e
            }) => {
                const s = () => {
                    e === o.value && a.value && m()
                };
                o.value ? s() : z(s)
            },
            w = ({
                el: e
            }) => {
                e === o.value && !t.value && h()
            };
        return l && D && (l.$on("loaded", y), l.$on("error", w), M(() => {
            l.$off("loaded", y), l.$off("error", w)
        })), R(() => {
            z(() => {
                var e;
                (e = o.value) != null && e.complete && !r.lazyLoad && m()
            })
        }), () => {
            var e;
            return n("div", {
                class: i({
                    round: r.round,
                    block: r.block
                }),
                style: x.value
            }, [k(), E(), (e = c.default) == null ? void 0 : e.call(c)])
        }
    }
});
const G = A(T);
export {
    G as I
};