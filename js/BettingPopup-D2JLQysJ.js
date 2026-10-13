import {
    b8 as G,
    aZ as c,
    aU as d,
    O as f,
    b0 as e,
    a$ as D,
    b_ as $,
    b1 as s,
    bb as t,
    bh as k,
    bi as L,
    bd as p,
    aY as P,
    u as z,
    r as T,
    R as F,
    cS as O,
    aC as x,
    bg as b,
    c as E,
    bN as X,
    bU as Y,
    ba as j,
    bO as q,
    f as J
} from "./index-BgAwOX9Q.js";
import {
    a as K
} from "./WingoSkeleton.vue_vue_type_style_index_0_scoped_cd4f34e3_lang-CZJCWYiN.js";
import {
    C as Q
} from "./index-CD_euF2K.js";
import {
    a as ee
} from "./useWingo-C_0L1WoG.js";
import {
    c as R
} from "./currency-DTUBf2lI.js"; /* empty css                                                             */
import {
    B as te
} from "./BetRule-DyIqbhnc.js"; /* empty css              */ /* empty css              */
import {
    B as se
} from "./index-Wui3UtXk.js";
const oe = {
        class: "TimeLeft__C"
    },
    ne = {
        class: "TimeLeft__C-name"
    },
    le = {
        class: "TimeLeft__C-num"
    },
    ae = {
        class: "TimeLeft__C-id"
    },
    ie = {
        class: "TimeLeft__C-text"
    },
    ue = {
        class: "TimeLeft__C-time"
    },
    re = G({
        __name: "WinGoInfo",
        props: {
            issue: {
                type: String,
                default: ""
            },
            numbers: {
                type: Array,
                default: () => [0, 0, 0, 0, 0]
            },
            countdownTime: {
                type: Array,
                default: ["0", "0", ":", "0", "0"]
            },
            handleRule: {
                type: Function,
                default: () => {}
            }
        },
        setup(u) {
            const {
                currentGame: r,
                gameCode: g
            } = K();
            return (C, m) => {
                var v;
                const a = D;
                return d(), c("div", oe, [f(a, {
                    group: "gamesaas",
                    class: "saas_bg_icon",
                    name: "saas_bg"
                }), e("div", {
                    onClick: m[0] || (m[0] = w => u.handleRule()),
                    class: "TimeLeft__C-rule"
                }, [m[1] || (m[1] = e("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "36",
                    height: "36",
                    viewBox: "0 0 36 36",
                    fill: "none"
                }, [e("path", {
                    d: "M23.67 3H12.33C6.66 3 5.25 4.515 5.25 10.56V27.45C5.25 31.44 7.44 32.385 10.095 29.535L10.11 29.52C11.34 28.215 13.215 28.32 14.28 29.745L15.795 31.77C17.01 33.375 18.975 33.375 20.19 31.77L21.705 29.745C22.785 28.305 24.66 28.2 25.89 29.52C28.56 32.37 30.735 31.425 30.735 27.435V10.56C30.75 4.515 29.34 3 23.67 3ZM11.67 18C10.845 18 10.17 17.325 10.17 16.5C10.17 15.675 10.845 15 11.67 15C12.495 15 13.17 15.675 13.17 16.5C13.17 17.325 12.495 18 11.67 18ZM11.67 12C10.845 12 10.17 11.325 10.17 10.5C10.17 9.675 10.845 9 11.67 9C12.495 9 13.17 9.675 13.17 10.5C13.17 11.325 12.495 12 11.67 12ZM24.345 17.625H16.095C15.48 17.625 14.97 17.115 14.97 16.5C14.97 15.885 15.48 15.375 16.095 15.375H24.345C24.96 15.375 25.47 15.885 25.47 16.5C25.47 17.115 24.96 17.625 24.345 17.625ZM24.345 11.625H16.095C15.48 11.625 14.97 11.115 14.97 10.5C14.97 9.885 15.48 9.375 16.095 9.375H24.345C24.96 9.375 25.47 9.885 25.47 10.5C25.47 11.115 24.96 11.625 24.345 11.625Z",
                    fill: "currentColor"
                })], -1)), $(s(C.$t("common.howToPlay")), 1)]), e("div", ne, s(((v = t(r)) == null ? void 0 : v.gameName) || t(g) || ""), 1), e("div", le, [(d(!0), c(k, null, L(u.numbers, (w, B) => (d(), c("div", {
                    key: B,
                    class: p(["n" + w])
                }, null, 2))), 128))]), e("div", ae, s(u.issue), 1), e("div", ie, s(C.$t("common.remainingBettingTime")), 1), e("div", ue, [e("div", null, s(u.countdownTime[0]), 1), e("div", null, s(u.countdownTime[1]), 1), m[2] || (m[2] = e("div", null, ":", -1)), e("div", null, s(u.countdownTime[3]), 1), e("div", null, s(u.countdownTime[4]), 1)])])
            }
        }
    }),
    He = P(re, [
        ["__scopeId", "data-v-9d1bc05f"]
    ]),
    ce = {
        class: "lottery-container"
    },
    de = {
        class: "selection-text"
    },
    me = {
        class: "content"
    },
    ve = {
        class: "amount-section"
    },
    _e = {
        class: "section-header"
    },
    fe = {
        class: "label"
    },
    pe = {
        class: "amount-buttons"
    },
    Ce = ["onClick"],
    be = {
        class: "multiplier-section"
    },
    ge = {
        class: "section-header"
    },
    he = {
        class: "label"
    },
    $e = {
        class: "m"
    },
    we = {
        class: "multiplier-buttons"
    },
    ye = ["onClick"],
    ke = {
        class: "agreement"
    },
    Be = {
        key: 0,
        class: "balance"
    },
    Te = {
        class: "footer"
    },
    Le = G({
        __name: "BettingPopup",
        props: {
            currentGame: {
                type: String,
                default: ""
            }
        },
        setup(u) {
            const {
                t: r
            } = z(), g = T(!0), {
                betDialog: C,
                betMultiples: m,
                betMultiple: a,
                amount: v,
                onBetting: w,
                betScopes: B,
                playBet: h,
                onClearBet: U,
                balance: M,
                gameCode: Z
            } = ee(), y = T(!1), _ = T(h.value);
            F(h, l => {
                l != null && l !== "" && (_.value = l)
            }, {
                immediate: !0
            });
            const H = E(() => {
                    const l = [1, 3, 7, 9],
                        n = [2, 4, 6, 8],
                        i = _.value;
                    if (i === "violet") return "violet_bg";
                    if (i === "small") return "small_bg";
                    if (i === "big") return "big_bg";
                    if (i === 0) return "zero_bg";
                    if (i === 5) return "five_bg";
                    if (l.includes(i) || i === "green") return "green_bg";
                    if (n.includes(i) || i === "red") return "red_bg"
                }),
                I = J(),
                V = l => {
                    l === 1 ? a.value > 1 && a.value-- : a.value++
                },
                W = () => {
                    if (a.value * v.value > M.value) return I.error(r("common.code_142"));
                    w()
                };
            return (l, n) => {
                const i = Q,
                    N = se,
                    S = O;
                return d(), c(k, null, [f(S, {
                    show: t(C),
                    "onUpdate:show": n[5] || (n[5] = o => x(C) ? C.value = o : null),
                    position: "bottom",
                    round: ""
                }, {
                    default: b(() => [e("div", ce, [e("div", {
                        class: p(["header", H.value])
                    }, [e("h1", null, s(u.currentGame), 1), e("div", de, [e("span", null, s(t(r)("common.selectMay")) + " " + s(isNaN(Number(t(h))) ? t(r)("common." + t(h)) : t(h)), 1)])], 2), e("div", me, [e("div", ve, [e("div", _e, [e("span", fe, s(t(r)("common.amount")), 1), e("div", pe, [(d(!0), c(k, null, L(t(B), o => (d(), c("div", {
                        key: o,
                        class: p(t(v) === o ? `primary n_${_.value}` : "default"),
                        onClick: A => v.value = o
                    }, s(o), 11, Ce))), 128))])])]), e("div", be, [e("div", ge, [e("span", he, s(l.$t("common.numMay")), 1), e("div", $e, [e("div", {
                        class: p([`n_${_.value}`]),
                        onClick: n[0] || (n[0] = o => V(1))
                    }, "-", 2), X(e("input", {
                        "onUpdate:modelValue": n[1] || (n[1] = o => x(a) ? a.value = o : null),
                        type: "number"
                    }, null, 512), [
                        [Y, t(a)]
                    ]), e("div", {
                        class: p([`n_${_.value}`]),
                        onClick: n[2] || (n[2] = o => V(2))
                    }, "+", 2)])]), e("div", we, [(d(!0), c(k, null, L(t(m), o => (d(), c("div", {
                        key: o,
                        class: p(t(a) === o ? `primary n_${_.value}` : "default"),
                        onClick: A => a.value = o
                    }, " X" + s(o), 11, ye))), 128))])]), e("div", ke, [f(i, {
                        modelValue: g.value,
                        "onUpdate:modelValue": n[4] || (n[4] = o => g.value = o),
                        "checked-color": "var(--main-color)"
                    }, {
                        default: b(() => [$(s(l.$t("common.agree")) + " ", 1), e("span", {
                            class: "rules",
                            onClick: n[3] || (n[3] = q(o => y.value = !0, ["stop"]))
                        }, s(l.$t("common.presaleRules")), 1)]),
                        _: 1
                    }, 8, ["modelValue"]), t(Z).includes("Video") ? (d(), c("div", Be, s(l.$t("common.balance")) + " :" + s(t(R)(t(M))), 1)) : j("", !0)])]), e("div", Te, [f(N, {
                        class: "cancel",
                        onClick: t(U)
                    }, {
                        default: b(() => [$(s(t(r)("common.cancel")), 1)]),
                        _: 1
                    }, 8, ["onClick"]), f(N, {
                        class: p(`bet-amount n_${_.value}`),
                        disabled: !g.value,
                        onClick: W
                    }, {
                        default: b(() => [$(s(t(r)("common.totalAmount")) + " " + s(t(R)(t(a) * t(v) || 0)), 1)]),
                        _: 1
                    }, 8, ["class", "disabled"])])])]),
                    _: 1
                }, 8, ["show"]), f(S, {
                    show: y.value,
                    "onUpdate:show": n[7] || (n[7] = o => y.value = o),
                    "close-on-click-overlay": !1,
                    round: ""
                }, {
                    default: b(() => [f(t(te), {
                        title: t(r)("common.presaleRules"),
                        onClose: n[6] || (n[6] = o => y.value = !1)
                    }, {
                        default: b(() => [$(s(l.$t("common.w10")), 1)]),
                        _: 1
                    }, 8, ["title"])]),
                    _: 1
                }, 8, ["show"])], 64)
            }
        }
    }),
    Ie = P(Le, [
        ["__scopeId", "data-v-47d42fc9"]
    ]);
export {
    Ie as B, He as W
};