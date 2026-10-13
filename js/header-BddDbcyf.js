import {
    b8 as x,
    b$ as B,
    c as r,
    a as W,
    d as R,
    aZ as $,
    aU as w,
    b0 as e,
    O as C,
    b1 as a,
    bd as i,
    r as I,
    bq as N,
    b_ as u,
    bb as f,
    m as V,
    aY as S
} from "./index-BgAwOX9Q.js";
import {
    u as z
} from "./withdraw-6gAiRB6t.js";
import {
    u as G
} from "./recharge-kuO-BoSD.js";
const M = {
        class: "h_1 bottom_mix_style"
    },
    T = {
        class: "balance flex flex-items-center"
    },
    q = x({
        __name: "header",
        props: {
            isRecharge: {
                type: [Boolean],
                default: !1
            },
            v1: {
                type: [Number],
                default: ""
            },
            v2: {
                type: [Number],
                default: ""
            }
        },
        emits: ["clickWithdrawable"],
        setup(s, {
            emit: m
        }) {
            B(l => ({
                v04fe7144: g.value,
                v04fe7164: y.value
            }));
            const {
                currencySign: n
            } = W(), {
                getBasicInfo: d
            } = z(), {
                getImgVal: c
            } = V(), {
                GetRechargeBasicInfo: b
            } = G(), {
                refreshWalletBalance: h
            } = R(), p = s, v = m, t = I(!1);
            async function _() {
                if (!t.value) {
                    t.value = !0;
                    try {
                        await h(!1), setTimeout(() => {
                            p.isRecharge ? b() : d(!1)
                        }, 1e3)
                    } finally {
                        t.value = !1
                    }
                }
            }
            const g = r(() => `url('${c("icon_cash_b")}')`),
                y = r(() => `url('${c("icon_with2")}')`);
            return (l, o) => {
                const k = N;
                return w(), $("header", null, [e("div", M, [e("div", T, [e("p", null, a(l.$t("t735")), 1), C(k, {
                    class: i({
                        loading: t.value
                    }),
                    name: "replay",
                    size: 18,
                    onClick: _
                }, null, 8, ["class"])]), e("p", null, [e("span", null, a(f(n)), 1), u(a(Math.trunc(s.v1)), 1)])]), e("div", {
                    class: i(["h_2 bottom_mix_style", {
                        clickable: s.isRecharge
                    }]),
                    onClick: o[0] || (o[0] = D => s.isRecharge && v("clickWithdrawable"))
                }, [e("p", null, a(l.$t("t736")), 1), e("p", null, [e("span", null, a(f(n)), 1), u(a(Math.trunc(s.v2)), 1)])], 2)])
            }
        }
    }),
    U = S(q, [
        ["__scopeId", "data-v-7b591c6c"]
    ]);
export {
    U as W
};