import {
    r as q
} from "./WingoSkeleton.vue_vue_type_style_index_0_scoped_cd4f34e3_lang-CZJCWYiN.js";
import {
    b8 as O,
    u as Z,
    aZ as u,
    aU as r,
    bd as n,
    r as z,
    b0 as t,
    ba as D,
    b1 as s,
    c as d,
    bb as o,
    q as V,
    bO as U,
    bI as G,
    bh as J,
    bi as K,
    aY as P
} from "./index-BgAwOX9Q.js";
import {
    c
} from "./currency-DTUBf2lI.js";
import {
    u as Q
} from "./useCopy.hook-UGzKx9v-.js";

function Ut(i) {
    return q.post("/Lottery/MotoRaceBet", i)
}
const W = {
        class: "result-summary"
    },
    X = {
        class: "position"
    },
    tt = {
        class: "info"
    },
    et = {
        class: "id"
    },
    st = {
        class: "timestamp"
    },
    it = {
        class: "status-container"
    },
    at = {
        key: 0,
        class: "driver"
    },
    ot = {
        key: 1,
        class: "details-section"
    },
    lt = {
        class: "details-title"
    },
    nt = {
        class: "details-container"
    },
    dt = {
        class: "detail-item"
    },
    ct = {
        class: "detail-label"
    },
    ut = {
        class: "detail-value with-icon"
    },
    rt = {
        class: "detail-item"
    },
    mt = {
        class: "detail-label"
    },
    vt = {
        class: "detail-value"
    },
    ft = {
        class: "detail-item"
    },
    ht = {
        class: "detail-label"
    },
    _t = {
        class: "detail-value"
    },
    bt = {
        class: "detail-item"
    },
    kt = {
        class: "detail-label"
    },
    pt = {
        class: "detail-value"
    },
    wt = {
        class: "detail-item"
    },
    yt = {
        class: "detail-label"
    },
    Mt = {
        class: "detail-value"
    },
    gt = {
        class: "detail-item"
    },
    Nt = {
        class: "detail-label"
    },
    Ct = {
        class: "detail-value"
    },
    $t = {
        class: "detail-item"
    },
    Lt = {
        class: "detail-label"
    },
    Tt = {
        class: "detail-value number-circles"
    },
    At = {
        class: "detail-item"
    },
    Ht = {
        class: "detail-label"
    },
    Yt = {
        class: "detail-value"
    },
    Ft = {
        class: "position-text"
    },
    Bt = {
        class: "circle blue small-circle"
    },
    Dt = {
        class: "detail-item"
    },
    Vt = {
        class: "detail-label"
    },
    Et = {
        class: "detail-item"
    },
    It = {
        class: "detail-label"
    },
    Rt = {
        class: "detail-item"
    },
    jt = {
        class: "detail-label"
    },
    xt = {
        class: "detail-value"
    },
    St = O({
        __name: "ResultItem",
        props: {
            info: {
                type: Object,
                required: !0
            }
        },
        setup(i) {
            const l = i,
                {
                    t: _
                } = Z(),
                {
                    copy: E
                } = Q(),
                m = z(!1),
                I = () => {
                    m.value = !m.value
                },
                b = d(() => {
                    var a;
                    const e = (a = l.info) == null ? void 0 : a.betContent.split("_")[0];
                    return e.includes("First") ? "1st" : e.includes("Second") ? "2nd" : "3rd"
                }),
                v = d(() => {
                    var a;
                    const e = (a = l.info) == null ? void 0 : a.betContent.split("_")[1];
                    return isNaN(e), e
                }),
                R = d(() => "blue"),
                j = d(() => !0),
                k = d(() => {
                    var e, a;
                    return ((e = l.info) == null ? void 0 : e.state) > 1 ? "--" : ((a = l.info) == null ? void 0 : a.state) === 1 ? _("success") : _("common.fail")
                }),
                x = d(() => {
                    var e, a;
                    return ((e = l.info) == null ? void 0 : e.state) > 1 ? "--" : ((a = l.info) == null ? void 0 : a.state) === 1 ? "Succeed" : "Failed"
                }),
                h = d(() => {
                    var e;
                    return ((e = l.info) == null ? void 0 : e.winLoseAmount) > 0 ? "positive" : "negative"
                }),
                S = d(() => {
                    var e, a;
                    return ((a = (e = l.info) == null ? void 0 : e.premium) == null ? void 0 : a.split(",")) || []
                }),
                p = e => ["red", "blue-purple", "orange", "green", "light-blue", "purple", "brown", "teal", "medium-blue", "orange-red"][e - 1];
            return (e, a) => {
                var w, y, M, g, N, C, $, L, T, A, H, Y, F;
                return r(), u("div", {
                    class: n(["result-item", {
                        "result-item_detail": m.value
                    }]),
                    onClick: I
                }, [t("div", W, [t("div", X, s(b.value), 1), t("div", {
                    class: n(["badge", isNaN(v.value) ? R.value : p(v.value)])
                }, [t("span", {
                    class: n({
                        "small-text": j.value,
                        num_text: !isNaN(v.value)
                    })
                }, s(v.value), 3)], 2), t("div", tt, [t("div", et, s((w = i.info) == null ? void 0 : w.issueNumber), 1), t("div", st, s(o(V)((y = i.info) == null ? void 0 : y.betTime, "YYYY-MM-DD HH:mm:ss")), 1)]), t("div", it, [t("div", {
                    class: n(["status", x.value])
                }, s(k.value), 3), t("div", {
                    class: n(["amount", h.value])
                }, s(((M = i.info) == null ? void 0 : M.winLoseAmount) > 0 ? "+" + o(c)(i.info.state ? i.info.winLoseAmount + i.info.amount : i.info.winLoseAmount) : o(c)((g = i.info) == null ? void 0 : g.winLoseAmount)), 3)])]), m.value ? (r(), u("div", at)) : D("", !0), m.value ? (r(), u("div", ot, [t("h2", lt, s(e.$t("detail")), 1), t("div", nt, [t("div", dt, [t("div", ct, s(e.$t("orderNo")), 1), t("div", ut, [t("span", null, s((N = i.info) == null ? void 0 : N.orderNo), 1), (r(), u("svg", {
                    onClick: a[0] || (a[0] = U(f => {
                        var B;
                        return o(E)(((B = i.info) == null ? void 0 : B.orderNo) + "")
                    }, ["stop"])),
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 32 32",
                    fill: "none"
                }, [...a[1] || (a[1] = [G('<path d="M8.6665 25.3337H27.3332V10.667H19.9998V2.66699H8.6665V25.3337Z" stroke="#3478FE" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" data-v-451fafcd></path><path d="M20 2.66699L27.3333 10.667" stroke="#3478FE" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" data-v-451fafcd></path><path d="M4.6665 13.333V29.333H18.6665" stroke="#3478FE" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" data-v-451fafcd></path><path d="M12.6665 13.333H15.3332" stroke="#3478FE" stroke-width="2.66667" stroke-linecap="round" data-v-451fafcd></path><path d="M12.6665 18.667H20.6665" stroke="#3478FE" stroke-width="2.66667" stroke-linecap="round" data-v-451fafcd></path>', 5)])]))])]), t("div", rt, [t("div", mt, s(e.$t("betNumber")), 1), t("div", vt, s(((C = i.info) == null ? void 0 : C.issueNumber) || "--"), 1)]), t("div", ft, [t("div", ht, s(e.$t("common.amountMay")), 1), t("div", _t, s(o(c)(($ = i.info) == null ? void 0 : $.amount)), 1)]), t("div", bt, [t("div", kt, s(e.$t("common.numMay")), 1), t("div", pt, s((L = i.info) == null ? void 0 : L.betMultiple), 1)]), t("div", wt, [t("div", yt, s(e.$t("common.afterTaxAmount")), 1), t("div", Mt, s(o(c)((T = i.info) == null ? void 0 : T.realAmount)), 1)]), t("div", gt, [t("div", Nt, s(e.$t("common.tax")), 1), t("div", Ct, s(o(c)((A = i.info) == null ? void 0 : A.fee)), 1)]), t("div", $t, [t("div", Lt, s(e.$t("common.resultMay")), 1), t("div", Tt, [a[2] || (a[2] = t("span", {
                    class: "position-text"
                }, "1st", -1)), (r(!0), u(J, null, K(S.value, f => (r(), u("div", {
                    key: f,
                    class: n(["circle", p(f)])
                }, s(f), 3))), 128))])]), t("div", At, [t("div", Ht, s(e.$t("common.selectMay")), 1), t("div", Yt, [t("span", Ft, s(b.value), 1), t("div", Bt, s(v.value[0]), 1)])]), t("div", Dt, [t("div", Vt, s(e.$t("common.statusMay")), 1), t("div", {
                    class: n(["detail-value", "status-text", h.value])
                }, s(k.value), 3)]), t("div", Et, [t("div", It, s(e.$t("common.winOrLose")), 1), t("div", {
                    class: n(["detail-value", h.value])
                }, s(((H = i.info) == null ? void 0 : H.winLoseAmount) > 0 ? "+" + o(c)((Y = i.info) == null ? void 0 : Y.winLoseAmount) : o(c)((F = i.info) == null ? void 0 : F.winLoseAmount)), 3)]), t("div", Rt, [t("div", jt, s(e.$t("common.createTime")), 1), t("div", xt, s(o(V)(i.info.betTime, "YYYY-MM-DD HH:mm:ss")), 1)])])])) : D("", !0)], 2)
            }
        }
    }),
    Gt = P(St, [
        ["__scopeId", "data-v-451fafcd"]
    ]);
export {
    Gt as R, Ut as m
};