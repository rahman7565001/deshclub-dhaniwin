import {
    ca as qe,
    r as p,
    aD as Qe,
    aH as X,
    u as Ze,
    dp as V,
    P as et,
    dt as tt,
    du as at,
    c as _,
    am as st,
    c0 as lt,
    dx as q,
    Y as ot,
    f as nt,
    aX as ut,
    cA as rt,
    dy as it
} from "./index-BgAwOX9Q.js";
import {
    t as ct,
    u as ft,
    i as Q,
    a as pt,
    b as de
} from "./index-CC7oqwbi.js";
import {
    u as mt,
    I as be
} from "./BetRule-DyIqbhnc.js";
import {
    a as yt
} from "./WingoSkeleton.vue_vue_type_style_index_0_scoped_cd4f34e3_lang-CZJCWYiN.js";
import {
    t as vt
} from "./tips-DMib3O3U.js";
import {
    d as dt,
    a as gt
} from "./d2-nnkZx0iT.js";
import {
    g as bt,
    a as Tt
} from "./wingo-BHHRwEkD.js";
const ge = "ping";

function Z(m) {
    return m === !0 ? {} : m
}

function St(m, b = {}) {
    const {
        onConnected: T,
        onDisconnected: S,
        onError: M,
        onMessage: A,
        immediate: H = !1,
        autoClose: U = !0,
        protocols: Y = []
    } = b, $ = p(null), I = Qe("CLOSED"), s = p(), D = ct(m);
    let c, N, B = !1,
        a = 0,
        f = [],
        w, y;
    const R = () => {
            if (f.length && s.value && I.value === "OPEN") {
                for (const n of f) s.value.send(n);
                f = []
            }
        },
        W = () => {
            w != null && (clearTimeout(w), w = void 0)
        },
        h = () => {
            clearTimeout(y), y = void 0
        },
        v = (n = 1e3, l) => {
            W(), !(!Q && !de || !s.value) && (B = !0, h(), c == null || c(), s.value.close(n, l), s.value = void 0)
        },
        O = (n, l = !0) => !s.value || I.value !== "OPEN" ? (l && f.push(n), !1) : (R(), s.value.send(n), !0),
        k = () => {
            if (B || typeof D.value > "u") return;
            let n = "";
            typeof m == "function" ? n = m() || "" : n = X(m);
            const l = new WebSocket(n, Y);
            s.value = l, I.value = "CONNECTING", l.onopen = () => {
                I.value = "OPEN", a = 0, T == null || T(l), N == null || N(), R()
            }, l.onclose = u => {
                if (I.value = "CLOSED", h(), c == null || c(), S == null || S(l, u), !B && b.autoReconnect && (s.value == null || l === s.value)) {
                    const {
                        retries: r = -1,
                        delay: C = 1e3,
                        onFailed: i
                    } = Z(b.autoReconnect);
                    (typeof r == "function" ? r : () => typeof r == "number" && (r < 0 || a < r))(a) ? (a += 1, w = setTimeout(k, C)) : i == null || i()
                }
            }, l.onerror = u => {
                M == null || M(l, u)
            }, l.onmessage = u => {
                if (b.heartbeat) {
                    h();
                    const {
                        message: r = ge,
                        responseMessage: C = r
                    } = Z(b.heartbeat);
                    if (u.data === X(C)) return
                }
                $.value = u.data, A == null || A(l, u)
            }
        };
    if (b.heartbeat) {
        const {
            message: n = ge,
            interval: l = 1e3,
            pongTimeout: u = 1e3
        } = Z(b.heartbeat), {
            pause: r,
            resume: C
        } = ft(() => {
            O(X(n), !1), y == null && (y = setTimeout(() => {
                v(), B = !1
            }, u))
        }, l, {
            immediate: !1
        });
        c = r, N = C
    }
    U && (Q && qe("beforeunload", () => v(), {
        passive: !0
    }), pt(v));
    const d = () => {
        !Q && !de || (v(), B = !1, a = 0, k())
    };
    return H && d(), {
        data: $,
        status: I,
        close: v,
        send: O,
        open: d,
        ws: s
    }
}
const Bt = "/assets/wingo-DPOnLBH_.svga",
    wt = "/assets/loop-C4C42CLB.mp3";

function Nt({
    skin: m,
    video: b
} = {
    skin: 1,
    video: !1
}) {
    const T = nt(),
        {
            t: S
        } = Ze(),
        {
            localStore: M
        } = tt(),
        {
            updateBalance: A,
            onBetTrigger: H,
            getGameList: U,
            currentGame: Y,
            balance: $,
            trigger: I
        } = yt();
    let s = null;
    const D = new V.Howl({
            src: [wt],
            preload: !1
        }),
        c = new V.Howl({
            src: [vt],
            preload: !1
        }),
        N = new V.Howl({
            src: [dt],
            preload: !1
        }),
        B = new V.Howl({
            src: [gt],
            preload: !1
        }),
        a = ot({
            betDialog: !1,
            amount: 1,
            betMultiple: 0,
            playType: "",
            playBet: null,
            playRate: 0
        }),
        f = p(0),
        w = p(!1),
        y = p(!1),
        R = p(!1),
        W = p(""),
        h = p(-1),
        v = p(null),
        O = p(!1),
        k = p(),
        d = 5,
        n = async e => {
            if (e === d && ([...J.keys()].includes(i.value) || J.clear(), y.value = !0, G()), e === d + 1 && s && s.start(), e == 1) {
                await q(400);
                const t = await ie(i.value);
                t != null && t.item && setTimeout(() => {
                    var g;
                    W.value = ((g = t == null ? void 0 : t.item) == null ? void 0 : g.number) || "", R.value = !0
                }, 1150), setTimeout(() => {
                    s && s.stop()
                }, 2e3), setTimeout(async () => {
                    W.value = "", ce((t == null ? void 0 : t.list) || []), y.value = !1, s && s.clear(), R.value = !1
                }, 2700), setTimeout(async () => {
                    await K()
                }, 3200)
            }
            x.value && (e === d - 1 && (c.load(), c.play()), e === d - 2 && setTimeout(() => {
                D.pause(), D.seek(0)
            }, 2800), e === d && (D.load(), D.play()), e === 0 ? (B.load(), B.play()) : e > 0 && e <= d && (N.load(), N.play()))
        },
        l = async e => {
            if (x.value && (e <= 5 && e > 0 ? me(1) : e == 0 && me(2)), e == 5 && G(), e == 1) {
                R.value = !0, setTimeout(() => {
                    R.value = !1
                }, 2500), await q(800);
                const t = await ie(i.value);
                setTimeout(async () => {
                    ce((t == null ? void 0 : t.list) || [])
                }, 800), setTimeout(async () => {
                    await K()
                }, 2200)
            }
        },
        {
            rates: u,
            betScopes: r,
            betMultiples: C,
            issue: i,
            countdown: z,
            countdownTime: Te,
            canBet: j,
            sound: ee,
            gameCode: te,
            agreePreSale: ae,
            introduceDialog: Se,
            introduceLoading: Be,
            betLimitLoading: se,
            introduceHtml: we,
            bgSound: Re,
            issueLoading: le,
            betLimit: he,
            soundEffects: x,
            soundBg: oe,
            historyIssues: F,
            historyIssuesTotalPage: ne,
            mapBet: J,
            winner: Ce,
            closeGame: ue,
            websocket: Le,
            getWinLossResult: K,
            onSwitchIntroduce: Ee,
            onSwitchSound: re,
            onSwitchSoundEffects: _e,
            getIssue: Ie,
            getIntroduce: Ne,
            canAutoPlay: De,
            getBetLimit: Oe,
            getOpenLottery: ie,
            updateHistory: ce,
            onLotteryJump: ke,
            getLottery: Pe,
            getHistoryIssues: Me
        } = mt({
            limitBetTime: d,
            processSound: m == 1 ? n : l,
            startCallback(e) {
                e > 6 && y.value && (y.value = !1, R.value = !1)
            }
        }),
        fe = Array.from({
            length: 10
        }, (e, t) => t),
        pe = _(() => {
            const e = u.value.find(({
                playType: t
            }) => t === "Num");
            return e ? fe.map(t => ({
                playType: "Num",
                playBet: t,
                playRate: e.playRate
            })) : fe.map(t => ({
                playType: "Num",
                playBet: t,
                playRate: 0
            }))
        }),
        Ae = _(() => {
            const e = u.value.filter(({
                playType: o
            }) => o === "Color");
            if (!e.length) return e;
            const t = e.reduce((o, L) => {
                    const {
                        playType: E,
                        playBet: P,
                        playRate: ve
                    } = L;
                    return o[E] || (o[E] = {}), o[E][P] ? o[E][P].playRates.push(ve) : o[E][P] = { ...L,
                        playRates: [ve]
                    }, o
                }, {}),
                g = Object.values(t).flatMap(o => Object.values(o).map(L => {
                    const E = Math.min(...L.playRates),
                        P = Math.max(...L.playRates);
                    return { ...L,
                        playRateStr: E === P ? `x${E}` : `x${E}/x${P}`
                    }
                })).sort((o, L) => o.playBet.localeCompare(L.playBet));
            return [g[0], g[2], g[1]]
        }),
        We = _(() => u.value.filter(({
            playType: e
        }) => e === "BigSmall").sort((e, t) => e.playBet.localeCompare(t.playBet))),
        xe = _({
            get() {
                return a.betDialog
            },
            set(e) {
                a.betDialog = e
            }
        }),
        Ge = _({
            get() {
                return a.amount
            },
            set(e) {
                a.amount = e
            }
        }),
        He = _(() => a.playRate),
        $e = _(() => a.playBet),
        je = _(() => F.value[0] || {}),
        Fe = _(() => F.value.slice(1, 10) || []),
        Je = lt(async () => ut(() =>
            import ("./index.esm.min-DPMBpqzr.js"), [])),
        Ve = async () => {
            if (m != 1 || s || !k.value) return;
            const {
                Parser: e,
                Player: t
            } = await Je(), o = await new e().load(Bt);
            await (s = new t(k.value)).mount(o)
        },
        {
            open: Ue,
            close: Ye
        } = St(() => Le.value, {
            autoReconnect: {
                retries: 10,
                delay: 3e3
            },
            heartbeat: {
                interval: 5e3
            },
            autoClose: !0,
            async onMessage(e, t) {
                let g = {};
                try {
                    g = JSON.parse(t.data)
                } catch {}
                switch (g.PublishType) {
                    case 0:
                        await q(1500), await Me(), setTimeout(async () => {
                            await K(), H()
                        }, 2200);
                        break
                }
            }
        }),
        me = (e = 1) => {
            const t = document.getElementById(`voice${e}`);
            t && t.play()
        },
        ye = e => {
            if (!(w.value || !j.value)) {
                if (ue.value) return T.error(S("common.code_361"));
                a.playBet = e.playBet, a.playType = e.playType, a.playRate = e.playRate, a.betDialog = !0, a.amount = r.value[0] || 1, f.value || (f.value = C.value[0] || 1)
            }
        },
        G = async (e = !1) => {
            a.betDialog = !1, setTimeout(() => {
                a.playBet = null, a.playType = "", a.playRate = 0, f.value = 0, a.amount = 0, e && J.clear()
            }, 10)
        },
        ze = () => {
            w.value || !j.value || (w.value = !0, v.value || (v.value = setInterval(function() {
                h.value = Math.floor(Math.random() * 11)
            }, 60)), setTimeout(function() {
                h.value > 9 && (h.value = 9), clearInterval(v.value), w.value = !1, v.value = null, ye(pe.value.find(e => e.playBet === h.value))
            }, 5e3))
        },
        Ke = async () => {
            const e = b ? bt : Tt;
            if (!O.value) {
                if (le.value) return T.error(S("common.bettingLotteryDrawTimes"));
                if (!ae.value) return T.error(S("common.agreePreSale"));
                if (!i.value) return T.error(S("common.noIssueNumber"));
                if (a.playType) {
                    O.value = !0;
                    try {
                        const {
                            result: t
                        } = await e({
                            gameCode: te.value,
                            issueNumber: i.value,
                            amount: a.amount,
                            betMultiple: f.value,
                            betContent: `${a.playType}_${it(a.playBet)}`
                        });
                        if (!t) return;
                        G(), J.set(i.value, 1), T.success(S("common.betSuccessful")), A(), H()
                    } catch {} finally {
                        O.value = !1
                    }
                }
            }
        },
        Xe = () => {
            rt(be, {
                balance: $,
                trigger: I,
                betScopes: r,
                betMultiples: C,
                issue: i,
                canBet: j,
                gameCode: te,
                amount: Ge,
                betDialog: xe,
                betMultiple: f,
                playRate: He,
                agreePreSale: ae,
                playBet: $e,
                loading: O,
                sound: ee,
                historyIssues: F,
                betLimitLoading: se,
                historyIssuesTotalPage: ne,
                betLimit: he,
                soundEffects: x,
                soundBg: oe,
                countdown: z,
                onClearBet: G,
                onBetting: Ke,
                getBetLimit: Oe,
                onSwitchSound: re
            })
        };
    return et(async () => {
        const e = await De(),
            t = M.get(at.SOUND_EF);
        e && t === 1 && (x.value = !0), await Ve()
    }), {
        betScopes: r,
        betMultiples: C,
        numbers: pe,
        colors: Ae,
        bigSmalls: We,
        issue: i,
        countdown: z,
        countdownTime: Te,
        canBet: j,
        sound: ee,
        randomNum: h,
        introduceDialog: Se,
        betMultiple: f,
        introduceLoading: Be,
        introduceHtml: we,
        betLimitLoading: se,
        lottieEl: k,
        historyIssues: F,
        history1: je,
        history2: Fe,
        animationLock: y,
        animationRoll: R,
        animationNumber: W,
        issueLoading: le,
        historyIssuesTotalPage: ne,
        soundEffects: x,
        soundBg: oe,
        winner: Ce,
        bgSound: Re,
        tipsSound: c,
        loopSound: D,
        tickSound: N,
        lastSound: B,
        currentGame: Y,
        closeGame: ue,
        onSwitchSoundEffects: _e,
        onSwitchIntroduce: Ee,
        getIssue: Ie,
        onSwitchSound: re,
        useProvide: Xe,
        onBet: ye,
        onRandom: ze,
        onClearBet: G,
        getIntroduce: Ne,
        getGameList: U,
        onLotteryJump: ke,
        getLottery: Pe,
        webSocketOpen: Ue,
        webSocketClose: Ye
    }
}

function Dt() {
    return st(be, {})
}
export {
    Dt as a, Nt as u
};