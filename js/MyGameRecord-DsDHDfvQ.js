import {
    b8 as A,
    u as z,
    r as v,
    R as T,
    aZ as n,
    aU as a,
    b0 as s,
    bh as G,
    bi as L,
    ba as $,
    bO as I,
    bd as _,
    b1 as o,
    b_ as B,
    bb as r,
    q as S,
    O as M,
    aY as E,
    P,
    c as D,
    c9 as F,
    c8 as j,
    aT as q,
    bq as H
} from "./index-BgAwOX9Q.js";
import {
    E as O
} from "./index-BTGuSQfS.js";
import {
    c as g
} from "./currency-DTUBf2lI.js";
import {
    u as Z
} from "./useCopy.hook-UGzKx9v-.js"; /* empty css                                                             */ /* empty css              */
import {
    a as U,
    g as W
} from "./WingoSkeleton.vue_vue_type_style_index_0_scoped_cd4f34e3_lang-CZJCWYiN.js"; /* empty css              */
const Y = {
        class: "my_r"
    },
    J = {
        class: "my_r-body"
    },
    K = {
        key: 0,
        class: "list"
    },
    Q = ["onClick"],
    X = {
        class: "list-item-l"
    },
    x = {
        class: "list-item-m"
    },
    ee = {
        class: "list-item-m-top"
    },
    se = {
        class: "list-item-m-bottom"
    },
    te = {
        key: 0,
        class: "list-detail"
    },
    oe = {
        class: "list-detail-text"
    },
    ae = {
        class: "list-detail-line"
    },
    ne = ["onClick"],
    le = {
        class: "list-detail-line"
    },
    ie = {
        class: "list-detail-line"
    },
    ce = {
        class: "list-detail-line"
    },
    re = {
        class: "list-detail-line"
    },
    de = {
        class: "red"
    },
    ue = {
        class: "list-detail-line"
    },
    me = {
        class: "list-detail-line"
    },
    ve = {
        key: 0
    },
    _e = {
        key: 1
    },
    pe = {
        class: "list-detail-line"
    },
    ye = {
        class: "list-detail-line"
    },
    he = {
        key: 1
    },
    fe = {
        class: "list-detail-line"
    },
    ge = {
        key: 1
    },
    be = {
        class: "list-detail-line"
    },
    Ce = {
        key: 1,
        class: "my_r-body-empty"
    },
    ke = A({
        __name: "MayrecordList",
        props: {
            gameCode: {},
            mayrecord: {}
        },
        setup(w) {
            const {
                t: b
            } = z(), p = w, y = v(p.mayrecord || []), {
                copy: C
            } = Z();
            T(() => p.mayrecord, t => {
                t && (y.value = p.mayrecord)
            });
            const h = t => t.betContent ? t.betContent.split(",")[0].split("_")[1] : "",
                N = t => (Number(t.realAmount) || 0) + (Number(t.fee) || 0) + (Number(t.winLoseAmount) || 0),
                d = t => {
                    if (!t.betContent) return "";
                    const e = (t == null ? void 0 : t.betContent.split(",")).slice(0, 2).map(c => {
                        const i = c.match(/_(\d+)$/);
                        return i ? i[1] : null
                    });
                    return e[0] + e[1]
                },
                k = t => ({
                    First: "A",
                    Second: "B",
                    Third: "C",
                    Fourth: "D",
                    Fifth: "E",
                    Sum: "Sum"
                })[t == null ? void 0 : t.replace(/Num|OddEven|BigSmall/g, "")] || t,
                f = t => {
                    var l;
                    return t.betContent ? t.betContent.indexOf(",") !== -1 ? t.betContent.split(",").map(c => {
                        const i = c.split("_");
                        return i[i.length - 1]
                    }) : (l = t.betContent) == null ? void 0 : l.split("_")[1] : ""
                },
                m = v(-1),
                R = t => {
                    m.value == t ? m.value = -1 : m.value = t
                };
            return (t, l) => (a(), n("div", Y, [s("div", J, [y.value.length ? (a(), n("div", K, [(a(!0), n(G, null, L(y.value, (e, c) => {
                var i;
                return a(), n("div", {
                    key: c
                }, [s("div", {
                    class: "list-item",
                    onClick: I(u => R(c), ["stop", "prevent"])
                }, [s("div", X, [s("div", {
                    class: _(`list-item-l-${h(e)}`)
                }, o((i = e == null ? void 0 : e.betContent) != null && i.includes(",") ? d(e) : h(e)), 3)]), s("div", x, [s("div", ee, [B(o(e.issueNumber) + " ", 1), (a(), n("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    class: _({
                        r: c == m.value
                    }),
                    width: "9",
                    height: "8",
                    viewBox: "0 0 9 8",
                    fill: "none"
                }, [...l[0] || (l[0] = [s("path", {
                    d: "M5.21907 7.57895C4.89494 8.14035 4.08463 8.14035 3.7605 7.57895L0.114077 1.26316C-0.210049 0.701754 0.195109 -5.66721e-08 0.843362 0L8.13621 6.37561e-07C8.78446 6.94233e-07 9.18962 0.701755 8.86549 1.26316L5.21907 7.57895Z",
                    fill: "#323536"
                }, null, -1)])], 2))]), s("div", se, o(r(S)(e.betTime)), 1)]), e.premium ? (a(), n("div", {
                    key: 0,
                    class: _(["list-item-r", {
                        success: e.state == 1
                    }])
                }, [e.premium ? (a(), n("div", {
                    key: 0,
                    class: _({
                        success: e.state == 1
                    })
                }, o(e.state == 1 ? t.$t("success") : t.$t("common.fail")), 3)) : $("", !0), s("div", null, o(e.state == 1 ? `+${r(g)(N(e))}` : r(g)(e.winLoseAmount)), 1)], 2)) : $("", !0)], 8, Q), c == m.value ? (a(), n("div", te, [s("div", oe, o(t.$t("common.detailMay")), 1), s("div", ae, [s("span", null, o(t.$t("common.orderNoMay")), 1), s("div", {
                    class: "list-detail-copy",
                    onClick: u => r(C)(e.orderNo)
                }, [B(o(e.orderNo) + " ", 1), l[1] || (l[1] = s("svg", {
                    width: "40",
                    height: "40",
                    viewBox: "0 0 40 40",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg"
                }, [s("path", {
                    d: "M13 12V6H34V29H28",
                    stroke: "var(--text_secondary,#929292)",
                    "stroke-width": "2",
                    "stroke-linejoin": "round"
                }), s("rect", {
                    x: "6",
                    y: "12",
                    width: "22",
                    height: "22",
                    stroke: "var(--text_secondary,#929292)",
                    "stroke-width": "2",
                    "stroke-linejoin": "round"
                })], -1))], 8, ne)]), s("div", le, [s("span", null, o(t.$t("common.issueMay")), 1), s("div", null, o(e.issueNumber), 1)]), s("div", ie, [s("span", null, o(t.$t("common.amountMay")), 1), s("div", null, o(r(g)(e.amount)), 1)]), s("div", ce, [s("span", null, o(t.$t("common.numMay")), 1), s("div", null, o(e.betMultiple), 1)]), s("div", re, [s("span", null, o(t.$t("common.afterTaxAmount")), 1), s("div", de, o(r(g)(e.realAmount)), 1)]), s("div", ue, [s("span", null, o(t.$t("common.tax")), 1), s("div", null, o(r(g)(e.fee)), 1)]), s("div", me, [s("span", null, o(t.$t("common.resultMay")), 1), e.number ? (a(), n("div", ve, [(a(!0), n(G, null, L([...e.number], (u, V) => (a(), n("div", {
                    class: "numList",
                    key: V
                }, o(u), 1))), 128))])) : (a(), n("div", _e, "--"))]), s("div", pe, [s("span", null, o(t.$t("common.selectMay")), 1), s("div", null, o(`${k(e==null?void 0:e.playType)}：` + f(e)), 1)]), s("div", ye, [s("span", null, o(t.$t("common.statusMay")), 1), e.state != 2 ? (a(), n("div", {
                    key: 0,
                    class: _([e.state ? "green" : "red"])
                }, o(e.state == 1 ? t.$t("common.success") : t.$t("common.fail")), 3)) : (a(), n("div", he, o(t.$t("common.notOpen")), 1))]), s("div", fe, [s("span", null, o(t.$t("common.winOrLose")), 1), e.state != 2 ? (a(), n("div", {
                    key: 0,
                    class: _([e.state ? "green" : "red"])
                }, o(`${e.state?"+":""}${r(g)(e.winLoseAmount)}`), 3)) : (a(), n("div", ge, "--"))]), s("div", be, [s("span", null, o(t.$t("common.createTime")), 1), s("div", null, o(r(S)(e.betTime)), 1)])])) : $("", !0)])
            }), 128))])) : (a(), n("div", Ce, [M(r(O))]))])]))
        }
    }),
    $e = E(ke, [
        ["__scopeId", "data-v-bfa26293"]
    ]),
    Me = {
        class: "MyGameRecord__C"
    },
    we = {
        class: "MyGameRecord__C-body"
    },
    Ne = {
        key: 1,
        class: "MyGameRecord__C-body-empty"
    },
    Re = {
        key: 0,
        class: "MyGameRecord__C-foot"
    },
    Ge = {
        class: "MyGameRecord__C-foot-page"
    },
    Le = A({
        __name: "MyGameRecord",
        props: {
            gameCode: {
                type: String,
                default: ""
            },
            dragon: {
                type: Boolean,
                default: !1
            }
        },
        setup(w) {
            const b = w,
                {
                    trigger: p,
                    gameCode: y
                } = U(),
                C = D(() => b.dragon ? b.gameCode : b.gameCode || y.value),
                h = v(4),
                N = v(10),
                d = v(1),
                k = v(!1),
                f = v([]),
                m = v(!1),
                R = () => {
                    d.value--, l()
                },
                t = () => {
                    d.value++, l()
                },
                l = async (e = !1) => {
                    var c, i;
                    if (!m.value) try {
                        m.value = !0;
                        const u = await W({
                            pageSize: N.value,
                            pageNo: d.value,
                            gameCode: C.value
                        });
                        f.value = ((c = u == null ? void 0 : u.data) == null ? void 0 : c.list) || [], h.value = ((i = u == null ? void 0 : u.data) == null ? void 0 : i.totalPage) || 0, d.value = e ? 1 : d.value
                    } finally {
                        m.value = !1
                    }
                };
            return P(() => {
                l()
            }), T(C, e => {
                e && l(!0)
            }), F(() => {
                k.value = !0, p.reset()
            }), j(() => {
                k.value = !1, l(), p.on(() => {
                    l()
                })
            }), (e, c) => {
                const i = H;
                return a(), n("div", Me, [s("div", we, [f.value.length ? (a(), q($e, {
                    key: 0,
                    mayrecord: f.value,
                    gameCode: r(y)
                }, null, 8, ["mayrecord", "gameCode"])) : (a(), n("div", Ne, [M(O)]))]), f.value.length ? (a(), n("div", Re, [s("div", {
                    class: _(["MyGameRecord__C-foot-previous", {
                        disabled: d.value <= 1
                    }]),
                    onClick: R
                }, [M(i, {
                    name: "arrow-left",
                    class: "MyGameRecord__C-icon",
                    size: "20"
                })], 2), s("div", Ge, o(d.value) + "/" + o(h.value), 1), s("div", {
                    class: _(["MyGameRecord__C-foot-next", {
                        disabled: d.value >= h.value
                    }]),
                    onClick: t
                }, [M(i, {
                    name: "arrow",
                    class: "MyGameRecord__C-icon",
                    size: "20"
                })], 2)])) : $("", !0)])
            }
        }
    }),
    Ie = E(Le, [
        ["__scopeId", "data-v-75c8b3a3"]
    ]);
export {
    Ie as M
};