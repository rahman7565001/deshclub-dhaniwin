const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["js/lottie_light-C-DwA73m.js", "js/index-BgAwOX9Q.js", "css/index-DgM0Jizq.css"]))) => i.map(i => d[i]);
import {
    b8 as p,
    R as _,
    r as v,
    bH as b,
    P as h,
    aT as y,
    aU as C,
    bg as k,
    b0 as t,
    b1 as s,
    bj as A,
    c0 as B,
    aX as g,
    aY as R
} from "./index-BgAwOX9Q.js";
import {
    d as V
} from "./active-D6grRBZQ.js";
const U = {
        class: "content"
    },
    w = {
        class: "title"
    },
    D = {
        class: "number"
    },
    I = {
        class: "tip"
    },
    N = p({
        __name: "ReceivedGift",
        props: {
            amount: {
                type: Number,
                required: !0
            },
            visible: {
                type: Boolean,
                default: !1
            }
        },
        emits: ["handleClose"],
        setup(i, {
            emit: c
        }) {
            const l = i,
                d = c,
                u = B(async () => g(() =>
                    import ("./lottie_light-C-DwA73m.js").then(e => e.l), __vite__mapDeps([0, 1, 2]))),
                o = v(null);
            let a = null;
            const r = () => {
                    d("handleClose")
                },
                m = async e => {
                    o.value && (a && a.destroy(), a = (await u()).loadAnimation({
                        container: o.value,
                        renderer: "canvas",
                        loop: !1,
                        autoplay: !0,
                        path: e
                    }))
                };
            return _(() => o.value, e => {
                e && m(V)
            }, {
                immediate: !0
            }), b(() => {
                a && (a.destroy(), a = null)
            }), h(async () => {}), (e, n) => (C(), y(A, {
                modelValue: l.visible,
                "onUpdate:modelValue": n[0] || (n[0] = f => l.visible = f),
                hideClose: !1,
                maskNotClose: !0,
                title: "",
                onClose: r
            }, {
                default: k(() => [t("div", U, [t("div", w, s(e.$t("t870")), 1), t("div", null, [t("div", {
                    class: "giftpackAnimat",
                    ref_key: "lottieAnit",
                    ref: o
                }, null, 512), t("div", D, s(i.amount), 1), t("p", I, s(e.$t("t862")), 1)]), t("div", {
                    class: "confirmBtn",
                    onClick: r
                }, s(e.$t("t29")), 1)])]),
                _: 1
            }, 8, ["modelValue"]))
        }
    }),
    E = R(N, [
        ["__scopeId", "data-v-f0499f79"]
    ]);
export {
    E as R
};