import {
    b8 as F,
    bA as z,
    cl as _,
    bp as V,
    bm as K,
    bE as Q,
    bD as re,
    c as d,
    R as A,
    Y as U,
    S as ve,
    T as fe,
    dh as de,
    P as G,
    c8 as he,
    Q as ge,
    c9 as me,
    bH as we,
    co as be,
    r as j,
    O as E,
    cp as q,
    p as J,
    di as ye,
    br as xe,
    dj as I,
    aq as R,
    ar as Z,
    cv as Se
} from "./index-BgAwOX9Q.js";
const [ee, M] = K("swipe"), Te = {
    loop: z,
    width: V,
    height: V,
    vertical: Boolean,
    autoplay: _(0),
    duration: _(500),
    touchable: z,
    lazyRender: Boolean,
    initialSwipe: _(0),
    indicatorColor: String,
    showIndicators: z,
    stopPropagation: z
}, te = Symbol(ee);
var pe = F({
    name: ee,
    props: Te,
    emits: ["change", "dragStart", "dragEnd"],
    setup(a, {
        emit: y,
        slots: g
    }) {
        const u = j(),
            h = j(),
            t = U({
                rect: null,
                width: 0,
                height: 0,
                offset: 0,
                active: 0,
                swiping: !1
            });
        let x = !1;
        const r = ye(),
            {
                children: m,
                linkChildren: s
            } = re(te),
            i = d(() => m.length),
            o = d(() => t[a.vertical ? "height" : "width"]),
            v = d(() => a.vertical ? r.deltaY.value : r.deltaX.value),
            b = d(() => t.rect ? (a.vertical ? t.rect.height : t.rect.width) - o.value * i.value : 0),
            O = d(() => o.value ? Math.ceil(Math.abs(b.value) / o.value) : i.value),
            k = d(() => i.value * o.value),
            S = d(() => (t.active + i.value) % i.value),
            Y = d(() => {
                const e = a.vertical ? "vertical" : "horizontal";
                return r.direction.value === e
            }),
            ae = d(() => {
                const e = {
                    transitionDuration: `${t.swiping?0:a.duration}ms`,
                    transform: `translate${a.vertical?"Y":"X"}(${+t.offset.toFixed(2)}px)`
                };
                if (o.value) {
                    const l = a.vertical ? "height" : "width",
                        n = a.vertical ? "width" : "height";
                    e[l] = `${k.value}px`, e[n] = a[n] ? `${a[n]}px` : ""
                }
                return e
            }),
            ie = e => {
                const {
                    active: l
                } = t;
                return e ? a.loop ? R(l + e, -1, i.value) : R(l + e, 0, O.value) : l
            },
            B = (e, l = 0) => {
                let n = e * o.value;
                a.loop || (n = Math.min(n, -b.value));
                let f = l - n;
                return a.loop || (f = R(f, b.value, 0)), f
            },
            w = ({
                pace: e = 0,
                offset: l = 0,
                emitChange: n
            }) => {
                if (i.value <= 1) return;
                const {
                    active: f
                } = t, c = ie(e), C = B(c, l);
                if (a.loop) {
                    if (m[0] && C !== b.value) {
                        const D = C < b.value;
                        m[0].setOffset(D ? k.value : 0)
                    }
                    if (m[i.value - 1] && C !== 0) {
                        const D = C > 0;
                        m[i.value - 1].setOffset(D ? -k.value : 0)
                    }
                }
                t.active = c, t.offset = C, n && c !== f && y("change", S.value)
            },
            $ = () => {
                t.swiping = !0, t.active <= -1 ? w({
                    pace: i.value
                }) : t.active >= i.value && w({
                    pace: -i.value
                })
            },
            ne = () => {
                $(), r.reset(), I(() => {
                    t.swiping = !1, w({
                        pace: -1,
                        emitChange: !0
                    })
                })
            },
            H = () => {
                $(), r.reset(), I(() => {
                    t.swiping = !1, w({
                        pace: 1,
                        emitChange: !0
                    })
                })
            };
        let X;
        const p = () => clearTimeout(X),
            P = () => {
                p(), +a.autoplay > 0 && i.value > 1 && (X = setTimeout(() => {
                    H(), P()
                }, +a.autoplay))
            },
            T = (e = +a.initialSwipe) => {
                if (!u.value) return;
                const l = () => {
                    var n, f;
                    if (!q(u)) {
                        const c = {
                            width: u.value.offsetWidth,
                            height: u.value.offsetHeight
                        };
                        t.rect = c, t.width = +((n = a.width) != null ? n : c.width), t.height = +((f = a.height) != null ? f : c.height)
                    }
                    i.value && (e = Math.min(i.value - 1, e), e === -1 && (e = i.value - 1)), t.active = e, t.swiping = !0, t.offset = B(e), m.forEach(c => {
                        c.setOffset(0)
                    }), P()
                };
                q(u) ? J().then(l) : l()
            },
            N = () => T(t.active);
        let W;
        const le = e => {
                !a.touchable || e.touches.length > 1 || (r.start(e), x = !1, W = Date.now(), p(), $())
            },
            oe = e => {
                a.touchable && t.swiping && (r.move(e), Y.value && (!a.loop && (t.active === 0 && v.value > 0 || t.active === i.value - 1 && v.value < 0) || (xe(e, a.stopPropagation), w({
                    offset: v.value
                }), x || (y("dragStart", {
                    index: S.value
                }), x = !0))))
            },
            L = () => {
                if (!a.touchable || !t.swiping) return;
                const e = Date.now() - W,
                    l = v.value / e;
                if ((Math.abs(l) > .25 || Math.abs(v.value) > o.value / 2) && Y.value) {
                    const f = a.vertical ? r.offsetY.value : r.offsetX.value;
                    let c = 0;
                    a.loop ? c = f > 0 ? v.value > 0 ? -1 : 1 : 0 : c = -Math[v.value > 0 ? "ceil" : "floor"](v.value / o.value), w({
                        pace: c,
                        emitChange: !0
                    })
                } else v.value && w({
                    pace: 0
                });
                x = !1, t.swiping = !1, y("dragEnd", {
                    index: S.value
                }), P()
            },
            se = (e, l = {}) => {
                $(), r.reset(), I(() => {
                    let n;
                    a.loop && e === i.value ? n = t.active === 0 ? 0 : e : n = e % i.value, l.immediate ? I(() => {
                        t.swiping = !1
                    }) : t.swiping = !1, w({
                        pace: n - t.active,
                        emitChange: !0
                    })
                })
            },
            ce = (e, l) => {
                const n = l === S.value,
                    f = n ? {
                        backgroundColor: a.indicatorColor
                    } : void 0;
                return E("i", {
                    style: f,
                    class: M("indicator", {
                        active: n
                    })
                }, null)
            },
            ue = () => {
                if (g.indicator) return g.indicator({
                    active: S.value,
                    total: i.value
                });
                if (a.showIndicators && i.value > 1) return E("div", {
                    class: M("indicators", {
                        vertical: a.vertical
                    })
                }, [Array(i.value).fill("").map(ce)])
            };
        return Q({
            prev: ne,
            next: H,
            state: t,
            resize: N,
            swipeTo: se
        }), s({
            size: o,
            props: a,
            count: i,
            activeIndicator: S
        }), A(() => a.initialSwipe, e => T(+e)), A(i, () => T(t.active)), A(() => a.autoplay, P), A([ve, fe, () => a.width, () => a.height], N), A(de(), e => {
            e === "visible" ? P() : p()
        }), G(T), he(() => T(t.active)), ge(() => T(t.active)), me(p), we(p), be("touchmove", oe, {
            target: h
        }), () => {
            var e;
            return E("div", {
                ref: u,
                class: M()
            }, [E("div", {
                ref: h,
                style: ae.value,
                class: M("track", {
                    vertical: a.vertical
                }),
                onTouchstartPassive: le,
                onTouchend: L,
                onTouchcancel: L
            }, [(e = g.default) == null ? void 0 : e.call(g)]), ue()])
        }
    }
});
const $e = Z(pe),
    [Pe, Ce] = K("swipe-item");
var Ae = F({
    name: Pe,
    setup(a, {
        slots: y
    }) {
        let g;
        const u = U({
                offset: 0,
                inited: !1,
                mounted: !1
            }),
            {
                parent: h,
                index: t
            } = Se(te);
        if (!h) return;
        const x = d(() => {
                const s = {},
                    {
                        vertical: i
                    } = h.props;
                return h.size.value && (s[i ? "height" : "width"] = `${h.size.value}px`), u.offset && (s.transform = `translate${i?"Y":"X"}(${u.offset}px)`), s
            }),
            r = d(() => {
                const {
                    loop: s,
                    lazyRender: i
                } = h.props;
                if (!i || g) return !0;
                if (!u.mounted) return !1;
                const o = h.activeIndicator.value,
                    v = h.count.value - 1,
                    b = o === 0 && s ? v : o - 1,
                    O = o === v && s ? 0 : o + 1;
                return g = t.value === o || t.value === b || t.value === O, g
            }),
            m = s => {
                u.offset = s
            };
        return G(() => {
            J(() => {
                u.mounted = !0
            })
        }), Q({
            setOffset: m
        }), () => {
            var s;
            return E("div", {
                class: Ce(),
                style: x.value
            }, [r.value ? (s = y.default) == null ? void 0 : s.call(y) : null])
        }
    }
});
const ze = Z(Ae);
export {
    ze as S, $e as a
};