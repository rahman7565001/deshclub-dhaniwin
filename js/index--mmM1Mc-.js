import {
    ev as Q,
    ew as de,
    ex as ue,
    ey as Ne,
    cM as Oe,
    c9 as He,
    bH as Le,
    ez as fe,
    b8 as M,
    cl as O,
    bo as ve,
    bp as z,
    bm as Z,
    cm as be,
    r as I,
    R as $,
    Y as he,
    co as me,
    cp as p,
    p as P,
    U as H,
    S as ge,
    T as Ee,
    O as g,
    c as R,
    e6 as we,
    an as ye,
    bY as De,
    ar as J,
    e3 as X,
    P as We,
    bE as ee,
    bA as W,
    bD as Me,
    c8 as Ze,
    Q as Fe,
    bx as ie,
    bB as G,
    ep as Ue,
    cs as Ve,
    eA as oe,
    eB as Ye,
    eC as je,
    cv as Ke,
    d9 as Xe,
    bd as qe,
    eD as Qe,
    be as pe,
    dj as Ge,
    bN as Je,
    bW as et,
    bv as tt,
    cy as nt,
    cI as re,
    N as at,
    cA as lt
} from "./index-BgAwOX9Q.js";
import {
    u as xe
} from "./use-id-FH6KOsM0.js";
import {
    a as it,
    r as ot
} from "./use-route-CdVOVz1N.js";
import {
    T as rt
} from "./use-tab-status-B8-Im3BY.js";
import {
    a as st,
    S as ct
} from "./index-MG9AFe1a.js";
import {
    u as dt
} from "./use-refs-Buuv236d.js";

function ut(e, l, i) {
    let r, d = 0;
    const t = e.scrollLeft,
        o = i === 0 ? 1 : Math.round(i * 1e3 / 16);
    let s = t;

    function b() {
        de(r)
    }

    function m() {
        s += (l - t) / o, e.scrollLeft = s, ++d < o && (r = Q(m))
    }
    return m(), b
}

function ft(e, l, i, r) {
    let d, t = ue(e);
    const o = t < l,
        s = i === 0 ? 1 : Math.round(i * 1e3 / 16),
        b = (l - t) / s;

    function m() {
        de(d)
    }

    function y() {
        t += b, (o && t > l || !o && t < l) && (t = l), Ne(e, t), o && t < l || !o && t > l ? d = Q(y) : r && (d = Q(r))
    }
    return y(), m
}

function Te(e, l) {
    if (!Oe || !window.IntersectionObserver) return;
    const i = new IntersectionObserver(t => {
            l(t[0].intersectionRatio > 0)
        }, {
            root: document.body
        }),
        r = () => {
            e.value && i.observe(e.value)
        },
        d = () => {
            e.value && i.unobserve(e.value)
        };
    He(d), Le(d), fe(r)
}
const [vt, bt] = Z("sticky"), ht = {
    zIndex: z,
    position: ve("top"),
    container: Object,
    offsetTop: O(0),
    offsetBottom: O(0)
};
var mt = M({
    name: vt,
    props: ht,
    emits: ["scroll", "change"],
    setup(e, {
        emit: l,
        slots: i
    }) {
        const r = I(),
            d = be(r),
            t = he({
                fixed: !1,
                width: 0,
                height: 0,
                transform: 0
            }),
            o = I(!1),
            s = R(() => we(e.position === "top" ? e.offsetTop : e.offsetBottom)),
            b = R(() => {
                if (o.value) return;
                const {
                    fixed: f,
                    height: S,
                    width: u
                } = t;
                if (f) return {
                    width: `${u}px`,
                    height: `${S}px`
                }
            }),
            m = R(() => {
                if (!t.fixed || o.value) return;
                const f = ye(De(e.zIndex), {
                    width: `${t.width}px`,
                    height: `${t.height}px`,
                    [e.position]: `${s.value}px`
                });
                return t.transform && (f.transform = `translate3d(0, ${t.transform}px, 0)`), f
            }),
            y = f => l("scroll", {
                scrollTop: f,
                isFixed: t.fixed
            }),
            k = () => {
                if (!r.value || p(r)) return;
                const {
                    container: f,
                    position: S
                } = e, u = H(r), T = ue(window);
                if (t.width = u.width, t.height = u.height, S === "top")
                    if (f) {
                        const c = H(f),
                            B = c.bottom - s.value - t.height;
                        t.fixed = s.value > u.top && c.bottom > 0, t.transform = B < 0 ? B : 0
                    } else t.fixed = s.value > u.top;
                else {
                    const {
                        clientHeight: c
                    } = document.documentElement;
                    if (f) {
                        const B = H(f),
                            h = c - B.top - s.value - t.height;
                        t.fixed = c - s.value < u.bottom && c > B.top, t.transform = h < 0 ? -h : 0
                    } else t.fixed = c - s.value < u.bottom
                }
                y(T)
            };
        return $(() => t.fixed, f => l("change", f)), me("scroll", k, {
            target: d,
            passive: !0
        }), Te(r, k), $([ge, Ee], () => {
            !r.value || p(r) || !t.fixed || (o.value = !0, P(() => {
                const f = H(r);
                t.width = f.width, t.height = f.height, o.value = !1
            }))
        }), () => {
            var f;
            return g("div", {
                ref: r,
                style: b.value
            }, [g("div", {
                class: bt({
                    fixed: t.fixed && !o.value
                }),
                style: m.value
            }, [(f = i.default) == null ? void 0 : f.call(i)])])
        }
    }
});
const gt = J(mt),
    [wt, se] = Z("tabs");
var yt = M({
    name: wt,
    props: {
        count: X(Number),
        inited: Boolean,
        animated: Boolean,
        duration: X(z),
        swipeable: Boolean,
        lazyRender: Boolean,
        currentIndex: X(Number)
    },
    emits: ["change"],
    setup(e, {
        emit: l,
        slots: i
    }) {
        const r = I(),
            d = s => l("change", s),
            t = () => {
                var s;
                const b = (s = i.default) == null ? void 0 : s.call(i);
                return e.animated || e.swipeable ? g(st, {
                    ref: r,
                    loop: !1,
                    class: se("track"),
                    duration: +e.duration * 1e3,
                    touchable: e.swipeable,
                    lazyRender: e.lazyRender,
                    showIndicators: !1,
                    onChange: d
                }, {
                    default: () => [b]
                }) : b
            },
            o = s => {
                const b = r.value;
                b && b.state.active !== s && b.swipeTo(s, {
                    immediate: !e.inited
                })
            };
        return $(() => e.currentIndex, o), We(() => {
            o(e.currentIndex)
        }), ee({
            swipeRef: r
        }), () => g("div", {
            class: se("content", {
                animated: e.animated || e.swipeable
            })
        }, [t()])
    }
});
const [Se, K] = Z("tabs"), xt = {
    type: ve("line"),
    color: String,
    border: Boolean,
    sticky: Boolean,
    shrink: Boolean,
    active: O(0),
    duration: O(.3),
    animated: Boolean,
    ellipsis: W,
    swipeable: Boolean,
    scrollspy: Boolean,
    offsetTop: O(0),
    background: String,
    lazyRender: W,
    showHeader: W,
    lineWidth: z,
    lineHeight: z,
    beforeChange: Function,
    swipeThreshold: O(5),
    titleActiveColor: String,
    titleInactiveColor: String
}, Ce = Symbol(Se);
var Tt = M({
    name: Se,
    props: xt,
    emits: ["change", "scroll", "rendered", "clickTab", "update:active"],
    setup(e, {
        emit: l,
        slots: i
    }) {
        let r, d, t, o, s;
        const b = I(),
            m = I(),
            y = I(),
            k = I(),
            f = xe(),
            S = be(b),
            [u, T] = dt(),
            {
                children: c,
                linkChildren: B
            } = Me(Ce),
            h = he({
                inited: !1,
                position: "",
                lineStyle: {},
                currentIndex: -1
            }),
            L = R(() => c.length > +e.swipeThreshold || !e.ellipsis || e.shrink),
            F = R(() => ({
                borderColor: e.color,
                background: e.background
            })),
            E = (n, a) => {
                var v;
                return (v = n.name) != null ? v : a
            },
            U = R(() => {
                const n = c[h.currentIndex];
                if (n) return E(n, h.currentIndex)
            }),
            N = R(() => we(e.offsetTop)),
            te = R(() => e.sticky ? N.value + r : 0),
            D = n => {
                const a = m.value,
                    v = u.value;
                if (!L.value || !a || !v || !v[h.currentIndex]) return;
                const x = v[h.currentIndex].$el,
                    w = x.offsetLeft - (a.offsetWidth - x.offsetWidth) / 2;
                o && o(), o = ut(a, w, n ? 0 : +e.duration)
            },
            _ = () => {
                const n = h.inited;
                P(() => {
                    const a = u.value;
                    if (!a || !a[h.currentIndex] || e.type !== "line" || p(b.value)) return;
                    const v = a[h.currentIndex].$el,
                        {
                            lineWidth: x,
                            lineHeight: w
                        } = e,
                        C = v.offsetLeft + v.offsetWidth / 2,
                        A = {
                            width: ie(x),
                            backgroundColor: e.color,
                            transform: `translateX(${C}px) translateX(-50%)`
                        };
                    if (n && (A.transitionDuration = `${e.duration}s`), G(w)) {
                        const j = ie(w);
                        A.height = j, A.borderRadius = j
                    }
                    h.lineStyle = A
                })
            },
            Ie = n => {
                const a = n < h.currentIndex ? -1 : 1;
                for (; n >= 0 && n < c.length;) {
                    if (!c[n].disabled) return n;
                    n += a
                }
            },
            V = (n, a) => {
                const v = Ie(n);
                if (!G(v)) return;
                const x = c[v],
                    w = E(x, v),
                    C = h.currentIndex !== null;
                h.currentIndex !== v && (h.currentIndex = v, a || D(), _()), w !== e.active && (l("update:active", w), C && l("change", w, x.title)), t && !e.scrollspy && Ve(Math.ceil(oe(b.value) - N.value))
            },
            Y = (n, a) => {
                const v = c.find((w, C) => E(w, C) === n),
                    x = v ? c.indexOf(v) : 0;
                V(x, a)
            },
            ne = (n = !1) => {
                if (e.scrollspy) {
                    const a = c[h.currentIndex].$el;
                    if (a && S.value) {
                        const v = oe(a, S.value) - te.value;
                        d = !0, s && s(), s = ft(S.value, v, n ? 0 : +e.duration, () => {
                            d = !1
                        })
                    }
                }
            },
            Re = (n, a, v) => {
                const {
                    title: x,
                    disabled: w
                } = c[a], C = E(c[a], a);
                w || (Ye(e.beforeChange, {
                    args: [C],
                    done: () => {
                        V(a), ne()
                    }
                }), it(n)), l("clickTab", {
                    name: C,
                    title: x,
                    event: v,
                    disabled: w
                })
            },
            ke = n => {
                t = n.isFixed, l("scroll", n)
            },
            Be = n => {
                P(() => {
                    Y(n), ne(!0)
                })
            },
            $e = () => {
                for (let n = 0; n < c.length; n++) {
                    const {
                        top: a
                    } = H(c[n].$el);
                    if (a > te.value) return n === 0 ? 0 : n - 1
                }
                return c.length - 1
            },
            _e = () => {
                if (e.scrollspy && !d) {
                    const n = $e();
                    V(n)
                }
            },
            Ae = () => {
                if (e.type === "line" && c.length) return g("div", {
                    class: K("line"),
                    style: h.lineStyle
                }, null)
            },
            ae = () => {
                var n, a, v;
                const {
                    type: x,
                    border: w,
                    sticky: C
                } = e, A = [g("div", {
                    ref: C ? void 0 : y,
                    class: [K("wrap"), {
                        [Ue]: x === "line" && w
                    }]
                }, [g("div", {
                    ref: m,
                    role: "tablist",
                    class: K("nav", [x, {
                        shrink: e.shrink,
                        complete: L.value
                    }]),
                    style: F.value,
                    "aria-orientation": "horizontal"
                }, [(n = i["nav-left"]) == null ? void 0 : n.call(i), c.map(j => j.renderTitle(Re)), Ae(), (a = i["nav-right"]) == null ? void 0 : a.call(i)])]), (v = i["nav-bottom"]) == null ? void 0 : v.call(i)];
                return C ? g("div", {
                    ref: y
                }, [A]) : A
            },
            le = () => {
                _(), P(() => {
                    var n, a;
                    D(!0), (a = (n = k.value) == null ? void 0 : n.swipeRef.value) == null || a.resize()
                })
            };
        $(() => [e.color, e.duration, e.lineWidth, e.lineHeight], _), $(ge, le), $(() => e.active, n => {
            n !== U.value && Y(n)
        }), $(() => c.length, () => {
            h.inited && (Y(e.active), _(), P(() => {
                D(!0)
            }))
        });
        const Pe = () => {
                Y(e.active, !0), P(() => {
                    h.inited = !0, y.value && (r = H(y.value).height), D(!0)
                })
            },
            ze = (n, a) => l("rendered", n, a);
        return ee({
            resize: le,
            scrollTo: Be
        }), Ze(_), Fe(_), fe(Pe), Te(b, _), me("scroll", _e, {
            target: S,
            passive: !0
        }), B({
            id: f,
            props: e,
            setLine: _,
            scrollable: L,
            onRendered: ze,
            currentName: U,
            setTitleRefs: T,
            scrollIntoView: D
        }), () => g("div", {
            ref: b,
            class: K([e.type])
        }, [e.showHeader ? e.sticky ? g(gt, {
            container: b.value,
            offsetTop: N.value,
            onScroll: ke
        }, {
            default: () => [ae()]
        }) : ae() : null, g(yt, {
            ref: k,
            count: c.length,
            inited: h.inited,
            animated: e.animated,
            duration: e.duration,
            swipeable: e.swipeable,
            lazyRender: e.lazyRender,
            currentIndex: h.currentIndex,
            onChange: V
        }, {
            default: () => {
                var n;
                return [(n = i.default) == null ? void 0 : n.call(i)]
            }
        })])
    }
});
const [St, ce] = Z("tab"), Ct = M({
    name: St,
    props: {
        id: String,
        dot: Boolean,
        type: String,
        color: String,
        title: String,
        badge: z,
        shrink: Boolean,
        isActive: Boolean,
        disabled: Boolean,
        controls: String,
        scrollable: Boolean,
        activeColor: String,
        inactiveColor: String,
        showZeroBadge: W
    },
    setup(e, {
        slots: l
    }) {
        const i = R(() => {
                const d = {},
                    {
                        type: t,
                        color: o,
                        disabled: s,
                        isActive: b,
                        activeColor: m,
                        inactiveColor: y
                    } = e;
                o && t === "card" && (d.borderColor = o, s || (b ? d.backgroundColor = o : d.color = o));
                const f = b ? m : y;
                return f && (d.color = f), d
            }),
            r = () => {
                const d = g("span", {
                    class: ce("text", {
                        ellipsis: !e.scrollable
                    })
                }, [l.title ? l.title() : e.title]);
                return e.dot || G(e.badge) && e.badge !== "" ? g(je, {
                    dot: e.dot,
                    content: e.badge,
                    showZero: e.showZeroBadge
                }, {
                    default: () => [d]
                }) : d
            };
        return () => g("div", {
            id: e.id,
            role: "tab",
            class: [ce([e.type, {
                grow: e.scrollable && !e.shrink,
                shrink: e.shrink,
                active: e.isActive,
                disabled: e.disabled
            }])],
            style: i.value,
            tabindex: e.disabled ? void 0 : e.isActive ? 0 : -1,
            "aria-selected": e.isActive,
            "aria-disabled": e.disabled || void 0,
            "aria-controls": e.controls,
            "data-allow-mismatch": "attribute"
        }, [r()])
    }
}), [It, q] = Z("tab"), Rt = ye({}, ot, {
    dot: Boolean,
    name: z,
    badge: z,
    title: String,
    disabled: Boolean,
    titleClass: tt,
    titleStyle: [String, Object],
    showZeroBadge: W
});
var kt = M({
    name: It,
    props: Rt,
    setup(e, {
        slots: l
    }) {
        const i = xe(),
            r = I(!1),
            d = at(),
            {
                parent: t,
                index: o
            } = Ke(Ce);
        if (!t) return;
        const s = () => {
                var u;
                return (u = e.name) != null ? u : o.value
            },
            b = () => {
                r.value = !0, t.props.lazyRender && P(() => {
                    t.onRendered(s(), e.title)
                })
            },
            m = R(() => {
                const u = s() === t.currentName.value;
                return u && !r.value && b(), u
            }),
            y = I(""),
            k = I("");
        Xe(() => {
            const {
                titleClass: u,
                titleStyle: T
            } = e;
            y.value = u ? qe(u) : "", k.value = T && typeof T != "string" ? Qe(pe(T)) : T
        });
        const f = u => g(Ct, nt({
                key: i,
                id: `${t.id}-${o.value}`,
                ref: t.setTitleRefs(o.value),
                style: k.value,
                class: y.value,
                isActive: m.value,
                controls: i,
                scrollable: t.scrollable.value,
                activeColor: t.props.titleActiveColor,
                inactiveColor: t.props.titleInactiveColor,
                onClick: T => u(d.proxy, o.value, T)
            }, re(t.props, ["type", "color", "shrink"]), re(e, ["dot", "badge", "title", "disabled", "showZeroBadge"])), {
                title: l.title
            }),
            S = I(!m.value);
        return $(m, u => {
            u ? S.value = !1 : Ge(() => {
                S.value = !0
            })
        }), $(() => e.title, () => {
            t.setLine(), t.scrollIntoView()
        }), lt(rt, m), ee({
            id: i,
            renderTitle: f
        }), () => {
            var u;
            const T = `${t.id}-${o.value}`,
                {
                    animated: c,
                    swipeable: B,
                    scrollspy: h,
                    lazyRender: L
                } = t.props;
            if (!l.default && !c) return;
            const F = h || m.value;
            if (c || B) return g(ct, {
                id: i,
                role: "tabpanel",
                class: q("panel-wrapper", {
                    inactive: S.value
                }),
                tabindex: m.value ? 0 : -1,
                "aria-hidden": !m.value,
                "aria-labelledby": T,
                "data-allow-mismatch": "attribute"
            }, {
                default: () => {
                    var N;
                    return [g("div", {
                        class: q("panel")
                    }, [(N = l.default) == null ? void 0 : N.call(l)])]
                }
            });
            const U = r.value || h || !L ? (u = l.default) == null ? void 0 : u.call(l) : null;
            return Je(g("div", {
                id: i,
                role: "tabpanel",
                class: q("panel"),
                tabindex: F ? 0 : -1,
                "aria-labelledby": T,
                "data-allow-mismatch": "attribute"
            }, [U]), [
                [et, F]
            ])
        }
    }
});
const Nt = J(kt),
    Ot = J(Tt);
export {
    Ot as T, Nt as a
};