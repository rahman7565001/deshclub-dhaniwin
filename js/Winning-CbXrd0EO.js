const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["js/lottie_light-C-DwA73m.js", "js/index-BgAwOX9Q.js", "css/index-DgM0Jizq.css"]))) => i.map(i => d[i]);
import {
    b8 as N,
    t as I,
    aZ as v,
    aU as o,
    b0 as e,
    O as $,
    b1 as s,
    bb as C,
    a$ as V,
    aY as B,
    d2 as P,
    aT as T,
    ba as D,
    a_ as x,
    bd as y,
    c as W,
    bg as Y,
    aV as z,
    dY as F,
    cg as R,
    cY as J,
    dp as A,
    bN as U,
    r as h,
    Y as X,
    bh as Z,
    b_ as S,
    bO as G,
    bW as j,
    cc as q,
    c0 as K,
    aX as Q
} from "./index-BgAwOX9Q.js";
import {
    G as ee,
    w as ae,
    l as se,
    L as ne,
    W as te
} from "./tips-DMib3O3U.js";
import {
    c as E
} from "./currency-DTUBf2lI.js";
import {
    a as oe,
    u as le
} from "./WingoSkeleton.vue_vue_type_style_index_0_scoped_cd4f34e3_lang-CZJCWYiN.js"; /* empty css                                                             */
import {
    a as ie
} from "./BetRule-DyIqbhnc.js";
const ce = {
        class: "Wallet__C"
    },
    re = {
        class: "Wallet__C-balance"
    },
    ue = {
        class: "Wallet__C-balance-l1"
    },
    de = {
        class: "Wallet__C-balance-l2"
    },
    me = {
        class: "Wallet__C-balance-l3"
    },
    ve = N({
        __name: "Wallet",
        setup(w) {
            const {
                balance: g,
                updateBalance: _
            } = oe(), t = I(), m = l => {
                t.push({
                    name: l
                })
            };
            return (l, n) => {
                const i = V;
                return o(), v("div", ce, [e("div", re, [e("div", ue, [e("span", null, s(C(E)(C(g))), 1), $(i, {
                    onClick: C(_),
                    name: "icon_refresh",
                    iconClass: "refresh"
                }, null, 8, ["onClick"])]), e("div", de, [$(i, {
                    name: "icon_nva_wallet"
                }), e("div", null, s(l.$t("common.walletBalance")), 1)]), e("div", me, [e("div", {
                    onClick: n[0] || (n[0] = r => m("withdraw"))
                }, s(l.$t("common.withdraw")), 1), e("div", {
                    onClick: n[1] || (n[1] = r => m("recharge"))
                }, s(l.$t("common.recharge")), 1)])])])
            }
        }
    }),
    _e = B(ve, [
        ["__scopeId", "data-v-af90d420"]
    ]),
    pe = {
        class: "lottery-info"
    },
    fe = {
        class: "more"
    },
    he = N({
        __name: "main",
        props: {
            wallte: {
                type: Boolean,
                default: !0
            },
            soundEffects: {
                type: Boolean,
                default: !0
            },
            navigation: {
                type: String,
                default: null
            }
        },
        emits: ["switchSound"],
        setup(w, {
            emit: g
        }) {
            const _ = w,
                t = g,
                {
                    lotteryInlineNavigation: m
                } = P(),
                {
                    currentTheme: l
                } = R(),
                n = W(() => F(l.value)),
                i = I(),
                r = W(() => {
                    switch (_.navigation) {
                        case "GameHeader":
                            return ee;
                        default:
                            return null
                    }
                }),
                u = W(() => m.value ? J("HeadNav") : _.navigation ? r.value : null),
                b = () => {
                    i.go(-1)
                },
                c = () => {
                    t("switchSound")
                };
            return (d, p) => {
                const f = V;
                return o(), v("div", pe, [e("div", {
                    class: y(["bg", `bg--${n.value}`])
                }, null, 2), (o(), T(z(u.value), {
                    fixed: !0,
                    leftArrow: !0,
                    headLogo: !0,
                    onClickS: b
                }, {
                    end: Y(() => [e("div", fe, [$(f, {
                        name: "icon_service"
                    }), $(f, {
                        name: w.soundEffects ? "icon_voice" : "icon_voice_disable",
                        onClick: c
                    }, null, 8, ["name"])])]),
                    _: 1
                }, 32)), w.wallte ? (o(), T(_e, {
                    key: 0
                })) : D("", !0), x(d.$slots, "default", {}, void 0, !0)])
            }
        }
    }),
    Ye = B(he, [
        ["__scopeId", "data-v-7ce1f7ef"]
    ]),
    we = {
        class: "winning"
    },
    ge = {
        class: "winning-main"
    },
    be = {
        class: "winning-wrap"
    },
    Ce = {
        key: 1,
        class: "winning-wrap-l1"
    },
    ye = {
        key: 2,
        class: "winning-wrap-l2"
    },
    $e = {
        class: "winning-wrap-l3"
    },
    ke = {
        key: 0,
        class: "isLose"
    },
    We = {
        class: "head"
    },
    Te = {
        class: "bonus"
    },
    Ne = {
        class: "gameDetail"
    },
    Be = {
        class: "winning-wrap-l4"
    },
    Le = N({
        __name: "Winning",
        setup(w, {
            expose: g
        }) {
            const {
                currentGame: _
            } = le(), {
                soundEffects: t
            } = ie(), m = h(), l = h(), n = h(!1), i = new A.Howl({
                src: [ae],
                loop: !1,
                preload: !1
            }), r = new A.Howl({
                src: [se],
                loop: !1,
                preload: !1
            }), u = h(!1), b = h(null), c = X({
                issueNumber: "",
                amount: 0,
                result: null
            }), d = h(!1);
            let p = null,
                f = null;
            const M = K(async () => Q(() =>
                    import ("./lottie_light-C-DwA73m.js").then(a => a.l), __vite__mapDeps([0, 1, 2]))),
                L = () => {
                    u.value = !u.value, u.value ? (clearTimeout(b.value), b.value = setTimeout(() => {
                        u.value = !1, n.value = !1, p.stop(), f.stop()
                    }, 3e3)) : clearTimeout(b.value)
                },
                O = async () => {
                    if (p) return p;
                    i.load(), r.load();
                    const a = await M();
                    try {
                        p = a.loadAnimation({
                            container: m.value,
                            renderer: "svg",
                            loop: !1,
                            autoplay: !1,
                            path: ne
                        }), f = a.loadAnimation({
                            container: l.value,
                            renderer: "svg",
                            loop: !0,
                            autoplay: !1,
                            path: te
                        })
                    } catch {}
                };
            return g({
                open: async a => {
                    u.value = !1, n.value = !0, d.value = a.isWin, c.issueNumber = a.issueNumber, c.amount = a.amount, c.result = a.result, await O(), a.isWin ? (p.play(), f.play(), t != null && t.value && (i == null || i.play())) : t != null && t.value && (r == null || r.play()), L()
                }
            }), (a, k) => (o(), T(q, {
                name: "van-fade"
            }, {
                default: Y(() => {
                    var H;
                    return [U(e("div", we, [e("div", {
                        class: "winning-animation",
                        ref_key: "animation",
                        ref: m
                    }, null, 512), e("div", {
                        class: y(["winning-body", {
                            isWin: d.value,
                            noWin: !d.value
                        }])
                    }, [e("div", ge, [e("div", be, [d.value ? (o(), v("div", {
                        key: 0,
                        class: y(["winning-wrap-l1", {
                            isWin: d.value
                        }])
                    }, s(a.$t("common.winTips")), 3)) : (o(), v("div", Ce, s(a.$t("common.loseTips")), 1)), c.result ? (o(), v("div", ye, [x(a.$slots, "default", {
                        data: c.result
                    }, void 0, !0)])) : D("", !0), e("div", $e, [d.value ? (o(), v(Z, {
                        key: 1
                    }, [e("div", We, s(a.$t("common.bonus")), 1), e("div", Te, s(C(E)(c.amount)), 1)], 64)) : (o(), v("div", ke, s(a.$t("common.loseTips")), 1)), e("div", Ne, [S(s(a.$t("common.issue")) + " " + s((H = C(_)) == null ? void 0 : H.gameName) + " ", 1), e("p", null, s(c.issueNumber), 1)])])])]), e("div", Be, [e("div", {
                        class: y(["acitveBtn", {
                            active: u.value
                        }]),
                        onClick: G(L, ["stop"])
                    }, null, 2), S(" " + s(a.$t("common.autoClose")), 1)]), e("div", {
                        class: "closeBtn",
                        onClick: k[0] || (k[0] = G(Ae => n.value = !1, ["stop"]))
                    })], 2)], 512), [
                        [j, n.value]
                    ])]
                }),
                _: 3
            }))
        }
    }),
    Ee = B(Le, [
        ["__scopeId", "data-v-a91426ba"]
    ]);
export {
    Ye as L, Ee as W
};