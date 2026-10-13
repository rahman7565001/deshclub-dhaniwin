import {
    b8 as g,
    R as k,
    r as B,
    aZ as r,
    aU as i,
    bh as C,
    b0 as m,
    ba as d,
    a_ as p,
    bN as T,
    aT as V,
    a$ as $,
    d7 as w,
    c as v,
    cy as F,
    d8 as K,
    bd as D,
    aY as E
} from "./index-BgAwOX9Q.js";
const I = ["type", "disabled"],
    M = ["innerHTML"],
    U = g({
        __name: "arInput",
        props: {
            modelValue: {},
            iconName: {},
            disabled: {
                type: Boolean
            },
            isAsh: {
                type: Boolean
            },
            modelKey: {},
            smsTimeout: {},
            type: {},
            className: {}
        },
        emits: ["update:modelValue", "iconClick", "blur", "confirm"],
        setup(s, {
            emit: f
        }) {
            const o = s,
                n = f,
                u = v(() => o.type || "text"),
                c = B(!1),
                t = v({
                    get: () => o.modelValue,
                    set: a => {
                        let e = a;
                        if (typeof e == "string" && (o.modelKey === "holderName" && (e = e.toUpperCase()), e = e.replace(/[\u200B-\u200D\uFEFF]/g, "")), u.value === "number") {
                            const l = Number(e);
                            n("update:modelValue", isNaN(l) ? "" : l)
                        } else n("update:modelValue", e)
                    }
                }),
                y = a => {
                    const e = a.target.value;
                    t.value = e
                },
                b = () => {
                    n("iconClick", t.value)
                },
                h = () => {
                    n("blur", t.value)
                },
                N = () => {
                    n("confirm", t.value)
                };
            return k(() => o.smsTimeout, (a, e) => {
                a === 0 && e === 1 && (c.value = !0)
            }, {
                immediate: !0
            }), (a, e) => {
                const l = $;
                return i(), r(C, null, [m("div", {
                    class: D(["ar-input box_shadow_1", s.isAsh && "ar-dis", s.className])
                }, [p(a.$slots, "left-icon", {}, () => [s.iconName ? (i(), V(l, {
                    key: 0,
                    name: s.iconName,
                    iconClass: "icon",
                    onClick: b
                }, null, 8, ["name"])) : d("", !0)], !0), T(m("input", F({
                    type: u.value,
                    onBlur: h,
                    "onUpdate:modelValue": e[0] || (e[0] = _ => t.value = _)
                }, a.$attrs, {
                    class: "input-field",
                    disabled: s.disabled,
                    onInput: y,
                    onKeyup: K(N, ["enter"])
                }), null, 16, I), [
                    [w, t.value]
                ]), p(a.$slots, "right-icon", {}, void 0, !0)], 2), c.value ? (i(), r("div", {
                    key: 0,
                    innerHTML: a.$t("t601"),
                    class: "errTip style0"
                }, null, 8, M)) : d("", !0)], 64)
            }
        }
    }),
    H = E(U, [
        ["__scopeId", "data-v-439f397e"]
    ]);
export {
    H as _
};