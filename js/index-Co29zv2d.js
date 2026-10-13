import {
    b8 as z,
    bp as p,
    bm as K,
    O as n,
    r as x,
    di as D,
    br as H,
    bs as L,
    bA as T,
    bo as k,
    cl as I,
    R as _,
    es as M,
    cc as E,
    bf as N,
    bX as $,
    bN as F,
    bW as R,
    cy as U,
    et as j,
    bY as Y,
    c as Z,
    ar as O,
    bn as W,
    eu as X,
    bx as q,
    aZ as G,
    aU as J,
    b0 as Q,
    a_ as ee,
    bd as te,
    bg as se,
    aY as ne
} from "./index-BgAwOX9Q.js";
const [ae, C] = K("key"), le = n("svg", {
    class: C("collapse-icon"),
    viewBox: "0 0 30 24"
}, [n("path", {
    d: "M26 13h-2v2h2v-2zm-8-3h2V8h-2v2zm2-4h2V4h-2v2zm2 4h4V4h-2v4h-2v2zm-7 14 3-3h-6l3 3zM6 13H4v2h2v-2zm16 0H8v2h14v-2zm-12-3h2V8h-2v2zM28 0l1 1 1 1v15l-1 2H1l-1-2V2l1-1 1-1zm0 2H2v15h26V2zM6 4v2H4V4zm10 2h2V4h-2v2zM8 9v1H4V8zm8 0v1h-2V8zm-6-5v2H8V4zm4 0v2h-2V4z",
    fill: "currentColor"
}, null)]), oe = n("svg", {
    class: C("delete-icon"),
    viewBox: "0 0 32 22"
}, [n("path", {
    d: "M28 0a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H10.4a2 2 0 0 1-1.4-.6L1 13.1c-.6-.5-.9-1.3-.9-2 0-1 .3-1.7.9-2.2L9 .6a2 2 0 0 1 1.4-.6zm0 2H10.4l-8.2 8.3a1 1 0 0 0-.3.7c0 .3.1.5.3.7l8.2 8.4H28a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2zm-5 4a1 1 0 0 1 .7.3 1 1 0 0 1 0 1.4L20.4 11l3.3 3.3c.2.2.3.5.3.7 0 .3-.1.5-.3.7a1 1 0 0 1-.7.3 1 1 0 0 1-.7-.3L19 12.4l-3.4 3.3a1 1 0 0 1-.6.3 1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7c0-.2.1-.5.3-.7l3.3-3.3-3.3-3.3A1 1 0 0 1 14 7c0-.3.1-.5.3-.7A1 1 0 0 1 15 6a1 1 0 0 1 .6.3L19 9.6l3.3-3.3A1 1 0 0 1 23 6z",
    fill: "currentColor"
}, null)]);
var S = z({
    name: ae,
    props: {
        type: String,
        text: p,
        color: String,
        wider: Boolean,
        large: Boolean,
        loading: Boolean
    },
    emits: ["press"],
    setup(e, {
        emit: o,
        slots: r
    }) {
        const l = x(!1),
            i = D(),
            d = a => {
                i.start(a), l.value = !0
            },
            m = a => {
                i.move(a), i.direction.value && (l.value = !1)
            },
            f = a => {
                l.value && (r.default || H(a), l.value = !1, o("press", e.text, e.type))
            },
            y = () => {
                if (e.loading) return n(L, {
                    class: C("loading-icon")
                }, null);
                const a = r.default ? r.default() : e.text;
                switch (e.type) {
                    case "delete":
                        return a || oe;
                    case "extra":
                        return a || le;
                    default:
                        return a
                }
            };
        return () => n("div", {
            class: C("wrapper", {
                wider: e.wider
            }),
            onTouchstartPassive: d,
            onTouchmovePassive: m,
            onTouchend: f,
            onTouchcancel: f
        }, [n("div", {
            role: "button",
            tabindex: 0,
            class: C([e.color, {
                large: e.large,
                active: l.value,
                delete: e.type === "delete"
            }])
        }, [y()])])
    }
});
const [re, g] = K("number-keyboard"), ie = {
    show: Boolean,
    title: String,
    theme: k("default"),
    zIndex: p,
    teleport: [String, Object],
    maxlength: I(1 / 0),
    modelValue: k(""),
    transition: T,
    blurOnClose: T,
    showDeleteKey: T,
    randomKeyOrder: Boolean,
    closeButtonText: String,
    deleteButtonText: String,
    closeButtonLoading: Boolean,
    hideOnClickOutside: T,
    safeAreaInsetBottom: T,
    extraKey: {
        type: [String, Array],
        default: ""
    }
};

function ue(e) {
    for (let o = e.length - 1; o > 0; o--) {
        const r = Math.floor(Math.random() * (o + 1)),
            l = e[o];
        e[o] = e[r], e[r] = l
    }
    return e
}
var ce = z({
    name: re,
    inheritAttrs: !1,
    props: ie,
    emits: ["show", "hide", "blur", "input", "close", "delete", "update:modelValue"],
    setup(e, {
        emit: o,
        slots: r,
        attrs: l
    }) {
        const i = x(),
            d = () => {
                const s = Array(9).fill("").map((u, c) => ({
                    text: c + 1
                }));
                return e.randomKeyOrder && ue(s), s
            },
            m = () => [...d(), {
                text: e.extraKey,
                type: "extra"
            }, {
                text: 0
            }, {
                text: e.showDeleteKey ? e.deleteButtonText : "",
                type: e.showDeleteKey ? "delete" : ""
            }],
            f = () => {
                const s = d(),
                    {
                        extraKey: u
                    } = e,
                    c = Array.isArray(u) ? u : [u];
                return c.length === 0 ? s.push({
                    text: 0,
                    wider: !0
                }) : c.length === 1 ? s.push({
                    text: 0,
                    wider: !0
                }, {
                    text: c[0],
                    type: "extra"
                }) : c.length === 2 && s.push({
                    text: c[0],
                    type: "extra"
                }, {
                    text: 0
                }, {
                    text: c[1],
                    type: "extra"
                }), s
            },
            y = Z(() => e.theme === "custom" ? f() : m()),
            a = () => {
                e.show && o("blur")
            },
            h = () => {
                o("close"), e.blurOnClose && a()
            },
            t = () => o(e.show ? "show" : "hide"),
            v = (s, u) => {
                if (s === "") {
                    u === "extra" && a();
                    return
                }
                const c = e.modelValue;
                u === "delete" ? (o("delete"), o("update:modelValue", c.slice(0, c.length - 1))) : u === "close" ? h() : c.length < +e.maxlength && (o("input", s), o("update:modelValue", c + s))
            },
            b = () => {
                const {
                    title: s,
                    theme: u,
                    closeButtonText: c
                } = e, V = r["title-left"], A = c && u === "default";
                if (s || A || V) return n("div", {
                    class: g("header")
                }, [V && n("span", {
                    class: g("title-left")
                }, [V()]), s && n("h2", {
                    class: g("title")
                }, [s]), A && n("button", {
                    type: "button",
                    class: [g("close"), $],
                    onClick: h
                }, [c])])
            },
            w = () => y.value.map(s => {
                const u = {};
                return s.type === "delete" && (u.default = r.delete), s.type === "extra" && (u.default = r["extra-key"]), n(S, {
                    key: s.text,
                    text: s.text,
                    type: s.type,
                    wider: s.wider,
                    color: s.color,
                    onPress: v
                }, u)
            }),
            P = () => {
                if (e.theme === "custom") return n("div", {
                    class: g("sidebar")
                }, [e.showDeleteKey && n(S, {
                    large: !0,
                    text: e.deleteButtonText,
                    type: "delete",
                    onPress: v
                }, {
                    default: r.delete
                }), n(S, {
                    large: !0,
                    text: e.closeButtonText,
                    type: "close",
                    color: "blue",
                    loading: e.closeButtonLoading,
                    onPress: v
                }, null)])
            };
        return _(() => e.show, s => {
            e.transition || o(s ? "show" : "hide")
        }), e.hideOnClickOutside && M(i, a, {
            eventName: "touchstart"
        }), () => {
            const s = b(),
                u = n(E, {
                    name: e.transition ? "van-slide-up" : ""
                }, {
                    default: () => [F(n("div", U({
                        ref: i,
                        style: Y(e.zIndex),
                        class: g({
                            unfit: !e.safeAreaInsetBottom,
                            "with-title": !!s
                        }),
                        onAnimationend: t,
                        onTouchstartPassive: j
                    }, l), [s, n("div", {
                        class: g("body")
                    }, [n("div", {
                        class: g("keys")
                    }, [w()]), P()])]), [
                        [R, e.show]
                    ])]
                });
            return e.teleport ? n(N, {
                to: e.teleport
            }, {
                default: () => [u]
            }) : u
        }
    }
});
const de = O(ce),
    [fe, B] = K("password-input"),
    he = {
        info: String,
        mask: T,
        value: k(""),
        gutter: p,
        length: I(6),
        focused: Boolean,
        errorInfo: String
    };
var ve = z({
    name: fe,
    props: he,
    emits: ["focus"],
    setup(e, {
        emit: o
    }) {
        const r = i => {
                i.stopPropagation(), o("focus", i)
            },
            l = () => {
                const i = [],
                    {
                        mask: d,
                        value: m,
                        gutter: f,
                        focused: y
                    } = e,
                    a = +e.length;
                for (let h = 0; h < a; h++) {
                    const t = m[h],
                        v = h !== 0 && !f,
                        b = y && h === m.length;
                    let w;
                    h !== 0 && f && (w = {
                        marginLeft: q(f)
                    }), i.push(n("li", {
                        class: [{
                            [X]: v
                        }, B("item", {
                            focus: b
                        })],
                        style: w
                    }, [d ? n("i", {
                        style: {
                            visibility: t ? "visible" : "hidden"
                        }
                    }, null) : t, b && n("div", {
                        class: B("cursor")
                    }, null)]))
                }
                return i
            };
        return () => {
            const i = e.errorInfo || e.info;
            return n("div", {
                class: B()
            }, [n("ul", {
                class: [B("security"), {
                    [W]: !e.gutter
                }],
                onTouchstartPassive: r
            }, [l()]), i && n("div", {
                class: B(e.errorInfo ? "error-info" : "info")
            }, [i])])
        }
    }
});
const me = O(ve),
    ge = {
        class: "password-input"
    },
    ye = {
        class: "header"
    },
    xe = z({
        __name: "index",
        props: {
            isFocus: {
                type: Boolean
            },
            value: {},
            loading: {
                type: Boolean
            }
        },
        emits: ["finish"],
        setup(e, {
            emit: o
        }) {
            const r = e,
                l = x(r.value || ""),
                i = o,
                d = x(!1),
                m = x(r.loading || !1),
                f = x(!1);

            function y() {
                f.value || (d.value = !1)
            }
            const a = x("");

            function h() {
                if (f.value = !0, a.value = "", l.value.length !== 6) {
                    a.value = "Please enter the correct format", setTimeout(() => {
                        f.value = !1
                    }, 100), setTimeout(() => {
                        a.value = ""
                    }, 3e3);
                    return
                }
                i("finish", l.value, t => {
                    if (setTimeout(() => {
                            f.value = !1
                        }, 100), t != null && t.isClear && !(t != null && t.errTip)) {
                        l.value = "";
                        return
                    }
                    if (t != null && t.isClear && (l.value = ""), t != null && t.errTip) {
                        a.value = t.errTip, setTimeout(() => {
                            a.value = ""
                        }, 3e3);
                        return
                    }
                    d.value = !1
                })
            }
            return _(() => r.value, t => {
                l.value = t || ""
            }), _(l, t => {
                t.length >= 6 && h()
            }), _(() => r.loading, t => {
                m.value = t || !1
            }), _(() => r.isFocus, t => {
                t && (d.value = t)
            }, {
                immediate: !0
            }), (t, v) => {
                const b = me,
                    w = de;
                return J(), G("div", ge, [Q("div", ye, [ee(t.$slots, "header", {}, void 0, !0)]), n(b, {
                    value: l.value,
                    class: "ar_password-input",
                    gutter: 10,
                    length: 6,
                    focused: d.value,
                    "error-info": a.value,
                    onFocus: v[0] || (v[0] = P => d.value = !0)
                }, null, 8, ["value", "focused", "error-info"]), n(w, {
                    modelValue: l.value,
                    "onUpdate:modelValue": v[1] || (v[1] = P => l.value = P),
                    class: te({
                        ar_keyboard: !0,
                        is_loading: m.value
                    }),
                    show: d.value,
                    theme: "custom",
                    "random-key-order": !0,
                    "close-button-loading": m.value,
                    transition: !1,
                    maxlength: 6,
                    onClose: h,
                    onBlur: y
                }, {
                    "extra-key": se(() => [...v[2] || (v[2] = [])]),
                    _: 1
                }, 8, ["modelValue", "class", "show", "close-button-loading"])])
            }
        }
    }),
    Te = ne(xe, [
        ["__scopeId", "data-v-2717dc11"]
    ]);
export {
    Te as P
};