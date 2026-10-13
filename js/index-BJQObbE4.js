import {
    bm as $,
    aq as z,
    an as S,
    bB as fe,
    b8 as X,
    e3 as N,
    ap as V,
    bp as Y,
    cv as oe,
    bE as ae,
    d9 as ve,
    r as w,
    co as le,
    O as d,
    di as he,
    br as ce,
    c as p,
    bX as J,
    bA as ie,
    cl as _,
    bD as be,
    R as L,
    e4 as j,
    bs as ge,
    cI as Q,
    cy as Oe,
    bo as Te,
    e5 as pe,
    p as W,
    e6 as ye
} from "./index-BgAwOX9Q.js";
const [ke, O, Z] = $("picker"), se = e => e.find(a => !a.disabled) || e[0];

function Ce(e, a) {
    const o = e[0];
    if (o) {
        if (Array.isArray(o)) return "multiple";
        if (a.children in o) return "cascade"
    }
    return "default"
}

function B(e, a) {
    a = z(a, 0, e.length);
    for (let o = a; o < e.length; o++)
        if (!e[o].disabled) return o;
    for (let o = a - 1; o >= 0; o--)
        if (!e[o].disabled) return o;
    return 0
}
const ee = (e, a, o) => a !== void 0 && !!e.find(s => s[o.value] === a);

function G(e, a, o) {
    const s = e.findIndex(f => f[o.value] === a),
        c = B(e, s);
    return e[c]
}

function xe(e, a, o) {
    const s = [];
    let c = {
            [a.children]: e
        },
        f = 0;
    for (; c && c[a.children];) {
        const v = c[a.children],
            h = o.value[f];
        if (c = fe(h) ? G(v, h, a) : void 0, !c && v.length) {
            const u = se(v)[a.value];
            c = G(v, u, a)
        }
        f++, s.push(v)
    }
    return s
}

function Ee(e) {
    const {
        transform: a
    } = window.getComputedStyle(e), o = a.slice(7, a.length - 1).split(", ")[5];
    return Number(o)
}

function we(e) {
    return S({
        text: "text",
        value: "value",
        children: "children"
    }, e)
}
const te = 200,
    ne = 300,
    Se = 15,
    [ue, q] = $("picker-column"),
    re = Symbol(ue);
var Ie = X({
    name: ue,
    props: {
        value: Y,
        fields: N(Object),
        options: V(),
        readonly: Boolean,
        allowHtml: Boolean,
        optionHeight: N(Number),
        swipeDuration: N(Y),
        visibleOptionNum: N(Y)
    },
    emits: ["change", "clickOption", "scrollInto"],
    setup(e, {
        emit: a,
        slots: o
    }) {
        let s, c, f, v, h;
        const u = w(),
            b = w(),
            r = w(0),
            m = w(0),
            k = he(),
            C = () => e.options.length,
            M = () => e.optionHeight * (+e.visibleOptionNum - 1) / 2,
            y = i => {
                let t = B(e.options, i);
                const n = -t * e.optionHeight,
                    l = () => {
                        t > C() - 1 && (t = B(e.options, i));
                        const T = e.options[t][e.fields.value];
                        T !== e.value && a("change", T)
                    };
                s && n !== r.value ? h = l : l(), r.value = n
            },
            g = () => e.readonly || !e.options.length,
            A = i => {
                s || g() || (h = null, m.value = te, y(i), a("clickOption", e.options[i]))
            },
            x = i => z(Math.round(-i / e.optionHeight), 0, C() - 1),
            D = p(() => x(r.value)),
            F = (i, t) => {
                const n = Math.abs(i / t);
                i = r.value + n / .003 * (i < 0 ? -1 : 1);
                const l = x(i);
                m.value = +e.swipeDuration, y(l)
            },
            I = () => {
                s = !1, m.value = 0, h && (h(), h = null)
            },
            K = i => {
                if (!g()) {
                    if (k.start(i), s) {
                        const t = Ee(b.value);
                        r.value = Math.min(0, t - M())
                    }
                    m.value = 0, c = r.value, f = Date.now(), v = c, h = null
                }
            },
            U = i => {
                if (g()) return;
                k.move(i), k.isVertical() && (s = !0, ce(i, !0));
                const t = z(c + k.deltaY.value, -(C() * e.optionHeight), e.optionHeight),
                    n = x(t);
                n !== D.value && a("scrollInto", e.options[n]), r.value = t;
                const l = Date.now();
                l - f > ne && (f = l, v = t)
            },
            P = () => {
                if (g()) return;
                const i = r.value - v,
                    t = Date.now() - f;
                if (t < ne && Math.abs(i) > Se) {
                    F(i, t);
                    return
                }
                const l = x(r.value);
                m.value = te, y(l), setTimeout(() => {
                    s = !1
                }, 0)
            },
            E = () => {
                const i = {
                    height: `${e.optionHeight}px`
                };
                return e.options.map((t, n) => {
                    const l = t[e.fields.text],
                        {
                            disabled: T
                        } = t,
                        H = t[e.fields.value],
                        de = {
                            role: "button",
                            style: i,
                            tabindex: T ? -1 : 0,
                            class: [q("item", {
                                disabled: T,
                                selected: H === e.value
                            }), t.className],
                            onClick: () => A(n)
                        },
                        me = {
                            class: "van-ellipsis",
                            [e.allowHtml ? "innerHTML" : "textContent"]: l
                        };
                    return d("li", de, [o.option ? o.option(t, n) : d("div", me, null)])
                })
            };
        return oe(re), ae({
            stopMomentum: I
        }), ve(() => {
            const i = s ? Math.floor(-r.value / e.optionHeight) : e.options.findIndex(l => l[e.fields.value] === e.value),
                t = B(e.options, i),
                n = -t * e.optionHeight;
            s && t < i && I(), r.value = n
        }), le("touchmove", U, {
            target: u
        }), () => d("div", {
            ref: u,
            class: q(),
            onTouchstartPassive: K,
            onTouchend: P,
            onTouchcancel: P
        }, [d("ul", {
            ref: b,
            style: {
                transform: `translate3d(0, ${r.value+M()}px, 0)`,
                transitionDuration: `${m.value}ms`,
                transitionProperty: m.value ? "all" : "none"
            },
            class: q("wrapper"),
            onTransitionend: I
        }, [E()])])
    }
});
const [Pe] = $("picker-toolbar"), R = {
    title: String,
    cancelButtonText: String,
    confirmButtonText: String
}, He = ["cancel", "confirm", "title", "toolbar"], Me = Object.keys(R);
var De = X({
    name: Pe,
    props: R,
    emits: ["confirm", "cancel"],
    setup(e, {
        emit: a,
        slots: o
    }) {
        const s = () => {
                if (o.title) return o.title();
                if (e.title) return d("div", {
                    class: [O("title"), "van-ellipsis"]
                }, [e.title])
            },
            c = () => a("cancel"),
            f = () => a("confirm"),
            v = () => {
                var u;
                const b = (u = e.cancelButtonText) != null ? u : Z("cancel");
                if (!(!o.cancel && !b)) return d("button", {
                    type: "button",
                    class: [O("cancel"), J],
                    onClick: c
                }, [o.cancel ? o.cancel() : b])
            },
            h = () => {
                var u;
                const b = (u = e.confirmButtonText) != null ? u : Z("confirm");
                if (!(!o.confirm && !b)) return d("button", {
                    type: "button",
                    class: [O("confirm"), J],
                    onClick: f
                }, [o.confirm ? o.confirm() : b])
            };
        return () => d("div", {
            class: O("toolbar")
        }, [o.toolbar ? o.toolbar() : [v(), s(), h()]])
    }
});
const [Ne, Re] = $("picker-group"), _e = Symbol(Ne);
S({
    tabs: V(),
    activeTab: _(0),
    nextStepText: String,
    showToolbar: ie
}, R);
const Be = S({
        loading: Boolean,
        readonly: Boolean,
        allowHtml: Boolean,
        optionHeight: _(44),
        showToolbar: ie,
        swipeDuration: _(1e3),
        visibleOptionNum: _(6)
    }, R),
    Ve = S({}, Be, {
        columns: V(),
        modelValue: V(),
        toolbarPosition: Te("top"),
        columnsFieldNames: Object
    });
var Ae = X({
    name: ke,
    props: Ve,
    emits: ["confirm", "cancel", "change", "scrollInto", "clickOption", "update:modelValue"],
    setup(e, {
        emit: a,
        slots: o
    }) {
        const s = w(),
            c = w(e.modelValue.slice(0)),
            {
                parent: f
            } = oe(_e),
            {
                children: v,
                linkChildren: h
            } = be(re);
        h();
        const u = p(() => we(e.columnsFieldNames)),
            b = p(() => ye(e.optionHeight)),
            r = p(() => Ce(e.columns, u.value)),
            m = p(() => {
                const {
                    columns: t
                } = e;
                switch (r.value) {
                    case "multiple":
                        return t;
                    case "cascade":
                        return xe(t, u.value, c);
                    default:
                        return [t]
                }
            }),
            k = p(() => m.value.some(t => t.length)),
            C = p(() => m.value.map((t, n) => G(t, c.value[n], u.value))),
            M = p(() => m.value.map((t, n) => t.findIndex(l => l[u.value.value] === c.value[n]))),
            y = (t, n) => {
                if (c.value[t] !== n) {
                    const l = c.value.slice(0);
                    l[t] = n, c.value = l
                }
            },
            g = () => ({
                selectedValues: c.value.slice(0),
                selectedOptions: C.value,
                selectedIndexes: M.value
            }),
            A = (t, n) => {
                y(n, t), r.value === "cascade" && c.value.forEach((l, T) => {
                    const H = m.value[T];
                    ee(H, l, u.value) || y(T, H.length ? H[0][u.value.value] : void 0)
                }), W(() => {
                    a("change", S({
                        columnIndex: n
                    }, g()))
                })
            },
            x = (t, n) => {
                const l = {
                    columnIndex: n,
                    currentOption: t
                };
                a("clickOption", S(g(), l)), a("scrollInto", l)
            },
            D = () => {
                v.forEach(n => n.stopMomentum());
                const t = g();
                return W(() => {
                    a("confirm", t)
                }), t
            },
            F = () => a("cancel", g()),
            I = () => m.value.map((t, n) => d(Ie, {
                value: c.value[n],
                fields: u.value,
                options: t,
                readonly: e.readonly,
                allowHtml: e.allowHtml,
                optionHeight: b.value,
                swipeDuration: e.swipeDuration,
                visibleOptionNum: e.visibleOptionNum,
                onChange: l => A(l, n),
                onClickOption: l => x(l, n),
                onScrollInto: l => {
                    a("scrollInto", {
                        currentOption: l,
                        columnIndex: n
                    })
                }
            }, {
                option: o.option
            })),
            K = t => {
                if (k.value) {
                    const n = {
                            height: `${b.value}px`
                        },
                        l = {
                            backgroundSize: `100% ${(t-b.value)/2}px`
                        };
                    return [d("div", {
                        class: O("mask"),
                        style: l
                    }, null), d("div", {
                        class: [pe, O("frame")],
                        style: n
                    }, null)]
                }
            },
            U = () => {
                const t = b.value * +e.visibleOptionNum,
                    n = {
                        height: `${t}px`
                    };
                return d("div", {
                    ref: s,
                    class: O("columns"),
                    style: n
                }, [I(), K(t)])
            },
            P = () => {
                if (e.showToolbar && !f) return d(De, Oe(Q(e, Me), {
                    onConfirm: D,
                    onCancel: F
                }), Q(o, He))
            };
        L(m, t => {
            t.forEach((n, l) => {
                n.length && !ee(n, c.value[l], u.value) && y(l, se(n)[u.value.value])
            })
        }, {
            immediate: !0
        });
        let E;
        return L(() => e.modelValue, t => {
            !j(t, c.value) && !j(t, E) && (c.value = t.slice(0), E = t.slice(0))
        }, {
            deep: !0
        }), L(c, t => {
            j(t, e.modelValue) || (E = t.slice(0), a("update:modelValue", E))
        }, {
            immediate: !0
        }), le("touchmove", ce, {
            target: s
        }), ae({
            confirm: D,
            getSelectedOptions: () => C.value
        }), () => {
            var t, n;
            return d("div", {
                class: O()
            }, [e.toolbarPosition === "top" ? P() : null, e.loading ? d(ge, {
                class: O("loading")
            }, null) : null, (t = o["columns-top"]) == null ? void 0 : t.call(o), U(), (n = o["columns-bottom"]) == null ? void 0 : n.call(o), e.toolbarPosition === "bottom" ? P() : null])
        }
    }
});
export {
    Be as p, Ae as s
};