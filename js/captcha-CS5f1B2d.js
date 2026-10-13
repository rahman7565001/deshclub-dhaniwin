import {
    b8 as ne,
    R as ue,
    r as s,
    c as r,
    aj as de,
    aT as ce,
    aU as o,
    bg as ve,
    b0 as a,
    be as n,
    aZ as i,
    ba as y,
    bN as he,
    bd as W,
    bW as fe,
    b1 as q,
    cS as pe,
    p as ge,
    aY as we
} from "./index-BgAwOX9Q.js";
const ye = ["src"],
    me = ["src"],
    _e = {
        key: 1,
        class: "captcha_message"
    },
    xe = {
        class: "captcha_message__icon"
    },
    be = {
        key: 0,
        height: "28",
        viewBox: "0 0 28 28",
        width: "28",
        xmlns: "http://www.w3.org/2000/svg"
    },
    ke = {
        key: 1,
        height: "28",
        viewBox: "0 0 28 28",
        width: "28",
        xmlns: "http://www.w3.org/2000/svg"
    },
    Ce = {
        class: "captcha_message__text"
    },
    Se = {
        key: 2,
        class: "captcha_message loadding"
    },
    Re = {
        key: 3,
        class: "captcha_message"
    },
    Le = {
        key: 0,
        class: "captcha__actions"
    },
    He = ["fill"],
    Be = ne({
        __name: "captcha",
        props: {
            width: {
                type: Number,
                default: 340
            },
            height: {
                type: Number,
                default: 212
            },
            barHeight: {
                type: Number,
                default: 40
            },
            handlerIconWidth: {
                type: Number,
                default: 16
            },
            handlerIconHeigth: {
                type: Number,
                default: 16
            },
            background: {
                type: String,
                default: "#eee"
            },
            circle: {
                type: Boolean,
                default: !1
            },
            radius: {
                type: String,
                default: "4px"
            },
            text: {
                type: String,
                default: ""
            },
            progressBarBg: {
                type: String,
                default: "#76c61d"
            },
            successTip: {
                type: String,
                default: "Verification passed, over 80% of users."
            },
            failTip: {
                type: String,
                default: "Verification failed, drag the slider to correctly merge the floating image."
            },
            showRefresh: {
                type: Boolean,
                default: !1
            },
            refreshColor: {
                type: String,
                default: "#505050"
            }
        },
        emits: ["finish", "refresh"],
        setup(m, {
            expose: P,
            emit: X
        }) {
            const t = m,
                N = X,
                _ = s(!1),
                h = s(!1),
                H = s(0),
                B = s(0),
                M = s(!1),
                j = s(!1),
                f = s(!1),
                T = s([]),
                E = s(void 0),
                V = s(!1),
                x = s(!1),
                b = s(!1),
                u = s(""),
                d = s(""),
                c = s(!1),
                p = s(!1),
                g = s(!1),
                z = r(() => p.value && g.value);
            ue(z, l => {
                l && (b.value = !1)
            });
            const G = r(() => ({
                    width: t.width + "px",
                    height: t.height + "px",
                    position: "relative",
                    overflow: "hidden"
                })),
                U = r(() => ({
                    width: t.width + "px"
                })),
                K = r(() => ({
                    width: t.width + "px",
                    height: t.barHeight + "px",
                    lineHeight: t.barHeight + "px",
                    background: t.background,
                    borderRadius: t.circle ? t.barHeight / 2 + "px" : t.radius
                })),
                Z = r(() => ({
                    background: t.progressBarBg,
                    height: t.barHeight + "px",
                    borderRadius: t.circle ? t.barHeight / 2 + "px 0 0 " + t.barHeight / 2 + "px" : t.radius
                })),
                A = r(() => ({
                    height: t.barHeight + "px",
                    width: t.width + "px"
                })),
                O = r(() => ({
                    width: t.barHeight + "px",
                    height: t.barHeight - 2 + "px"
                })),
                J = r(() => ({
                    width: t.handlerIconWidth + "px",
                    height: t.handlerIconHeigth + "px"
                })),
                Q = r(() => t.refreshColor),
                ee = r(() => ({
                    color: t.refreshColor
                })),
                k = s(),
                C = s(),
                D = s(),
                v = s(),
                S = s(),
                te = () => {
                    _.value = !0, ge(() => {
                        F(), oe()
                    }), b.value = !0
                },
                ae = (l, e) => {
                    p.value = !1, g.value = !1, u.value = l, d.value = e
                },
                se = () => {
                    x.value = !0
                },
                le = l => {
                    l.value = l, x.value = !1, V.value = !0
                },
                F = () => {
                    H.value = 0, B.value = 0, T.value = [], h.value = !1, f.value = !1, b.value = !1, x.value = !1, V.value = !1, c.value = !1, p.value = !1, g.value = !1, C && (C.value.style.width = 0), v && (v.value.style.left = 0), S && (S.value.style.left = 0)
                },
                Y = () => {
                    window.removeEventListener("touchmove", R), window.removeEventListener("touchend", L), window.removeEventListener("mousemove", R), window.removeEventListener("mouseup", L)
                },
                $ = l => {
                    z.value && !c.value && u.value && d.value && !f.value && (window.addEventListener("touchmove", R), window.addEventListener("touchend", L), window.addEventListener("mousemove", R), window.addEventListener("mouseup", L), h.value = !0, E.value = new Date, H.value = l.pageX || l.touches[0].pageX, B.value = l.pageY || l.touches[0].pageY)
                },
                R = l => {
                    if (h.value && !c.value && u.value && d.value && !f.value) {
                        const e = (l.pageX || l.touches[0].pageX) - H.value,
                            I = (l.pageY || l.touches[0].pageY) - B.value;
                        S.value.style.left = e + "px", C.value.style.width = e + t.barHeight / 2 + "px", v.value.style.left = e + "px", T.value.push({
                            x: Math.round(e),
                            y: Math.round(I),
                            t: new Date().getTime() - E.value.getTime()
                        })
                    }
                },
                L = () => {
                    h.value && !c.value && u.value && d.value && !f.value && (h.value = !1, f.value = !0, Y(), N("finish", {
                        backgroundImageWidth: D.value.offsetWidth,
                        backgroundImageHeight: D.value.offsetHeight,
                        sliderImageWidth: v.value.offsetWidth,
                        sliderImageHeight: v.value.offsetHeight,
                        startTime: E.value,
                        endTime: new Date,
                        tracks: T.value
                    }))
                },
                re = l => {
                    _.value = l
                },
                oe = () => {
                    k.value.style.setProperty("--textColor", "#999999"), k.value.style.setProperty("--width", Math.floor(t.width / 2) + "px"), k.value.style.setProperty("--pwidth", -Math.floor(t.width / 2) + "px")
                },
                ie = () => {
                    F(), N("refresh")
                };
            return P({
                startRequestVerify: se,
                endRequestVerify: le,
                startRequestGenerate: te,
                endRequestGenerate: ae,
                setShowHiden: re
            }), de(() => {
                Y()
            }), (l, e) => {
                const I = pe;
                return o(), ce(I, {
                    show: _.value,
                    "onUpdate:show": e[4] || (e[4] = w => _.value = w),
                    teleport: "body"
                }, {
                    default: ve(() => [a("div", {
                        class: "captcha",
                        style: n(U.value)
                    }, [a("div", {
                        class: "captcha__main",
                        style: n(G.value)
                    }, [u.value ? (o(), i("img", {
                        key: 0,
                        ref_key: "backgroundRef",
                        ref: D,
                        alt: "background",
                        class: "captcha_background",
                        src: u.value,
                        onLoad: e[0] || (e[0] = w => p.value = !0),
                        onError: e[1] || (e[1] = w => p.value = !1)
                    }, null, 40, ye)) : y("", !0), he(a("img", {
                        ref_key: "sliderRef",
                        ref: v,
                        alt: "slider",
                        class: W(["captcha_slider", {
                            goFirst: M.value,
                            goKeep: j.value
                        }]),
                        src: d.value,
                        onLoad: e[2] || (e[2] = w => g.value = !0),
                        onError: e[3] || (e[3] = w => g.value = !1)
                    }, null, 42, me), [
                        [fe, d.value]
                    ]), V.value ? (o(), i("div", _e, [a("div", xe, [c.value ? (o(), i("svg", be, [...e[5] || (e[5] = [a("g", {
                        fill: "none",
                        "fill-rule": "evenodd",
                        stroke: "#fff",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "1.5"
                    }, [a("path", {
                        d: "M22.776 4.073A13.2 13.2 0 0 0 14 .75C6.682.75.75 6.682.75 14S6.682 27.25 14 27.25 27.25 21.318 27.25 14c0-.284-.009-.566-.027-.845"
                    }), a("path", {
                        d: "M7 12.5l7 7 13-13"
                    })], -1)])])) : (o(), i("svg", ke, [...e[6] || (e[6] = [a("g", {
                        fill: "none",
                        "fill-rule": "evenodd",
                        stroke: "#fff",
                        "stroke-width": "1.5"
                    }, [a("circle", {
                        cx: "14",
                        cy: "14",
                        r: "13.25"
                    }), a("path", {
                        d: "M8.75 8.75l10.5 10.5M19.25 8.75l-10.5 10.5",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                    })], -1)])]))]), a("div", Ce, q(c.value ? m.successTip : m.failTip), 1)])) : y("", !0), b.value ? (o(), i("div", Se, [...e[7] || (e[7] = [a("div", {
                        class: "captcha_message__icon captcha_message__icon--loadding"
                    }, null, -1), a("div", {
                        class: "captcha_message__text"
                    }, "loading...", -1)])])) : y("", !0), x.value ? (o(), i("div", Re, [...e[8] || (e[8] = [a("div", {
                        class: "captcha_message__icon captcha_message__icon--loadding"
                    }, null, -1), a("div", {
                        class: "captcha_message__text"
                    }, null, -1)])])) : y("", !0)], 4), a("div", {
                        ref_key: "dragVerifyRef",
                        ref: k,
                        class: "captcha__bar",
                        style: n(K.value)
                    }, [a("div", {
                        ref_key: "progressBarRef",
                        ref: C,
                        class: W(["captcha_progress_bar", {
                            goFirst2: M.value
                        }]),
                        style: n(Z.value)
                    }, null, 6), a("div", {
                        class: "captcha_progress_bar__text",
                        style: n(A.value)
                    }, q(l.$t("t1080")), 5), a("div", {
                        ref_key: "handlerRef",
                        ref: S,
                        class: W(["captcha_handler", {
                            goFirst: M.value
                        }]),
                        style: n(O.value),
                        onMousedown: $,
                        onTouchstart: $
                    }, [(o(), i("svg", {
                        "p-id": "819",
                        style: n(J.value),
                        version: "1.1",
                        viewBox: "0 0 1024 1024",
                        xmlns: "http://www.w3.org/2000/svg"
                    }, [...e[9] || (e[9] = [a("path", {
                        d: "M500.864 545.728a47.744 47.744 0 0 0 6.72-48.896 24.704 24.704 0 0 0-4.48-8.384L240.256 193.088a34.24 34.24 0 0 0-28.608-17.408 34.24 34.24 0 0 0-25.856 12.864 46.592 46.592 0 0 0 0 59.52l238.08 264.512-238.08 264.512a46.592 46.592 0 0 0-1.088 59.52 32 32 0 0 0 50.56 0l265.6-290.88z",
                        "p-id": "820"
                    }, null, -1), a("path", {
                        d: "M523.84 248.064l236.992 264.512-238.08 264.512a46.592 46.592 0 0 0 0 59.52 32 32 0 0 0 50.56 0l265.6-292.608a47.744 47.744 0 0 0 6.72-48.832 24.704 24.704 0 0 0-4.48-8.448L578.304 191.36a34.24 34.24 0 0 0-55.552-2.816 46.592 46.592 0 0 0 1.088 59.52z",
                        "p-id": "821"
                    }, null, -1)])], 4))], 38)], 4), m.showRefresh ? (o(), i("div", Le, [a("a", {
                        class: "captcha__action",
                        style: n(ee.value),
                        onClick: ie
                    }, [(o(), i("svg", {
                        fill: Q.value,
                        height: "20px",
                        version: "1.1",
                        viewBox: "0 0 20 20",
                        width: "20px",
                        xmlns: "http://www.w3.org/2000/svg"
                    }, [...e[10] || (e[10] = [a("path", {
                        d: "M10,4 C12.0559549,4 13.9131832,5.04358655 15.0015086,6.68322231 L15,5.5 C15,5.22385763 15.2238576,5 15.5,5 C15.7761424,5 16,5.22385763 16,5.5 L16,8.5 C16,8.77614237 15.7761424,9 15.5,9 L12.5,9 C12.2238576,9 12,8.77614237 12,8.5 C12,8.22385763 12.2238576,8 12.5,8 L14.5842317,8.00000341 C13.7999308,6.20218044 12.0143541,5 10,5 C7.23857625,5 5,7.23857625 5,10 C5,12.7614237 7.23857625,15 10,15 C11.749756,15 13.3431487,14.0944653 14.2500463,12.6352662 C14.3958113,12.4007302 14.7041063,12.328767 14.9386423,12.4745321 C15.1731784,12.6202971 15.2451415,12.9285921 15.0993765,13.1631281 C14.0118542,14.9129524 12.0990688,16 10,16 C6.6862915,16 4,13.3137085 4,10 C4,6.6862915 6.6862915,4 10,4 Z",
                        "fill-rule": "nonzero"
                    }, null, -1)])], 8, He))], 4)])) : y("", !0)], 4)]),
                    _: 1
                }, 8, ["show"])
            }
        }
    }),
    Te = we(Be, [
        ["__scopeId", "data-v-541186c6"]
    ]);
export {
    Te as C
};