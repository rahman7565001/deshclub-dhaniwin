import {
    b8 as ee,
    e3 as j,
    R as V,
    co as pe,
    c as K,
    r as X,
    bE as le,
    O as i,
    bm as ne,
    Y as ie,
    di as Oe,
    br as ae,
    aq as L,
    ev as ze,
    bs as fe,
    bp as te,
    U as ge,
    eE as Te,
    bo as Z,
    bA as z,
    cl as E,
    bv as re,
    ap as he,
    P as De,
    S as Ue,
    T as Fe,
    p as we,
    cy as se,
    cI as _,
    cS as Ae,
    bX as Be,
    bq as W,
    eB as be,
    cM as Xe,
    an as Q,
    eF as Ye,
    eG as Le,
    ar as ye,
    cw as Ce,
    ct as Me,
    bB as Ze,
    eH as Ie,
    bH as Ee,
    bw as Ve,
    bN as ce,
    bW as ue,
    cu as He
} from "./index-BgAwOX9Q.js";
import {
    S as Ne,
    a as $e
} from "./index-MG9AFe1a.js";
import {
    I as Pe
} from "./index-kwN1oKc5.js";
const de = e => Math.sqrt((e[0].clientX - e[1].clientX) ** 2 + (e[0].clientY - e[1].clientY) ** 2),
    je = e => ({
        x: (e[0].clientX + e[1].clientX) / 2,
        y: (e[0].clientY + e[1].clientY) / 2
    }),
    oe = ne("image-preview")[1],
    ve = 2.6,
    _e = {
        src: String,
        show: Boolean,
        active: Number,
        minZoom: j(te),
        maxZoom: j(te),
        rootWidth: j(Number),
        rootHeight: j(Number),
        disableZoom: Boolean,
        doubleScale: Boolean,
        closeOnClickImage: Boolean,
        closeOnClickOverlay: Boolean,
        vertical: Boolean
    };
var We = ee({
    props: _e,
    emits: ["scale", "close", "longPress"],
    setup(e, {
        emit: l,
        slots: u
    }) {
        const a = ie({
                scale: 1,
                moveX: 0,
                moveY: 0,
                moving: !1,
                zooming: !1,
                initializing: !1,
                imageRatio: 0
            }),
            m = Oe(),
            d = X(),
            x = X(),
            C = X(!1),
            y = X(!1);
        let R = 0;
        const s = K(() => {
                const {
                    scale: o,
                    moveX: n,
                    moveY: c,
                    moving: P,
                    zooming: O,
                    initializing: B
                } = a, G = {
                    transitionDuration: O || P || B ? "0s" : ".3s"
                };
                return (o !== 1 || y.value) && (G.transform = `matrix(${o}, 0, 0, ${o}, ${n}, ${c})`), G
            }),
            f = K(() => {
                if (a.imageRatio) {
                    const {
                        rootWidth: o,
                        rootHeight: n
                    } = e, c = C.value ? n / a.imageRatio : o;
                    return Math.max(0, (a.scale * c - o) / 2)
                }
                return 0
            }),
            g = K(() => {
                if (a.imageRatio) {
                    const {
                        rootWidth: o,
                        rootHeight: n
                    } = e, c = C.value ? n : o * a.imageRatio;
                    return Math.max(0, (a.scale * c - n) / 2)
                }
                return 0
            }),
            h = (o, n) => {
                var c;
                if (o = L(o, +e.minZoom, +e.maxZoom + 1), o !== a.scale) {
                    const P = o / a.scale;
                    if (a.scale = o, n) {
                        const O = ge((c = d.value) == null ? void 0 : c.$el),
                            B = {
                                x: O.width * .5,
                                y: O.height * .5
                            },
                            G = a.moveX - (n.x - O.left - B.x) * (P - 1),
                            Re = a.moveY - (n.y - O.top - B.y) * (P - 1);
                        a.moveX = L(G, -f.value, f.value), a.moveY = L(Re, -g.value, g.value)
                    } else a.moveX = 0, a.moveY = y.value ? R : 0;
                    l("scale", {
                        scale: o,
                        index: e.active
                    })
                }
            },
            k = () => {
                h(1)
            },
            H = () => {
                const o = a.scale > 1 ? 1 : 2;
                h(o, o === 2 || y.value ? {
                    x: m.startX.value,
                    y: m.startY.value
                } : void 0)
            };
        let U, F, A, v, p, S, Y, N, t = !1;
        const r = o => {
                const {
                    touches: n
                } = o;
                if (U = n.length, U === 2 && e.disableZoom) return;
                const {
                    offsetX: c
                } = m;
                m.start(o), F = a.moveX, A = a.moveY, N = Date.now(), t = !1, a.moving = U === 1 && (a.scale !== 1 || y.value), a.zooming = U === 2 && !c.value, a.zooming && (v = a.scale, p = de(n))
            },
            I = o => {
                const {
                    touches: n
                } = o;
                if (m.move(o), a.moving) {
                    const {
                        deltaX: c,
                        deltaY: P
                    } = m, O = c.value + F, B = P.value + A;
                    if ((e.vertical ? m.isVertical() && Math.abs(B) > g.value : m.isHorizontal() && Math.abs(O) > f.value) && !t) {
                        a.moving = !1;
                        return
                    }
                    t = !0, ae(o, !0), a.moveX = L(O, -f.value, f.value), a.moveY = L(B, -g.value, g.value)
                }
                if (a.zooming && (ae(o, !0), n.length === 2)) {
                    const c = de(n),
                        P = v * c / p;
                    S = je(n), h(P, S)
                }
            },
            w = o => {
                var n;
                const c = (n = x.value) == null ? void 0 : n.$el;
                if (!c) return;
                const P = c.firstElementChild,
                    O = o.target === c,
                    B = P == null ? void 0 : P.contains(o.target);
                !e.closeOnClickImage && B || !e.closeOnClickOverlay && O || l("close")
            },
            T = o => {
                if (U > 1) return;
                const n = Date.now() - N,
                    c = 250;
                m.isTap.value && (n < c ? e.doubleScale ? Y ? (clearTimeout(Y), Y = null, H()) : Y = setTimeout(() => {
                    w(o), Y = null
                }, c) : w(o) : n > Te && l("longPress"))
            },
            D = o => {
                let n = !1;
                if ((a.moving || a.zooming) && (n = !0, a.moving && F === a.moveX && A === a.moveY && (n = !1), !o.touches.length)) {
                    a.zooming && (a.moveX = L(a.moveX, -f.value, f.value), a.moveY = L(a.moveY, -g.value, g.value), a.zooming = !1), a.moving = !1, F = 0, A = 0, v = 1, a.scale < 1 && k();
                    const c = +e.maxZoom;
                    a.scale > c && h(c, S)
                }
                ae(o, n), T(o), m.reset()
            },
            q = () => {
                const {
                    rootWidth: o,
                    rootHeight: n
                } = e, c = n / o, {
                    imageRatio: P
                } = a;
                C.value = a.imageRatio > c && P < ve, y.value = a.imageRatio > c && P >= ve, y.value && (R = (P * o - n) / 2, a.moveY = R, a.initializing = !0, ze(() => {
                    a.initializing = !1
                })), k()
            },
            $ = o => {
                const {
                    naturalWidth: n,
                    naturalHeight: c
                } = o.target;
                a.imageRatio = c / n, q()
            };
        return V(() => e.active, k), V(() => e.show, o => {
            o || k()
        }), V(() => [e.rootWidth, e.rootHeight], q), pe("touchmove", I, {
            target: K(() => {
                var o;
                return (o = x.value) == null ? void 0 : o.$el
            })
        }), le({
            resetScale: k
        }), () => {
            const o = {
                loading: () => i(fe, {
                    type: "spinner"
                }, null)
            };
            return i(Ne, {
                ref: x,
                class: oe("swipe-item"),
                onTouchstartPassive: r,
                onTouchend: D,
                onTouchcancel: D
            }, {
                default: () => [u.image ? i("div", {
                    class: oe("image-wrap")
                }, [u.image({
                    src: e.src,
                    onLoad: $,
                    style: s.value
                })]) : i(Pe, {
                    ref: d,
                    src: e.src,
                    fit: "contain",
                    class: oe("image", {
                        vertical: C.value
                    }),
                    style: s.value,
                    onLoad: $
                }, o)]
            })
        }
    }
});
const [qe, M] = ne("image-preview"), Ge = ["show", "teleport", "transition", "overlayStyle", "closeOnPopstate"], Ke = {
    show: Boolean,
    loop: z,
    images: he(),
    minZoom: E(1 / 3),
    maxZoom: E(3),
    overlay: z,
    vertical: Boolean,
    closeable: Boolean,
    showIndex: z,
    className: re,
    closeIcon: Z("clear"),
    transition: String,
    beforeClose: Function,
    doubleScale: z,
    overlayClass: re,
    overlayStyle: Object,
    swipeDuration: E(300),
    startPosition: E(0),
    showIndicators: Boolean,
    closeOnPopstate: z,
    closeOnClickImage: z,
    closeOnClickOverlay: z,
    closeIconPosition: Z("top-right"),
    teleport: [String, Object]
};
var Se = ee({
    name: qe,
    props: Ke,
    emits: ["scale", "close", "closed", "change", "longPress", "update:show"],
    setup(e, {
        emit: l,
        slots: u
    }) {
        const a = X(),
            m = X(),
            d = ie({
                active: 0,
                rootWidth: 0,
                rootHeight: 0,
                disableZoom: !1
            }),
            x = () => {
                if (a.value) {
                    const v = ge(a.value.$el);
                    d.rootWidth = v.width, d.rootHeight = v.height, a.value.resize()
                }
            },
            C = v => l("scale", v),
            y = v => l("update:show", v),
            R = () => {
                be(e.beforeClose, {
                    args: [d.active],
                    done: () => y(!1)
                })
            },
            s = v => {
                v !== d.active && (d.active = v, l("change", v))
            },
            f = () => {
                if (e.showIndex) return i("div", {
                    class: M("index")
                }, [u.index ? u.index({
                    index: d.active
                }) : `${d.active+1} / ${e.images.length}`])
            },
            g = () => {
                if (u.cover) return i("div", {
                    class: M("cover")
                }, [u.cover()])
            },
            h = () => {
                d.disableZoom = !0
            },
            k = () => {
                d.disableZoom = !1
            },
            H = () => i($e, {
                ref: a,
                lazyRender: !0,
                loop: e.loop,
                class: M("swipe"),
                vertical: e.vertical,
                duration: e.swipeDuration,
                initialSwipe: e.startPosition,
                showIndicators: e.showIndicators,
                indicatorColor: "white",
                onChange: s,
                onDragEnd: k,
                onDragStart: h
            }, {
                default: () => [e.images.map((v, p) => i(We, {
                    ref: S => {
                        p === d.active && (m.value = S)
                    },
                    src: v,
                    show: e.show,
                    active: d.active,
                    maxZoom: e.maxZoom,
                    minZoom: e.minZoom,
                    rootWidth: d.rootWidth,
                    rootHeight: d.rootHeight,
                    disableZoom: d.disableZoom,
                    doubleScale: e.doubleScale,
                    closeOnClickImage: e.closeOnClickImage,
                    closeOnClickOverlay: e.closeOnClickOverlay,
                    vertical: e.vertical,
                    onScale: C,
                    onClose: R,
                    onLongPress: () => l("longPress", {
                        index: p
                    })
                }, {
                    image: u.image
                }))]
            }),
            U = () => {
                if (e.closeable) return i(W, {
                    role: "button",
                    name: e.closeIcon,
                    class: [M("close-icon", e.closeIconPosition), Be],
                    onClick: R
                }, null)
            },
            F = () => l("closed"),
            A = (v, p) => {
                var S;
                return (S = a.value) == null ? void 0 : S.swipeTo(v, p)
            };
        return le({
            resetScale: () => {
                var v;
                (v = m.value) == null || v.resetScale()
            },
            swipeTo: A
        }), De(x), V([Ue, Fe], x), V(() => e.startPosition, v => s(+v)), V(() => e.show, v => {
            const {
                images: p,
                startPosition: S
            } = e;
            v ? (s(+S), we(() => {
                x(), A(+S, {
                    immediate: !0
                })
            })) : l("close", {
                index: d.active,
                url: p[d.active]
            })
        }), () => i(Ae, se({
            class: [M(), e.className],
            overlayClass: [M("overlay"), e.overlayClass],
            onClosed: F,
            "onUpdate:show": y
        }, _(e, Ge)), {
            default: () => [U(), H(), f(), g()]
        })
    }
});
let J;
const Je = {
    loop: !0,
    images: [],
    maxZoom: 3,
    minZoom: 1 / 3,
    onScale: void 0,
    onClose: void 0,
    onChange: void 0,
    vertical: !1,
    teleport: "body",
    className: "",
    showIndex: !0,
    closeable: !1,
    closeIcon: "clear",
    transition: void 0,
    beforeClose: void 0,
    doubleScale: !0,
    overlayStyle: void 0,
    overlayClass: void 0,
    startPosition: 0,
    swipeDuration: 300,
    showIndicators: !1,
    closeOnPopstate: !0,
    closeOnClickOverlay: !0,
    closeIconPosition: "top-right"
};

function Qe() {
    ({
        instance: J
    } = Ye({
        setup() {
            const {
                state: e,
                toggle: l
            } = Le(), u = () => {
                e.images = []
            };
            return () => i(Se, se(e, {
                onClosed: u,
                "onUpdate:show": l
            }), null)
        }
    }))
}
const ea = (e, l = 0) => {
    if (Xe) return J || Qe(), e = Array.isArray(e) ? {
        images: e,
        startPosition: l
    } : e, J.open(Q({}, Je, e)), J
};
ye(Se);
const [aa, b, oa] = ne("uploader");

function me(e, l) {
    return new Promise(u => {
        if (l === "file") {
            u();
            return
        }
        const a = new FileReader;
        a.onload = m => {
            u(m.target.result)
        }, l === "dataUrl" ? a.readAsDataURL(e) : l === "text" && a.readAsText(e)
    })
}

function xe(e, l) {
    return Ce(e).some(u => u.file ? Me(l) ? l(u.file) : u.file.size > +l : !1)
}

function ta(e, l) {
    const u = [],
        a = [];
    return e.forEach(m => {
        xe(m, l) ? a.push(m) : u.push(m)
    }), {
        valid: u,
        invalid: a
    }
}
const la = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|avif)/i,
    na = e => la.test(e);

function ke(e) {
    return e.isImage ? !0 : e.file && e.file.type ? e.file.type.indexOf("image") === 0 : e.url ? na(e.url) : typeof e.content == "string" ? e.content.indexOf("data:image") === 0 : !1
}
var ia = ee({
    props: {
        name: te,
        item: j(Object),
        index: Number,
        imageFit: String,
        lazyLoad: Boolean,
        deletable: Boolean,
        reupload: Boolean,
        previewSize: [Number, String, Array],
        beforeDelete: Function
    },
    emits: ["delete", "preview", "reupload"],
    setup(e, {
        emit: l,
        slots: u
    }) {
        const a = () => {
                const {
                    status: s,
                    message: f
                } = e.item;
                if (s === "uploading" || s === "failed") {
                    const g = s === "failed" ? i(W, {
                            name: "close",
                            class: b("mask-icon")
                        }, null) : i(fe, {
                            class: b("loading")
                        }, null),
                        h = Ze(f) && f !== "";
                    return i("div", {
                        class: b("mask")
                    }, [g, h && i("div", {
                        class: b("mask-message")
                    }, [f])])
                }
            },
            m = s => {
                const {
                    name: f,
                    item: g,
                    index: h,
                    beforeDelete: k
                } = e;
                s.stopPropagation(), be(k, {
                    args: [g, {
                        name: f,
                        index: h
                    }],
                    done: () => l("delete")
                })
            },
            d = () => l("preview"),
            x = () => l("reupload"),
            C = () => {
                if (e.deletable && e.item.status !== "uploading") {
                    const s = u["preview-delete"];
                    return i("div", {
                        role: "button",
                        class: b("preview-delete", {
                            shadow: !s
                        }),
                        tabindex: 0,
                        "aria-label": oa("delete"),
                        onClick: m
                    }, [s ? s() : i(W, {
                        name: "cross",
                        class: b("preview-delete-icon")
                    }, null)])
                }
            },
            y = () => {
                if (u["preview-cover"]) {
                    const {
                        index: s,
                        item: f
                    } = e;
                    return i("div", {
                        class: b("preview-cover")
                    }, [u["preview-cover"](Q({
                        index: s
                    }, f))])
                }
            },
            R = () => {
                const {
                    item: s,
                    lazyLoad: f,
                    imageFit: g,
                    previewSize: h,
                    reupload: k
                } = e;
                return ke(s) ? i(Pe, {
                    fit: g,
                    src: s.objectUrl || s.content || s.url,
                    class: b("preview-image"),
                    width: Array.isArray(h) ? h[0] : h,
                    height: Array.isArray(h) ? h[1] : h,
                    lazyLoad: f,
                    onClick: k ? x : d
                }, {
                    default: y
                }) : i("div", {
                    class: b("file"),
                    style: Ie(e.previewSize)
                }, [i(W, {
                    class: b("file-icon"),
                    name: "description"
                }, null), i("div", {
                    class: [b("file-name"), "van-ellipsis"]
                }, [s.file ? s.file.name : s.url]), y()])
            };
        return () => i("div", {
            class: b("preview")
        }, [R(), a(), C()])
    }
});
const sa = {
    name: E(""),
    accept: Z("image/*"),
    capture: String,
    multiple: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    lazyLoad: Boolean,
    maxCount: E(1 / 0),
    imageFit: Z("cover"),
    resultType: Z("dataUrl"),
    uploadIcon: Z("photograph"),
    uploadText: String,
    deletable: z,
    reupload: Boolean,
    afterRead: Function,
    showUpload: z,
    modelValue: he(),
    beforeRead: Function,
    beforeDelete: Function,
    previewSize: [Number, String, Array],
    previewImage: z,
    previewOptions: Object,
    previewFullImage: z,
    maxSize: {
        type: [Number, String, Function],
        default: 1 / 0
    }
};
var ra = ee({
    name: aa,
    props: sa,
    emits: ["delete", "oversize", "clickUpload", "closePreview", "clickPreview", "clickReupload", "update:modelValue"],
    setup(e, {
        emit: l,
        slots: u
    }) {
        const a = X(),
            m = [],
            d = X(-1),
            x = X(!1),
            C = (t = e.modelValue.length) => ({
                name: e.name,
                index: t
            }),
            y = () => {
                a.value && (a.value.value = "")
            },
            R = t => {
                if (y(), xe(t, e.maxSize))
                    if (Array.isArray(t)) {
                        const r = ta(t, e.maxSize);
                        if (t = r.valid, l("oversize", r.invalid, C()), !t.length) return
                    } else {
                        l("oversize", t, C());
                        return
                    }
                if (t = ie(t), d.value > -1) {
                    const r = [...e.modelValue];
                    r.splice(d.value, 1, t), l("update:modelValue", r), d.value = -1
                } else l("update:modelValue", [...e.modelValue, ...Ce(t)]);
                e.afterRead && e.afterRead(t, C())
            },
            s = t => {
                const {
                    maxCount: r,
                    modelValue: I,
                    resultType: w
                } = e;
                if (Array.isArray(t)) {
                    const T = +r - I.length;
                    t.length > T && (t = t.slice(0, T)), Promise.all(t.map(D => me(D, w))).then(D => {
                        const q = t.map(($, o) => {
                            const n = {
                                file: $,
                                status: "",
                                message: "",
                                objectUrl: URL.createObjectURL($)
                            };
                            return D[o] && (n.content = D[o]), n
                        });
                        R(q)
                    })
                } else me(t, w).then(T => {
                    const D = {
                        file: t,
                        status: "",
                        message: "",
                        objectUrl: URL.createObjectURL(t)
                    };
                    T && (D.content = T), R(D)
                })
            },
            f = t => {
                const {
                    files: r
                } = t.target;
                if (e.disabled || !r || !r.length) return;
                const I = r.length === 1 ? r[0] : [].slice.call(r);
                if (e.beforeRead) {
                    const w = e.beforeRead(I, C());
                    if (!w) {
                        y();
                        return
                    }
                    if (He(w)) {
                        w.then(T => {
                            s(T || I)
                        }).catch(y);
                        return
                    }
                }
                s(I)
            };
        let g;
        const h = () => l("closePreview"),
            k = t => {
                if (e.previewFullImage) {
                    const r = e.modelValue.filter(ke),
                        I = r.map(w => (w.objectUrl && !w.url && w.status !== "failed" && (w.url = w.objectUrl, m.push(w.url)), w.url)).filter(Boolean);
                    g = ea(Q({
                        images: I,
                        startPosition: r.indexOf(t),
                        onClose: h
                    }, e.previewOptions))
                }
            },
            H = () => {
                g && g.close()
            },
            U = (t, r) => {
                const I = e.modelValue.slice(0);
                I.splice(r, 1), l("update:modelValue", I), l("delete", t, C(r))
            },
            F = t => {
                x.value = !0, d.value = t, we(() => N())
            },
            A = () => {
                x.value || (d.value = -1), x.value = !1
            },
            v = (t, r) => {
                const I = ["imageFit", "deletable", "reupload", "previewSize", "beforeDelete"],
                    w = Q(_(e, I), _(t, I, !0));
                return i(ia, se({
                    item: t,
                    index: r,
                    onClick: () => l(e.reupload ? "clickReupload" : "clickPreview", t, C(r)),
                    onDelete: () => U(t, r),
                    onPreview: () => k(t),
                    onReupload: () => F(r)
                }, _(e, ["name", "lazyLoad"]), w), _(u, ["preview-cover", "preview-delete"]))
            },
            p = () => {
                if (e.previewImage) return e.modelValue.map(v)
            },
            S = t => l("clickUpload", t),
            Y = () => {
                const t = e.modelValue.length < +e.maxCount,
                    r = e.readonly ? null : i("input", {
                        ref: a,
                        type: "file",
                        class: b("input"),
                        accept: e.accept,
                        capture: e.capture,
                        multiple: e.multiple && d.value === -1,
                        disabled: e.disabled,
                        onChange: f,
                        onClick: A
                    }, null);
                return u.default ? ce(i("div", {
                    class: b("input-wrapper"),
                    onClick: S
                }, [u.default(), r]), [
                    [ue, t]
                ]) : ce(i("div", {
                    class: b("upload", {
                        readonly: e.readonly
                    }),
                    style: Ie(e.previewSize),
                    onClick: S
                }, [i(W, {
                    name: e.uploadIcon,
                    class: b("upload-icon")
                }, null), e.uploadText && i("span", {
                    class: b("upload-text")
                }, [e.uploadText]), r]), [
                    [ue, e.showUpload && t]
                ])
            },
            N = () => {
                a.value && !e.disabled && a.value.click()
            };
        return Ee(() => {
            m.forEach(t => URL.revokeObjectURL(t))
        }), le({
            chooseFile: N,
            reuploadFile: F,
            closeImagePreview: H
        }), Ve(() => e.modelValue), () => i("div", {
            class: b()
        }, [i("div", {
            class: b("wrapper", {
                disabled: e.disabled
            })
        }, [p(), Y()])])
    }
});
const va = ye(ra);
export {
    va as U, ea as s
};