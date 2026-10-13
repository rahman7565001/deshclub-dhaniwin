import {
    b8 as C,
    bv as l,
    bp as f,
    bm as h,
    bw as k,
    O as t,
    bx as w,
    bs as S,
    ar as y
} from "./index-BgAwOX9Q.js";
const [x, c] = h("switch"), z = {
    size: f,
    loading: Boolean,
    disabled: Boolean,
    modelValue: l,
    activeColor: String,
    inactiveColor: String,
    activeValue: {
        type: l,
        default: !0
    },
    inactiveValue: {
        type: l,
        default: !1
    }
};
var P = C({
    name: x,
    props: z,
    emits: ["change", "update:modelValue"],
    setup(e, {
        emit: d,
        slots: n
    }) {
        const o = () => e.modelValue === e.activeValue,
            u = () => {
                if (!e.disabled && !e.loading) {
                    const a = o() ? e.inactiveValue : e.activeValue;
                    d("update:modelValue", a), d("change", a)
                }
            },
            r = () => {
                if (e.loading) {
                    const a = o() ? e.activeColor : e.inactiveColor;
                    return t(S, {
                        class: c("loading"),
                        color: a
                    }, null)
                }
                if (n.node) return n.node()
            };
        return k(() => e.modelValue), () => {
            var a;
            const {
                size: v,
                loading: b,
                disabled: s,
                activeColor: m,
                inactiveColor: g
            } = e, i = o(), V = {
                fontSize: w(v),
                backgroundColor: i ? m : g
            };
            return t("div", {
                role: "switch",
                class: c({
                    on: i,
                    loading: b,
                    disabled: s
                }),
                style: V,
                tabindex: s ? void 0 : 0,
                "aria-checked": i,
                onClick: u
            }, [t("div", {
                class: c("node")
            }, [r()]), (a = n.background) == null ? void 0 : a.call(n)])
        }
    }
});
const L = y(P);
export {
    L as S
};