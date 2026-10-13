import {
    b8 as b,
    aZ as c,
    aU as o,
    bh as f,
    bi as h,
    bd as d,
    bb as n,
    b0 as u,
    m as k,
    b1 as p,
    c as L,
    aY as S
} from "./index-BgAwOX9Q.js";
import {
    u as x
} from "./WingoSkeleton.vue_vue_type_style_index_0_scoped_cd4f34e3_lang-CZJCWYiN.js"; /* empty css                                                             */
const I = {
        class: "timer-cards"
    },
    B = ["onClick"],
    D = {
        class: "clock-icon"
    },
    G = ["src"],
    N = ["src"],
    M = b({
        __name: "LotteryMenu",
        emits: ["changeSelectGame"],
        setup(V, {
            emit: _
        }) {
            const {
                getImgVal: m
            } = k(), {
                gameList: g,
                currentGame: a,
                lotteryCode: l
            } = x(), v = _, y = L(() => {
                var r;
                if (!l) return [];
                const s = l.value === "D5" ? "5D" : l.value,
                    t = g.value.find(e => e.gameTypeName === s || e.lotteryCode === l.value || e.gameCode === l.value || e.categoryCode === l.value || e.categoryName === s || e.name === s);
                return ((r = t == null ? void 0 : t.gameList) == null ? void 0 : r.length) ? [...t.gameList].sort((e, i) => i.sort - e.sort) : []
            }), C = async s => {
                var t;
                ((t = a == null ? void 0 : a.value) == null ? void 0 : t.gameCode) !== s.gameCode && v("changeSelectGame", s)
            };
            return (s, t) => (o(), c("div", I, [(o(!0), c(f, null, h(y.value, e => {
                var r, i;
                return o(), c("div", {
                    key: e.gameCode,
                    class: d(["timer-card", {
                        active: ((r = n(a)) == null ? void 0 : r.gameCode) === e.gameCode
                    }]),
                    onClick: z => C(e)
                }, [u("div", D, [((i = n(a)) == null ? void 0 : i.gameCode) === e.gameCode ? (o(), c("img", {
                    key: 0,
                    src: n(m)("lottery_category_active"),
                    class: "timeIcon",
                    alt: "active"
                }, null, 8, G)) : (o(), c("img", {
                    key: 1,
                    src: n(m)("lottery_category"),
                    class: "timeIcon",
                    alt: "default"
                }, null, 8, N))]), u("div", {
                    class: d(["card-title", {
                        noActive: e.state === 2
                    }])
                }, p(e.gameName), 3)], 10, B)
            }), 128))]))
        }
    }),
    T = S(M, [
        ["__scopeId", "data-v-7341bb60"]
    ]);
export {
    T as L
};