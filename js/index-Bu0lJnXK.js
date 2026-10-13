import {
    b8 as _,
    aT as f,
    aU as a,
    bg as v,
    b0 as o,
    aZ as n,
    ba as i,
    bb as c,
    m as y,
    b1 as l,
    O as b,
    a$ as g,
    bJ as x,
    aY as k
} from "./index-BgAwOX9Q.js";
import {
    c as C
} from "./currency-DTUBf2lI.js";
const V = {
        class: "wrapper"
    },
    h = {
        class: "received-dialog"
    },
    w = {
        class: "top-img"
    },
    B = ["src"],
    S = {
        class: "received-text"
    },
    N = {
        class: "received-money"
    },
    T = {
        key: 0,
        class: "received-tips"
    },
    $ = _({
        __name: "index",
        props: {
            modelValue: {
                type: Boolean,
                default: !1
            },
            title: {
                type: String,
                default: ""
            },
            money: {
                type: Number,
                default: 0
            },
            tips: {
                type: String,
                default: ""
            },
            btnText: {
                type: String,
                default: ""
            },
            showClose: {
                type: Boolean,
                default: !1
            }
        },
        emits: ["update:modelValue", "confirm", "close"],
        setup(d, {
            emit: r
        }) {
            const {
                getImgVal: p
            } = y(), e = d, s = r;
            return (D, t) => {
                const m = g;
                return a(), f(c(x), {
                    show: e.modelValue,
                    onClick: t[2] || (t[2] = u => s("update:modelValue", !1)),
                    teleport: "body",
                    "z-index": "1000"
                }, {
                    default: v(() => [o("div", V, [o("div", h, [o("div", w, [o("img", {
                        src: c(p)("icon_successfully"),
                        alt: "",
                        class: "img"
                    }, null, 8, B)]), o("div", S, l(e.title), 1), o("div", N, l(c(C)(e.money || 0)), 1), e.tips ? (a(), n("div", T, l(e.tips), 1)) : i("", !0), e.btnText ? (a(), n("div", {
                        key: 1,
                        class: "receive-btn",
                        onClick: t[0] || (t[0] = u => s("confirm"))
                    }, l(e.btnText), 1)) : i("", !0), e.showClose ? (a(), n("div", {
                        key: 2,
                        class: "close-icon",
                        onClick: t[1] || (t[1] = () => {
                            s("update:modelValue", !1), s == null || s("close")
                        })
                    }, [b(m, {
                        name: "close",
                        class: "icon",
                        iconClass: "icon"
                    })])) : i("", !0)])])]),
                    _: 1
                }, 8, ["show"])
            }
        }
    }),
    z = k($, [
        ["__scopeId", "data-v-622161da"]
    ]);
export {
    z as r
};