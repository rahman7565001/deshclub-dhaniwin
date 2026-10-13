import {
    b8 as _,
    u as y,
    aZ as i,
    aU as s,
    b0 as e,
    ba as a,
    b1 as c,
    bb as o,
    bh as p,
    bN as C,
    bW as b,
    aY as v
} from "./index-BgAwOX9Q.js";
import {
    u as g
} from "./useTicket-P_tRkf8j.js";
const w = {
        class: "cc-body"
    },
    h = {
        class: "cc-body-desc"
    },
    x = {
        key: 0,
        class: "cc-body-topic"
    },
    T = {
        class: "cc-body-topic-unit"
    },
    F = {
        key: 0,
        class: "cc-body-topic-unit"
    },
    A = {
        class: "cc-body-topic-unit"
    },
    B = {
        class: "cc-desc"
    },
    S = {
        class: "cc-footer"
    },
    N = _({
        __name: "confirmClaim",
        props: {
            ticket: {},
            title: {},
            close: {
                type: Function,
                default: () => {}
            },
            confirm: {
                type: Function,
                default: () => {}
            }
        },
        setup(f) {
            const {
                t: n
            } = y(), {
                CouponCondition: d,
                hasCondition: m,
                getSpinTypeText: k
            } = g(), t = f, u = k(n);
            return (O, r) => (s(), i("div", null, [e("div", w, [e("div", h, c(t.title), 1), o(m)(t.ticket) ? (s(), i("div", x, [e("div", null, c(t.ticket.title), 1), e("span", null, [t.ticket.couponType == o(d).Amount ? (s(), i(p, {
                key: 0
            }, [e("span", null, c(t.ticket.rewardConfig.amountOrRatio), 1), C(e("span", T, "%", 512), [
                [b, !t.ticket.rewardConfig.isFixedAmount]
            ]), e("span", null, c(t.ticket.rewardConfig.isFixedAmount ? o(n)("t294") : o(n)("t659")), 1)], 64)) : a("", !0), t.ticket.couponType == o(d).Reward ? (s(), i(p, {
                key: 1
            }, [e("span", null, c(t.ticket.rewardConfig.amountOrRatio), 1), t.ticket.rewardConfig.isFixedAmount ? a("", !0) : (s(), i("span", F, "%")), e("span", null, c(t.ticket.rewardConfig.isFixedAmount ? o(n)("t294") : o(n)("t659")), 1)], 64)) : a("", !0), t.ticket.couponType == o(d).validBet ? (s(), i(p, {
                key: 2
            }, [e("span", null, c(t.ticket.rewardConfig.freeSpinCount), 1), e("span", A, c(o(n)("t661")), 1), e("span", null, c(o(u)[t.ticket.rewardConfig.spinType] || o(u)[1]), 1)], 64)) : a("", !0)])])) : a("", !0)]), e("div", B, c(o(n)("t666")), 1), e("div", S, [e("div", {
                class: "cc-footer-cancel",
                onClick: r[0] || (r[0] = (...l) => t.close && t.close(...l))
            }, c(o(n)("t83")), 1), e("div", {
                class: "cc-footer-confirm",
                onClick: r[1] || (r[1] = (...l) => t.confirm && t.confirm(...l))
            }, c(o(n)("t86")), 1)])]))
        }
    }),
    I = v(N, [
        ["__scopeId", "data-v-cf2ec802"]
    ]);
export {
    I as c
};