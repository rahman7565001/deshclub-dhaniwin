import {
    u as We,
    dp as L,
    P as Qe,
    dt as Xe,
    du as Ye,
    c,
    r as w,
    am as ze,
    c0 as Je,
    Y as Ue,
    f as je,
    dx as ke,
    aX as qe,
    cA as Ke
} from "./index-BgAwOX9Q.js";
import {
    u as Ze,
    I as K
} from "./BetRule-DyIqbhnc.js";
import {
    a as et
} from "./WingoSkeleton.vue_vue_type_style_index_0_scoped_cd4f34e3_lang-CZJCWYiN.js";
import {
    t as tt
} from "./tips-DMib3O3U.js";
import {
    g as at
} from "./D5-Diu-SrEk.js";
const st = "/assets/D5-1viAL__i.svga",
    nt = "/assets/turn-CQOpIwOX.mp3",
    lt = "/assets/open-dssYvVVB.mp3",
    ot = "/assets/countdown-BWbMq52B.mp3",
    it = "/assets/close-GyenagmA.mp3",
    ct = "/images/ball_0-0chiXV78.png",
    rt = "/images/ball_1-BxPoMWIQ.png",
    ut = "/images/ball_2-CfTcIstT.png",
    pt = "/images/ball_3-fN8aRLDn.png",
    mt = "/images/ball_4-BvFm2RT1.png",
    yt = "/images/ball_5-DNM-mzx2.png",
    dt = "/images/ball_6-DCigRp5p.png",
    gt = "/images/ball_7-DymLu5Ob.png",
    ft = "/images/ball_8-DckNEDZy.png",
    vt = "/images/ball_9-G4LbB3WG.png",
    D = {
        dice_0: ct,
        dice_1: rt,
        dice_2: ut,
        dice_3: pt,
        dice_4: mt,
        dice_5: yt,
        dice_6: dt,
        dice_7: gt,
        dice_8: ft,
        dice_9: vt
    };

function Dt(A = 1) {
    const f = je(),
        {
            localStore: Z
        } = Xe(),
        {
            trigger: ee,
            balance: O,
            updateBalance: te,
            onBetTrigger: ae
        } = et(),
        {
            t: v
        } = We();
    let r = null,
        m = null;
    const se = new L.Howl({
            src: [nt],
            loop: !1,
            preload: !1
        }),
        ne = new L.Howl({
            src: [tt],
            preload: !1
        }),
        P = new L.Howl({
            src: [ot],
            preload: !1
        }),
        le = new L.Howl({
            src: [lt],
            preload: !1
        }),
        oe = new L.Howl({
            src: [it],
            preload: !1
        }),
        _ = w(1),
        E = w(),
        I = w(!1),
        h = w(!1),
        T = w(!1),
        d = 5,
        ie = async e => {
            if (g.value && (e <= 5 && e > 0 ? k(1) : e == 0 && k(2)), e == 5 && B(), e == 1) {
                await ke(1e3);
                const a = await z(y.value);
                setTimeout(async () => {
                    X((a == null ? void 0 : a.list) || [])
                }, 800), setTimeout(async () => {
                    await J()
                }, 2200)
            }
        },
        ce = async e => {
            var a;
            if (e == 1) {
                const s = await z(y.value),
                    l = ((a = s == null ? void 0 : s.item) == null ? void 0 : a.premium) || "";
                if (l) {
                    const n = l.split("") || ["0", "0", "0", "0", "0"];
                    Ve(n)
                }
                h.value = !0, g.value && le.play(), setTimeout(async () => {
                    X((s == null ? void 0 : s.list) || []), I.value = !1, h.value = !1, r && r.stop(), r && r.clear()
                }, 2e3), setTimeout(async () => {
                    await J()
                }, 2500)
            }
            e === d + 1 && (r && r.start(), I.value = !0, B()), g.value && (e === d && ne.play(), e === d - 1 && se.play(), [0, d].includes(e) && (e === d ? (oe.play(), P.play()) : P.pause()))
        },
        {
            rates: S,
            betScopes: R,
            betMultiples: $,
            gameCode: N,
            sound: M,
            canBet: x,
            issue: y,
            introduceHtml: re,
            introduceDialog: ue,
            introduceLoading: pe,
            countdown: F,
            countdownTime: me,
            betLimitLoading: H,
            betLimit: G,
            agreePreSale: V,
            soundEffects: g,
            soundBg: W,
            historyIssues: C,
            historyIssuesTotalPage: ye,
            winner: de,
            mapBet: Q,
            closeGame: ge,
            updateHistory: X,
            getIntroduce: fe,
            getIssue: ve,
            onSwitchIntroduce: _e,
            onSwitchSound: Y,
            canAutoPlay: be,
            getBetLimit: Be,
            getLottery: Le,
            getOpenLottery: z,
            onLotteryJump: we,
            getWinLossResult: J,
            onSwitchSoundEffects: De
        } = Ze({
            limitBetTime: d,
            processSound: A === 1 ? ce : ie
        }),
        t = Ue({
            betDialog: !1,
            amount: 1,
            betMultiple: 1,
            playType: "",
            playBet: null,
            playRate: 0,
            navList: [{
                name: "A",
                code: "First"
            }, {
                name: "B",
                code: "Second"
            }, {
                name: "C",
                code: "Third"
            }, {
                name: "D",
                code: "Fourth"
            }, {
                name: "E",
                code: "Fifth"
            }, {
                name: "SUM",
                code: "Sum"
            }],
            actNav: {
                name: "A",
                code: "First"
            },
            numberList: [],
            initContainer: []
        }),
        b = c(() => t.numberList),
        U = c(() => t.initContainer),
        Te = c(() => t.navList),
        p = c(() => t.actNav),
        Se = c({
            get() {
                return t.betDialog || !1
            },
            set(e) {
                t.betDialog = e
            }
        }),
        Ce = c(() => {
            const e = Array.from({
                    length: 10
                }, (s, l) => l),
                a = S.value.find(({
                    playType: s
                }) => {
                    var l;
                    return s === `${(l=p.value)==null?void 0:l.code}Num`
                });
            return a ? e.map(s => {
                var l;
                return {
                    playType: `${(l=p.value)==null?void 0:l.code}Num`,
                    playBet: s,
                    playRate: a.playRate
                }
            }) : e.map(s => {
                var l;
                return {
                    playType: `${(l=p.value)==null?void 0:l.code}Num`,
                    playBet: s,
                    playRate: 0
                }
            })
        }),
        Ee = c(() => {
            const e = S.value.filter(({
                    playType: n
                }) => {
                    var i;
                    return n === `${(i=p.value)==null?void 0:i.code}BigSmall`
                }),
                a = S.value.filter(({
                    playType: n
                }) => {
                    var i;
                    return n === `${(i=p.value)==null?void 0:i.code}OddEven`
                }),
                s = [...e, ...a].sort((n, i) => n.playTypeId - i.playTypeId);
            return s == null ? void 0 : s.map(n => ({
                playType: n.playType,
                playBet: Pe(n.playBet),
                playRate: n.playRate,
                playTypeId: n.playTypeId,
                color: Me(n.playBet)
            }))
        }),
        Ie = c(() => t.playRate),
        he = c(() => [t.numberList, t.initContainer]),
        Re = c(() => {
            var e, a;
            return ((a = (e = C.value[0]) == null ? void 0 : e.premium) == null ? void 0 : a.split("")) || []
        }),
        $e = c(() => {
            var e;
            return ((e = C.value[0]) == null ? void 0 : e.sum) || 0
        }),
        j = c({
            get() {
                return t.amount
            },
            set(e) {
                t.amount = e
            }
        }),
        Ne = c(() => {
            const e = b.value.length;
            return e > 0 ? e : 1
        }),
        Ae = e => {
            t.actNav = e
        },
        Oe = e => {
            if (ge.value) return f.error(v("common.code_361"));
            const {
                selectType: a,
                ...s
            } = e;
            if (t.betDialog = !0, a === "num") {
                const n = t.numberList.findIndex(i => i.playBet === s.playBet);
                t.initContainer = [], n === -1 ? t.numberList.push(s) : t.numberList.splice(n, 1), t.numberList.length === 0 && (t.betDialog = !1);
                return
            }
            const l = t.initContainer.findIndex(n => n.playBet === s.playBet);
            t.numberList = [], l > -1 ? t.initContainer.splice(l, 1) : (t.initContainer = [], t.initContainer.push(s)), t.initContainer.length === 0 && (t.betDialog = !1)
        },
        Pe = e => {
            switch (e) {
                case "H":
                    return "Big";
                case "L":
                    return "Small";
                case "O":
                    return "Odd";
                case "E":
                    return "Even";
                default:
                    return e
            }
        },
        Me = e => {
            switch (e) {
                case "H":
                    return "#F8B460";
                case "L":
                    return "#609DEC";
                case "O":
                    return "#F04848";
                case "E":
                    return "#13C164";
                default:
                    return e
            }
        },
        B = (e = !1) => {
            t.playBet = null, t.playType = "", t.playRate = 0, _.value = $.value[0] || 1, t.amount = R.value[0] || 1, t.initContainer = [], t.numberList = [], t.betDialog = !1, e && Q.clear()
        },
        xe = async () => {
            var q;
            if (T.value) return;
            if (!V.value) return f.error(v("common.agreePreSale"));
            if (!y.value) return f.error(v("common.noIssueNumber"));
            if (_.value * j.value * Ne.value > O.value) return f.error(v("common.code_142"));
            const a = (b == null ? void 0 : b.value.sort((o, u) => ((o == null ? void 0 : o.playBet) ? ? 0) - ((u == null ? void 0 : u.playBet) ? ? 0))).map(o => {
                    var u;
                    return { ...o,
                        playType: `${(u=p.value)==null?void 0:u.code}Num`
                    }
                }),
                s = o => o.replace(/^.*?(BigSmall|OddEven)/, "$1"),
                n = [...(q = U.value) == null ? void 0 : q.map(o => {
                    var u;
                    return { ...o,
                        playType: `${(u=p.value)==null?void 0:u.code}${s(o==null?void 0:o.playType)}`
                    }
                }), ...a],
                i = n == null ? void 0 : n.map(o => `${o.playType}_${o.playBet}`);
            try {
                T.value = !0;
                const {
                    result: o
                } = await at({
                    gameCode: N.value,
                    issueNumber: y.value,
                    amount: t.amount,
                    betMultiple: _.value,
                    betContent: i
                });
                if (!o) return;
                Q.set(y.value, 1), B(), f.success(v("common.betSuccessful")), ae(), await te()
            } catch {} finally {
                T.value = !1
            }
        },
        Fe = () => {
            Ke(K, {
                betDialog: Se,
                betScopes: R,
                betMultiples: $,
                betMultiple: _,
                amount: j,
                playRate: Ie,
                playBet: he,
                loading: T,
                agreePreSale: V,
                betLimitLoading: H,
                betLimit: G,
                sound: M,
                issue: y,
                canBet: x,
                historyIssues: C,
                gameCode: N,
                historyIssuesTotalPage: ye,
                soundEffects: g,
                soundBg: W,
                trigger: ee,
                balance: O,
                countdown: F,
                onClearBet: B,
                onBetting: xe,
                getBetLimit: Be,
                onSwitchSound: Y
            })
        },
        k = (e = 1) => {
            const a = document.getElementById(`voice${e}`);
            a && (a == null || a.play())
        },
        He = Je(async () => qe(() =>
            import ("./index.esm.min-DPMBpqzr.js"), [])),
        Ge = async () => {
            if (A !== 1) return;
            r && (r.destroy(), r = null);
            const {
                Parser: e,
                Player: a
            } = await He();
            m = await new e().load(st), E.value && await (r = new a(E.value)).mount(m)
        },
        Ve = e => {
            const a = new Image;
            a.src = D[`dice_${e[0]}`];
            const s = new Image;
            s.src = D[`dice_${e[1]}`];
            const l = new Image;
            l.src = D[`dice_${e[2]}`];
            const n = new Image;
            n.src = D[`dice_${e[3]}`];
            const i = new Image;
            i.src = D[`dice_${e[4]}`], m.replaceElements["5D_ball_3"] = a, m.replaceElements["5D_ball_4"] = s, m.replaceElements["5D_ball_5"] = l, m.replaceElements["5D_ball_6"] = n, m.replaceElements["5D_ball_7"] = i
        };
    return Qe(async () => {
        const e = await be(),
            a = Z.get(Ye.SOUND_EF);
        e && a === 1 && (g.value = !0), await Ge()
    }), {
        betScopes: R,
        betMultiples: $,
        betMultiple: _,
        sound: M,
        issue: y,
        canBet: x,
        introduceHtml: re,
        introduceDialog: ue,
        introduceLoading: pe,
        historyIssues: C,
        countdownTime: me,
        countdown: F,
        rates: S,
        betLimitLoading: H,
        betLimit: G,
        soundEffects: g,
        soundBg: W,
        animationLock: I,
        animationRoll: h,
        lottieEl: E,
        lastResultSum: $e,
        lastResult: Re,
        winner: de,
        numberList: b,
        navList: Te,
        actNav: p,
        initContainer: U,
        numList: Ce,
        bigSmallEven: Ee,
        gameCode: N,
        onBet: Oe,
        onClearBet: B,
        useProvide: Fe,
        getIntroduce: fe,
        onSwitchIntroduce: _e,
        onSwitchSound: Y,
        getIssue: ve,
        getLottery: Le,
        showType: Ae,
        onLotteryJump: we,
        onSwitchSoundEffects: De
    }
}

function Tt() {
    return ze(K, {})
}
export {
    Dt as a, Tt as u
};