import {
    F as V,
    f as d
} from "./index-Y_HKN_jG.js";
import {
    u as _
} from "./use-id-FH6KOsM0.js";
import {
    b8 as F,
    an as f,
    bm as L,
    bE as N,
    O as o,
    cI as i,
    cy as O,
    r as T,
    bA as B,
    bo as u,
    br as D,
    ar as K
} from "./index-BgAwOX9Q.js";
const [j, t, q] = L("search"), M = f({}, d, {
    label: String,
    shape: u("square"),
    leftIcon: u("search"),
    clearable: B,
    actionText: String,
    background: String,
    showAction: Boolean
});
var U = F({
    name: j,
    props: M,
    emits: ["blur", "focus", "clear", "search", "cancel", "clickInput", "clickLeftIcon", "clickRightIcon", "update:modelValue"],
    setup(n, {
        emit: c,
        slots: a,
        attrs: b
    }) {
        const h = _(),
            l = T(),
            k = () => {
                a.action || (c("update:modelValue", ""), c("cancel"))
            },
            I = e => {
                e.keyCode === 13 && (D(e), c("search", n.modelValue))
            },
            r = () => n.id || `${h}-input`,
            g = () => {
                if (a.label || n.label) return o("label", {
                    class: t("label"),
                    for: r(),
                    "data-allow-mismatch": "attribute"
                }, [a.label ? a.label() : n.label])
            },
            p = () => {
                if (n.showAction) {
                    const e = n.actionText || q("cancel");
                    return o("div", {
                        class: t("action"),
                        role: "button",
                        tabindex: 0,
                        onClick: k
                    }, [a.action ? a.action() : e])
                }
            },
            m = () => {
                var e;
                return (e = l.value) == null ? void 0 : e.blur()
            },
            C = () => {
                var e;
                return (e = l.value) == null ? void 0 : e.focus()
            },
            v = e => c("blur", e),
            E = e => c("focus", e),
            w = e => c("clear", e),
            x = e => c("clickInput", e),
            y = e => c("clickLeftIcon", e),
            R = e => c("clickRightIcon", e),
            S = Object.keys(d),
            A = () => {
                const e = f({}, b, i(n, S), {
                        id: r()
                    }),
                    s = P => c("update:modelValue", P);
                return o(V, O({
                    ref: l,
                    type: "search",
                    class: t("field", {
                        "with-message": e.errorMessage
                    }),
                    border: !1,
                    onBlur: v,
                    onFocus: E,
                    onClear: w,
                    onKeypress: I,
                    onClickInput: x,
                    onClickLeftIcon: y,
                    onClickRightIcon: R,
                    "onUpdate:modelValue": s
                }, e), i(a, ["left-icon", "right-icon"]))
            };
        return N({
            focus: C,
            blur: m
        }), () => {
            var e;
            return o("div", {
                class: t({
                    "show-action": n.showAction
                }),
                style: {
                    background: n.background
                }
            }, [(e = a.left) == null ? void 0 : e.call(a), o("div", {
                class: t("content", n.shape)
            }, [g(), A()]), p()])
        }
    }
});
const H = K(U);
export {
    H as S
};