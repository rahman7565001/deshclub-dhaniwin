import {
    u as ie,
    Y as G,
    t as ce,
    r as l,
    c as r,
    m as ue,
    J as de,
    K as ve,
    dE as ge,
    dF as pe,
    dG as he,
    h as fe,
    dH as me,
    dI as we
} from "./index-BgAwOX9Q.js";
import {
    u as be
} from "./useProtocol-CmBEKSqV.js";
const ye = {
        bg: "var(--secondary_color2)",
        box_shadow: "rgba(112, 170, 220, 0.30)",
        active: "#8FB6FE",
        active_box: "linear-gradient(180deg, #90B6FF 70%, #3368CC 100%)",
        border: "#2E63C7",
        progress_border: "#1748A4",
        text: "#4A81E8",
        progress_bg: "linear-gradient(0deg, #1A366B 0%, #0D2C64 98.5%)"
    },
    Se = {
        bg: "var(--secondary_color2)",
        box_shadow: "rgba(247, 177, 85, 0.30)",
        active: "#EDC078",
        active_box: "linear-gradient(180deg, #EDC078 70%, #CC7A33 100%)",
        border: "#C8700A",
        progress_border: "#A55A04",
        text: "#E28409",
        progress_bg: "linear-gradient(0deg, #593D19 0%, #4E2F0C 98.5%)"
    },
    Ce = {
        bg: "var(--secondary_color2)",
        box_shadow: "rgba(167, 115, 236, 0.30)",
        active: "#BBA9FB",
        active_box: "linear-gradient(180deg, #BBA9FB 70%, #5C33CC 100%)",
        border: "#802CF0",
        progress_border: "#663CA9",
        text: "#9A5CEF",
        progress_bg: "linear-gradient(0deg, #311754 0%, #291347 98.5%)"
    },
    Ae = {
        bg: "var(--secondary_color2)",
        box_shadow: "rgba(234, 110, 112, 0.30)",
        active: "#FF7878",
        active_box: "linear-gradient(180deg, #FF7878 70%, #BF222C 100%)",
        border: "#CE1013",
        progress_border: "#8D3C3C",
        text: "#F95959",
        progress_bg: "linear-gradient(0deg, #5C1D1A 0%, #461919 98.5%)"
    },
    x = {
        sliver: ye,
        gold: Se,
        diamond: Ce,
        special: Ae
    },
    Ie = "/images/silver_icon-C2CVhsFb.webp",
    xe = "/images/gold_icon-eC-ymShW.webp",
    _e = "/images/diamond_icon-CakZttuN.webp",
    Fe = "/images/special_icon-BL1IHfJz.webp",
    c = [{
        icon: "",
        amount: "111",
        type: 1,
        name: "Silver Spin",
        wheel2Name: "Brass Spin",
        label: "silver",
        color: x.sliver
    }, {
        amount: "222",
        type: 2,
        name: "Gold Spin",
        wheel2Name: "Silver Spin",
        label: "gold",
        icon: "",
        color: x.gold
    }, {
        amount: "33",
        type: 3,
        name: "Diamond Spin",
        wheel2Name: "Gold Spin",
        label: "diamond",
        icon: "",
        color: x.diamond
    }, {
        amount: "444",
        type: 4,
        name: "Special Spin",
        wheel2Name: "Special Spin",
        label: "special",
        icon: "",
        color: x.special
    }],
    We = {
        silver: Ie,
        gold: xe,
        diamond: _e,
        special: Fe
    },
    i = l({}),
    f = l(0),
    W = l(0),
    d = G({
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: ""
    }),
    X = l(!1),
    L = l({}),
    M = l([]),
    T = l([]),
    k = l(!1),
    Me = () => {
        const {
            t: o
        } = ie(), {
            onAnalyticsTrigger: H
        } = fe();
        d[0] = o("t1213"), d[1] = o("t1214"), d[2] = o("t1208"), d[3] = o("t1209"), d[4] = o("t1210"), d[5] = o("t1211"), c[0].name = o("t1208"), c[0].wheel2Name = o("t1228"), c[1].name = o("t1209"), c[1].wheel2Name = o("t1208"), c[2].name = o("t1210"), c[2].wheel2Name = o("t1209"), c[3].name = o("t1211"), c[3].wheel2Name = o("t1211");
        const _ = l([]),
            m = l([]),
            g = G({
                pageNo: 1,
                pageSize: 10
            }),
            w = l(!1),
            y = l(0),
            F = l([]),
            B = l(""),
            p = l(!1),
            {
                richText: U,
                getProtocol: z
            } = be(5),
            P = ce(),
            {
                getImgVal: V
            } = ue(),
            O = r(() => i.value.isOpen || !1),
            J = r(() => i.value.currentValidDate || ""),
            R = r(() => i.value.rechargeAmount || 0),
            b = r(() => i.value.silverWheelInfo || {}),
            S = r(() => i.value.goldWheelInfo || {}),
            C = r(() => i.value.diamondWheelInfo || {}),
            A = r(() => i.value.specialWheelInfo || {}),
            j = r(() => i.value.isSpecialWheelUnlock || !1),
            K = r(() => i.value.rewardUpAmount || 0),
            Y = r(() => i.value.specialWheelUnlockAmount || 0),
            Z = r(() => {
                var t, n;
                if (!((t = b.value.rewardList) != null && t.length)) return 0;
                let e = ((n = b.value.rewardList) == null ? void 0 : n.map(a => {
                    if (a.rewardType === 1) return a.rewardAmount
                }).filter(a => a !== void 0)) || [];
                return e = e.sort((a, u) => u - a), e[0] || 0
            }),
            N = r(() => {
                var t, n;
                if (!((t = S.value.rewardList) != null && t.length)) return 0;
                let e = ((n = S.value.rewardList) == null ? void 0 : n.map(a => {
                    if (a.rewardType === 1) return a.rewardAmount
                }).filter(a => a !== void 0)) || [];
                return e = e.sort((a, u) => u - a), e[0] || 0
            }),
            $ = r(() => {
                var t, n;
                if (!((t = C.value.rewardList) != null && t.length)) return 0;
                let e = ((n = C.value.rewardList) == null ? void 0 : n.map(a => {
                    if (a.rewardType === 1) return a.rewardAmount
                }).filter(a => a !== void 0)) || [];
                return e = e.sort((a, u) => u - a), e[0] || 0
            }),
            q = r(() => {
                var t, n;
                if (!((t = A.value.rewardList) != null && t.length)) return 0;
                let e = ((n = A.value.rewardList) == null ? void 0 : n.map(a => {
                    if (a.rewardType === 1) return a.rewardAmount
                }).filter(a => a !== void 0)) || [];
                return e = e.sort((a, u) => u - a), e[0] || 0
            }),
            v = r(() => {
                switch (f.value) {
                    case 0:
                        return b.value;
                    case 1:
                        return S.value;
                    case 2:
                        return C.value;
                    case 3:
                        return A.value;
                    default:
                        return b.value
                }
            }),
            Q = r(() => {
                var e;
                return ((e = v.value.rewardList) == null ? void 0 : e.findIndex(t => t.id === L.value.id)) || 0
            }),
            ee = e => {
                f.value = e, W.value = v.value.remainSpinCount || 0, E()
            },
            ae = async () => {
                const {
                    data: e
                } = await we();
                if (e) {
                    const t = ["silverWheelInfo", "goldWheelInfo", "diamondWheelInfo", "specialWheelInfo"],
                        n = {
                            silverWheelInfo: "silver",
                            goldWheelInfo: "gold",
                            diamondWheelInfo: "diamond",
                            specialWheelInfo: "special"
                        },
                        a = [];
                    t.forEach(u => {
                        var D;
                        const h = e[u];
                        (D = h == null ? void 0 : h.rewardList) != null && D.length && h.rewardList.forEach(s => {
                            s.rewardType !== 1 && (s.rewardType === 0 ? s.rewardText = d[s.rewardType] : s.rewardText = d[s.rewardType] + `
 X` + s.rewardAmount)
                        });
                        const I = c.find(s => s.label === n[u]);
                        (Object.keys(I || {}) || []).forEach(s => {
                            I && I[s] && (h[s] = I[s])
                        }), a.push(h)
                    }), T.value = a, i.value = e, E()
                }
                W.value = v.value.remainSpinCount || 0
            },
            te = r(() => T.value[f.value]),
            ne = async () => {
                for (const e of c) e.icon = V(`${e.label}_icon`) || We[e.label] || ""
            },
            re = async () => {
                try {
                    p.value = !0;
                    const {
                        data: e
                    } = await me(g);
                    e ? (_.value = [..._.value, ...e.list], y.value = e.totalCount, p.value = !1, (e.list.length < g.pageSize || m.value.length >= y.value) && (w.value = !0), e.list && e.list.length > 0 && ++g.pageNo) : w.value = !0
                } catch {} finally {
                    p.value = !1
                }
            },
            oe = async () => {
                try {
                    p.value = !0;
                    const {
                        data: e
                    } = await pe(g);
                    e ? (m.value = [...m.value, ...e.list], y.value = e.totalCount, p.value = !1, (e.list.length < g.pageSize || m.value.length >= y.value) && (w.value = !0), e.list && e.list.length > 0 && ++g.pageNo) : w.value = !0
                } catch {} finally {
                    p.value = !1
                }
            },
            le = async e => {
                try {
                    const {
                        data: t
                    } = await he({
                        rechargeWheelType: f.value + 1
                    });
                    t && (L.value = t, H("promo_trigger", {
                        promo_id: "recharge_turntable_reward",
                        reward_value: t.rewardAmount || 0
                    }));
                    const n = setTimeout(async () => {
                        t.rewardType !== 0 && (X.value = !0), clearTimeout(n)
                    }, e || 2800);
                    k.value = !1
                } finally {
                    k.value = !1
                }
            },
            se = e => {
                switch (e) {
                    case 1:
                        return Z.value;
                    case 2:
                        return N.value;
                    case 3:
                        return $.value;
                    case 4:
                        return q.value;
                    default:
                        return 0
                }
            },
            E = () => {
                var t;
                const e = (t = v.value.taskList) == null ? void 0 : t.length;
                if (e && v.value.taskList) {
                    F.value = [{
                        amount: 0,
                        spinCount: 0,
                        width: "0%"
                    }];
                    const n = v.value.taskList[e - 1].rechargeAmount || 0;
                    B.value = Math.min(R.value / n * 100, 100).toFixed(2), v.value.taskList.map(a => {
                        F.value.push({
                            amount: a.rechargeAmount || 0,
                            spinCount: a.spinCount || 0,
                            width: a.rechargeAmount ? Math.min(a.rechargeAmount / n * 100, 100).toFixed(2) + "%" : "0%"
                        })
                    })
                }
            };
        return {
            currentTab: f,
            changeTab: ee,
            getBaseInfo: ae,
            isOpen: O,
            getRecordList: re,
            recordList: _,
            wheelBaseInfo: i,
            handleSpinWheel: le,
            pageInfo: g,
            currentValidDate: J,
            rechargeAmount: R,
            spinResult: L,
            silverWheelInfo: b,
            goldWheelInfo: S,
            diamondWheelInfo: C,
            specialWheelInfo: A,
            isSpecialWheelUnlock: j,
            currentWheelInfo: v,
            spinCount: W,
            rewardIndex: Q,
            rewardUpAmount: K,
            getMaxAmount: se,
            menuList: T,
            tipDialog: X,
            depositSpinCount: F,
            rechargeAmountAsync: B,
            getSpinRecordList: oe,
            spinRecordList: m,
            loading: p,
            finished: w,
            menuArr: c,
            noticeList: M,
            getNoticeList: async () => {
                const {
                    data: e
                } = await ge();
                e && (M.value = e || [])
            },
            specialWheelUnlockAmount: Y,
            whellText: d,
            goldMaxAmount: N,
            rest: () => {
                f.value = 0
            },
            handleRules: async () => {
                await z();
                const {
                    open: e,
                    close: t
                } = de({
                    props: {
                        title: o("t230"),
                        maskNotClose: !0,
                        isShowConfirmBtn: !0,
                        onConfirm: () => t()
                    },
                    slots: {
                        default: () => ve("div", {
                            innerHTML: U.value || "",
                            class: "rich_div"
                        })
                    }
                });
                e()
            },
            handleGoHistory: () => {
                P.push({
                    name: "rechargeTurntableHistory"
                })
            },
            textFun: e => {
                switch (e) {
                    case 2:
                        return "Silver Spins X";
                    case 3:
                        return "Gold Spins X";
                    case 4:
                        return "Diamond Spins X";
                    case 5:
                        return "Special Spins X";
                    default:
                        return "Free Spins X"
                }
            },
            wheel2TextFun: e => {
                switch (e) {
                    case 2:
                        return "Brass Spins X";
                    case 3:
                        return "Silver Spins X";
                    case 4:
                        return "Gold Spins X";
                    case 5:
                        return "Special Spins X";
                    default:
                        return "Free Spins X"
                }
            },
            initImg: ne,
            currentMenu: te,
            isSpinning: k
        }
    };
export {
    Me as u
};