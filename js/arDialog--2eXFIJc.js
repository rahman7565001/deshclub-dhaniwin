import {
    b8 as V,
    bG as S,
    R as C,
    cb as c,
    r as g,
    c as $,
    P as D,
    aT as i,
    aU as a,
    bg as z,
    aZ as l,
    ba as o,
    bO as P,
    be as p,
    b0 as B,
    bd as N,
    a_ as b,
    bb as w,
    m as E,
    a$ as u,
    b1 as d,
    O as F,
    b_ as L,
    cc as M,
    aY as O
} from "./index-BgAwOX9Q.js";
const Z = ["src"],
    G = {
        class: "dialog-body"
    },
    R = {
        key: 1,
        class: "dialog-footer"
    },
    U = V({
        __name: "arDialog",
        props: {
            modelValue: {
                type: Boolean
            },
            title: {},
            mask: {
                type: Boolean
            },
            iconName: {},
            btnText: {},
            btn2Text: {},
            closeIconBtn: {
                type: Boolean
            },
            maskClosable: {
                type: Boolean,
                default: !0
            },
            contentClass: {},
            hiddenFoot: {
                type: Boolean,
                default: !1
            },
            isPromptDialog: {
                type: Boolean,
                default: !1
            },
            isBorder: {
                type: Boolean,
                default: !1
            }
        },
        emits: ["update:modelValue", "commit", "close", "open", "promptEvent", "onclose"],
        setup(e, {
            emit: h
        }) {
            const {
                getImgVal: T
            } = E(), v = e, n = g(!1), f = S(document.body), m = g(1e3), k = $(() => v.modelValue), s = h;
            C(() => v.modelValue, t => {
                t ? (f.value = !0, c.value += 1, m.value = c.value, s("open")) : f.value = !1
            }, {
                immediate: !0
            });
            const r = () => {
                s("update:modelValue", !1), s("close")
            };
            C(() => k.value, t => {
                t || s("onclose")
            });
            const x = () => {
                    n.value = !n.value, s("promptEvent", !n.value)
                },
                I = () => {
                    s("commit")
                };
            return D(() => {
                c.value += 1, m.value = c.value
            }), (t, y) => (a(), i(M, {
                name: "van-fade",
                appear: ""
            }, {
                default: z(() => [k.value ? (a(), l("div", {
                    key: 0,
                    class: "dialog",
                    style: p({
                        backgroundColor: e.mask ? "rgba(0, 0, 0, 0.6)" : "transparent",
                        zIndex: m.value
                    }),
                    onClick: y[0] || (y[0] = P(() => {
                        e.maskClosable && r()
                    }, ["self"]))
                }, [B("div", {
                    class: N(["dialog-content", [e.contentClass]])
                }, [b(t.$slots, "head", {}, () => [e.iconName === "icon_success_tip" ? (a(), l("img", {
                    key: 0,
                    src: w(T)("icon_success_tip"),
                    alt: "icon_success_tip",
                    class: "headIcon"
                }, null, 8, Z)) : e.iconName && e.iconName !== "icon_success_tip" ? (a(), i(u, {
                    key: 1,
                    name: e.iconName,
                    class: "headIcon"
                }, null, 8, ["name"])) : e.iconName ? (a(), i(u, {
                    key: 2,
                    name: e.iconName,
                    class: "headIcon"
                }, null, 8, ["name"])) : o("", !0)], !0), e.title ? (a(), l("div", {
                    key: 0,
                    class: N(["dialog-title", {
                        border: e.isBorder
                    }])
                }, d(e.title), 3)) : o("", !0), B("div", G, [b(t.$slots, "default", {}, void 0, !0)]), e.hiddenFoot ? o("", !0) : (a(), l("footer", R, [b(t.$slots, "footer", {}, void 0, !0), e.btnText ? (a(), l("div", {
                    key: 0,
                    class: "subBtn btn_main_style",
                    onClick: I
                }, d(e.btnText), 1)) : o("", !0), e.btn2Text ? (a(), l("div", {
                    key: 1,
                    class: "subBtn2",
                    onClick: r
                }, d(e.btn2Text), 1)) : o("", !0)])), e.isPromptDialog ? (a(), l("div", {
                    key: 2,
                    class: "isNoTip",
                    onClick: x
                }, [F(u, {
                    name: n.value ? "icon_select" : "icon_noSelect",
                    iconClass: "selectIcon"
                }, null, 8, ["name"]), L(" " + d(t.$t("t833")), 1)])) : o("", !0), e.closeIconBtn ? (a(), i(u, {
                    key: 3,
                    name: "icon_close03",
                    iconClass: e.isPromptDialog ? "close close2" : "close",
                    onClick: r
                }, null, 8, ["iconClass"])) : o("", !0)], 2)], 4)) : o("", !0)]),
                _: 3
            }))
        }
    }),
    j = O(U, [
        ["__scopeId", "data-v-a24ce958"]
    ]);
export {
    j as _
};