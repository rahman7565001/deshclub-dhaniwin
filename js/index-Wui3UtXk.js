import {u as z, r as R} from "./use-route-CdVOVz1N.js";
import {b8 as C, an as I, bm as q, bn as D, O as o, bo as l, bp as N, bq as O, br as p, bs as w, ar as L} from "./index-BgAwOX9Q.js";
const [U,a] = q("button")
  , _ = I({}, R, {
    tag: l("button"),
    text: String,
    icon: String,
    type: l("default"),
    size: l("normal"),
    color: String,
    block: Boolean,
    plain: Boolean,
    round: Boolean,
    square: Boolean,
    loading: Boolean,
    hairline: Boolean,
    disabled: Boolean,
    iconPrefix: String,
    nativeType: l("button"),
    loadingSize: N,
    loadingText: String,
    loadingType: String,
    iconPosition: l("left")
});
var E = C({
    name: U,
    props: _,
    emits: ["click"],
    setup(e, {emit: g, slots: t}) {
        const f = z()
          , b = () => t.loading ? t.loading() : o(w, {
            size: e.loadingSize,
            type: e.loadingType,
            class: a("loading")
        }, null)
          , c = () => {
            if (e.loading)
                return b();
            if (t.icon)
                return o("div", {
                    class: a("icon")
                }, [t.icon()]);
            if (e.icon)
                return o(O, {
                    name: e.icon,
                    class: a("icon"),
                    classPrefix: e.iconPrefix
                }, null)
        }
          , m = () => {
            let n;
            if (e.loading ? n = e.loadingText : n = t.default ? t.default() : e.text,
            n)
                return o("span", {
                    class: a("text")
                }, [n])
        }
          , x = () => {
            const {color: n, plain: r} = e;
            if (n) {
                const i = {
                    color: r ? n : "white"
                };
                return r || (i.background = n),
                n.includes("gradient") ? i.border = 0 : i.borderColor = n,
                i
            }
        }
          , y = n => {
            e.loading ? p(n) : e.disabled || (g("click", n),
            f())
        }
        ;
        return () => {
            const {tag: n, type: r, size: i, block: S, round: B, plain: P, square: k, loading: T, disabled: s, hairline: d, nativeType: h, iconPosition: u} = e
              , v = [a([r, i, {
                plain: P,
                block: S,
                round: B,
                square: k,
                loading: T,
                disabled: s,
                hairline: d
            }]), {
                [D]: d
            }];
            return o(n, {
                type: h,
                class: v,
                style: x(),
                disabled: s,
                onClick: y
            }, {
                default: () => [o("div", {
                    class: a("content")
                }, [u === "left" && c(), m(), u === "right" && c()])]
            })
        }
    }
});
const A = L(E);
export {A as B};
