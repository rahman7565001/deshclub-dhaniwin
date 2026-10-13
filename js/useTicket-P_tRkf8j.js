import {r as i, c as S, k as z, l as H, m as j, o as Z, p as J, q as D} from "./index-BgAwOX9Q.js";
var Q = (l => (l[l.UNUSED = 1] = "UNUSED",
l[l.USED = 2] = "USED",
l[l.EXPIRED = 3] = "EXPIRED",
l[l.LOCKED = 4] = "LOCKED",
l))(Q || {});
const L = i(Math.random() * 1e5)
  , W = i(null)
  , Y = {
    UNUSED: 1,
    USED: 2,
    EXPIRED: 3,
    LOCKED: 4
}
  , a = {
    Recharge: 1,
    Reward: 2,
    Lottery: 3
}
  , V = {
    Amount: 1,
    Reward: 2,
    validBet: 3
}
  , ie = () => {
    const {getStyle: l, getBackgroundImgVal: E} = j()
      , I = i(null)
      , h = i(1)
      , T = 5
      , v = i(0)
      , g = i([])
      , f = i(!1)
      , C = i(!1)
      , F = i()
      , c = i()
      , x = i()
      , A = i()
      , _ = i()
      , b = i()
      , m = i(!1)
      , U = e => ({
        1: e("t645"),
        2: e("t646"),
        3: e("t647"),
        4: e("t648"),
        5: e("t649")
    })
      , B = e => {
        let o = !0;
        return !e || !e.useConditionType ? !0 : (e.useConditionType.includes(a.Recharge) && e.rechargeAmount && (o = o && !!e.rechargeAmount && e.finishedRechargeAmount >= e.rechargeAmount),
        e.useConditionType.includes(a.Reward) && e.rechargeCount && (o = o && !!e.rechargeCount && e.finishedRechargeCount >= e.rechargeCount),
        e.useConditionType.includes(a.Lottery) && e.validBetAmount && (o = o && !!e.validBetAmount && e.finishedValidBetAmount >= e.validBetAmount),
        o)
    }
      , $ = S( () => B(c.value))
      , P = S( () => {
        var o, r;
        const e = (o = c.value) == null ? void 0 : o.validBetConfig;
        return (r = e == null ? void 0 : e.gameCategoryAndVendors) != null && r.length ? e.gameCategoryAndVendors.reduce( (t, n) => ((n.gameCategory || n.vendors.length) && (t.betScope = [...t.betScope, n.gameCategory].filter(s => s),
        t.gameProvider = [...t.gameProvider, ...n.vendors].filter(s => s)),
        t), {
            betScope: "",
            gameProvider: ""
        }) : {
            betScope: "",
            gameProvider: ""
        }
    }
    )
      , M = (e, o, r) => {
        const t = r || c.value;
        if (!t || !t.expireTime)
            return "--";
        if (t.state == 2)
            return e("t650") + "：" + D(t.useTime);
        if (t.state == 3)
            return e("t651") + "：" + D(t.expireTime);
        const n = Date.now()
          , s = new Date(t.expireTime).getTime();
        return s - n < 1440 * 60 * 1e3 && s > n ? `${e("t652")}: ${o.value === "zh" ? e("t654") : ""}${Math.ceil((s - n) / (1e3 * 60 * 60))}h ${o.value === "en" && e("t654")}` : e("t653") + "：" + D(t.expireTime)
    }
      , G = async e => {
        var o, r;
        try {
            const {code: t, data: n} = await H({
                orderNo: String(e)
            });
            if (t == 0) {
                c.value = n,
                F.value = R(((o = c.value) == null ? void 0 : o.couponType) == 1 ? "green" : ((r = c.value) == null ? void 0 : r.couponType) == 2 ? "orange" : "purple", E);
                const {header: s, footer: y, body: u, item: d} = F.value || {};
                A.value = s,
                _.value = y,
                b.value = u,
                x.value = d
            }
        } catch {}
    }
      , w = async e => {
        try {
            const {code: o, msg: r, msgCode: t} = await z({
                orderNo: e
            });
            return {
                code: o,
                msg: r,
                msgCode: t
            }
        } catch (o) {
            throw o
        }
    }
      , N = async (e, o) => {
        const {showToast: r, router: t, onRefresh: n, onClose: s, t: y} = o;
        s && s();
        try {
            const {code: u, msg: d, msgCode: p} = await w(e);
            return p == 7070 ? (n && n(),
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            }),
            {
                success: !0,
                msgCode: p
            }) : p == 7044 ? (t.push({
                path: "/turntable"
            }),
            {
                success: !0,
                msgCode: p
            }) : u == 0 ? (r(y("t637")),
            n && n(),
            {
                success: !0,
                code: u,
                msg: d
            }) : (r(d || "Failed to use ticket"),
            {
                success: !1,
                code: u,
                msg: d
            })
        } catch (u) {
            return r("An error occurred while using the ticket"),
            {
                success: !1,
                error: u
            }
        }
    }
      , q = () => {
        m.value = !0
    }
      , O = () => {
        m.value = !1
    }
      , K = (e, o) => {
        const {ticketId: r, router: t, onOpenDialog: n} = o;
        e.couponType == a.Recharge ? (r.value = e.orderNo,
        t.push({
            path: "/wallet/recharge"
        })) : n()
    }
      , X = async (e=!1) => {
        var o, r;
        f.value = !0,
        e && (h.value = 1,
        C.value = !1,
        g.value = []);
        try {
            const {data: t, code: n} = await Z({
                pageNo: h.value,
                pageSize: T
            });
            if (n === 0) {
                v.value = (t == null ? void 0 : t.totalCount) ?? 0;
                const s = Array.isArray(t == null ? void 0 : t.list) ? t.list : [];
                g.value.push(...s),
                s.length > 0 && (h.value += 1),
                s.length < T && (C.value = !0),
                v.value > 0 && g.value.length >= v.value && (C.value = !0)
            } else
                C.value = !0
        } catch {
            C.value = !0
        } finally {
            f.value = !1,
            await J(),
            (r = (o = I.value) == null ? void 0 : o.check) == null || r.call(o)
        }
    }
      , k = (e, o) => {
        var n, s;
        const r = {
            1: {
                class: "unused",
                text: o("t305")
            },
            2: {
                class: "used",
                text: o("t643")
            },
            3: {
                class: "expired",
                text: o("t644")
            }
        }
          , t = e > 3 ? 2 : e;
        return {
            text: (n = r[t]) == null ? void 0 : n.text,
            className: (s = r[t]) == null ? void 0 : s.class
        }
    }
      , R = (e, o) => ({
        orange: {
            theme: "#E66726",
            stateColor: "rgba(255, 255, 255, 0.7)",
            header: {
                bgImg: o("ticket-" + e + "-header")
            },
            body: {
                color: "var(--text_color_L1)",
                bgImg: o("ticket-" + e + "-body")
            },
            item: {
                valueColor: "#848694",
                exceedColor: "#F95959",
                process: ["#CE4A0D", "#EC8226"],
                titleBg: ["#E36D35", "#BF2814"],
                innerBg: ["#F6E9CF", "#F0D6A3"],
                titleTextColor: "#FFD7AC",
                processTextColor: "#F65D0B",
                normalProcessColor: "#78381A",
                processBg: "#E5C68A",
                decorationBg: ["#C02A15", "#FF7E2D"],
                quota: "#DB6F24",
                quotaColor: "#FFE9DD"
            },
            footer: {
                btn: ["#D96413", "#ECA128"],
                valueColor: "var(--norm_red_color)",
                btnTextColor: "#FFFFFF",
                typeColor: "var(--text_primary)",
                titleColor: "var(--text_color_L1)",
                contentColor: "var(--norm_hint_color)"
            },
            singnalImg: o("ticket-footer-singnal"),
            operationImg: o("ticket-" + e + "-operation")
        },
        green: {
            theme: "#1D64D9",
            stateColor: "rgba(255, 255, 255, 0.7)",
            header: {
                bgImg: o("ticket-" + e + "-header")
            },
            body: {
                color: "var(--text_color_L1)",
                bgImg: o("ticket-" + e + "-body")
            },
            item: {
                valueColor: "#183F94",
                exceedColor: "#A92E2E",
                process: ["#2141CF", "#2471F1"],
                titleBg: ["#0076F4", "#1E4BBF"],
                innerBg: ["#BED0F1", "#A1C1F5"],
                titleTextColor: "#FFFFFF",
                processTextColor: "#2555E4",
                normalProcessColor: "#183F94",
                processBg: "#6493E3",
                decorationBg: ["#0076F4", "#1E4BBF"],
                quota: "#1558CE",
                quotaColor: "#DBE9FF"
            },
            footer: {
                btn: ["#1953C9", "#2589FC"],
                valueColor: "var(--norm_red_color)",
                btnTextColor: "#DBEFFD",
                typeColor: "var(--text_primary)",
                titleColor: "var(--text_color_L1)",
                contentColor: "var(--norm_hint_color)"
            },
            singnalImg: o("ticket-footer-singnal"),
            operationImg: o("ticket-" + e + "-operation")
        },
        purple: {
            theme: "#9C54EA",
            stateColor: "rgba(255, 255, 255, 0.7)",
            header: {
                bgImg: o("ticket-" + e + "-header")
            },
            body: {
                color: "var(--text_color_L1)",
                bgImg: o("ticket-" + e + "-body")
            },
            item: {
                valueColor: "#848694",
                exceedColor: "#F95959",
                process: ["#722CD3", "#9F51E8"],
                titleBg: ["#9E5ADD", "#592FCB"],
                titleTextColor: "#EABFFF",
                processTextColor: "#8037D9",
                normalProcessColor: "#4D2D71",
                innerBg: ["#DABEED", "#C4AFE8"],
                processBg: "#AF8BDB ",
                decorationBg: ["#9E5ADD", "#592FCB"],
                quota: "#7C4CFF",
                quotaColor: "#FFE9DD"
            },
            footer: {
                btn: ["#742CE6", "#BA72EC"],
                valueColor: "var(--norm_red_color)",
                btnTextColor: "#DBEFFD",
                typeColor: "var(--text_primary)",
                titleColor: "var(--text_color_L1)",
                contentColor: "var(--norm_hint_color)"
            },
            singnalImg: o("ticket-footer-singnal"),
            operationImg: o("ticket-" + e + "-operation")
        }
    })[e];
    return {
        ticketId: W,
        depositTicketKey: L,
        UserCouponState: Y,
        CouponType: a,
        CouponCondition: V,
        finished: C,
        list: g,
        loading: f,
        ticketStyle: F,
        ticket: c,
        tItem: x,
        header: A,
        footer: _,
        body: b,
        conditionMet: $,
        validBetConfig: P,
        dialogVisible: m,
        showTime: M,
        refreshDepositTicket: () => {
            L.value = Math.random() * 1e5
        }
        ,
        getState: k,
        getCurStyle: e => R(e, E),
        generateLinearGradient: (e, o="90deg") => {
            if (!e.every(t => /^#[0-9a-fA-F]{6,8}$/.test(t)))
                throw new Error("All colors must be hex strings of 6 or 8 digits, e.g. #RRGGBB or #RRGGBBAA");
            const r = e.map( (t, n) => {
                const s = e.length === 1 ? 0 : Math.round(n / (e.length - 1) * 1e4) / 100;
                return `${t} ${s}%`
            }
            );
            return `linear-gradient(${o}, ${r.join(", ")})`
        }
        ,
        getDecorationStyle: e => {
            const [o,r] = e;
            return `url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22253%22%20height%3D%2248%22%20viewBox%3D%220%200%20253%2048%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M0%200H253L239.154%2033.2308C235.427%2042.1743%20226.689%2048%20217%2048H36C26.3112%2048%2017.5726%2042.1743%2013.8462%2033.2308L0%200Z%22%20fill%3D%22url%28%23paint0_linear_7636_93960%29%22%2F%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22paint0_linear_7636_93960%22%20x1%3D%22126.5%22%20y1%3D%2248%22%20x2%3D%22126.5%22%20y2%3D%220%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20stop-color%3D%22${encodeURIComponent(o)}%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22${encodeURIComponent(r)}%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3C%2Fsvg%3E')`
        }
        ,
        getSpinTypeText: U,
        checkConditionMet: B,
        initStyle: async () => {
            await l()
        }
        ,
        hasCondition: e => {
            const o = e;
            return !o || !o.useConditionType ? !1 : o.useConditionType.includes(a.Recharge) && !!(o != null && o.rechargeAmount) || o.useConditionType.includes(a.Reward) && !!(o != null && o.rechargeCount) || o.useConditionType.includes(a.Lottery) && !!(o != null && o.validBetAmount)
        }
        ,
        getUserCouponListInfo: X,
        getCoupon: G,
        useTicketCoupon: w,
        handleTicketClaim: N,
        handleConditionMet: K,
        openDialog: q,
        closeDialog: O
    }
}
;
export {Q as U, ie as u};
