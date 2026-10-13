import {
    r as a,
    c as n,
    A as Y,
    W as Z,
    X as j,
    Y as q,
    Z as B,
    h as J
} from "./index-BgAwOX9Q.js";
const t = q({
        turntableInfo: void 0,
        countDownTime: "00:00:00",
        isWin: !1
    }),
    w = a(null),
    K = a(!1),
    Q = a(!1),
    C = a(!1),
    ee = a(0),
    M = a(!1),
    te = a(!1),
    ne = () => {
        const {
            onAnalyticsTrigger: k
        } = J(), x = a(!1), z = a(!1), h = a([]), p = a(!1), I = a(void 0), v = a([]), r = a({
            page: 1,
            pageSize: 10,
            total: 0
        }), T = a(!1), y = a(!1), {
            verifyPhone: L,
            isLoggedIn: b
        } = Y(), d = a(!1), i = n(() => t.turntableInfo), F = n(() => t.countDownTime), O = n(() => {
            var e;
            return !!((e = i.value) != null && e.isFirstInvitedWheel)
        }), g = n(() => {
            var e;
            return ((e = i.value) == null ? void 0 : e.invitedWheelTotalPrizeAmount) || 0
        }), m = n(() => {
            var e;
            return ((e = i.value) == null ? void 0 : e.userInvitedWheelAmount) || 0
        }), P = n(() => g.value - m.value || 0), A = n(() => {
            var e;
            return ((e = i.value) == null ? void 0 : e.diskDisplayAmount) || []
        }), _ = n(() => {
            var e;
            return ((e = i.value) == null ? void 0 : e.userInvitedWheelCount) || 0
        }), N = n(() => {
            var e;
            return ((e = t.turntableInfo) == null ? void 0 : e.isCashToMainWallet) || !1
        }), R = n(() => A.value.findIndex(e => e === I.value)), $ = n(() => {
            var e;
            return ((e = i.value) == null ? void 0 : e.cashToMainWalletCodeWash) || ""
        }), E = n(() => {
            var e;
            return ((e = t.turntableInfo) == null ? void 0 : e.lastWheelRecordList) || []
        }), U = n(() => {
            var e;
            return (e = t.turntableInfo) == null ? void 0 : e.isOpenDiskDisplay
        }), S = async e => {
            var u, f;
            const {
                code: l,
                data: s
            } = await j();
            if (l === 0) {
                t.turntableInfo = s;
                const {
                    noWinningRandomAmount: o
                } = s;
                if (o != null && o.length && ((u = t == null ? void 0 : t.turntableInfo) != null && u.diskDisplayAmount)) {
                    const c = t.turntableInfo.diskDisplayAmount.sort((D, W) => W - D);
                    c.push(o[0] + "-" + o[1]), t.turntableInfo.diskDisplayAmount = c
                }
                C.value = ((f = t.turntableInfo) == null ? void 0 : f.isFirstInvitedWheel) || !1, !e && (s != null && s.expiredTime) && b.value && H(), d.value || (d.value = !0), m.value === g.value && b.value && d.value && (M.value = !0)
            }
        }, V = async () => {
            const {
                data: e,
                code: l
            } = await B();
            l === 0 && (e.isFirstInvitedWheel ? (p.value = !0, h.value = e.firstInvitedWheelDatas || []) : (h.value = [], t.isWin = !!e.isWin), k("promo_trigger", {
                promo_id: "invited_wheel",
                reward_value: e.prizeAmount || 0
            }), I.value = e.prizeAmount)
        }, G = async e => {
            try {
                const l = {
                        pageNo: e || r.value.page,
                        pageSize: r.value.pageSize
                    },
                    {
                        data: s,
                        code: u
                    } = await Z(l);
                u === 0 && (v.value = [...v.value, ...s.list], r.value.total = s.totalCount, ++r.value.page)
            } finally {
                v.value.length >= r.value.total && (y.value = !0), T.value = !1
            }
        }, H = () => {
            var e;
            if (w.value && clearInterval(w.value), ((e = t.turntableInfo) == null ? void 0 : e.expiredTime) === 0) {
                t.countDownTime = "00:00:00";
                return
            }
            w.value = setInterval(() => {
                var f, o;
                const l = ((f = t.turntableInfo) == null ? void 0 : f.expiredTime) || 0,
                    s = new Date().getTime(),
                    u = l - s;
                if (u <= 0) t.countDownTime = "00:00:00", (o = t.turntableInfo) != null && o.isFirstInvitedWheel || (S(), p.value = !1);
                else {
                    const c = Math.floor(u / 1e3),
                        D = Math.floor(c / 3600),
                        W = Math.floor(c % 3600 / 60),
                        X = c % 60;
                    t.countDownTime = `${String(D).padStart(2,"0")}:${String(W).padStart(2,"0")}:${String(X).padStart(2,"0")}`
                }
            }, 1e3)
        };
        return {
            turntableInfo: i,
            countDownTime: F,
            cashOutDialog: x,
            ruleDialog: z,
            withdrawDialog: Q,
            isEveryDayGift: O,
            withdrawNeedAmount: g,
            needAmount: P,
            userInvitedWheelAmount: m,
            getTurntableReward: V,
            getTurntableInfo: S,
            diskDisplayAmount: A,
            isOpenAward: p,
            firstInvitedWheelDatas: h,
            firstReward: I,
            userInvitedWheelCount: _,
            isCashToMainWallet: N,
            hasWithdrawMethodDialog: K,
            cashToMainWalletCodeWash: $,
            awardIndex: R,
            recordList: E,
            giftVisible: C,
            getPageListHistory: G,
            historyList: v,
            pageInfo: r,
            loading: T,
            finished: y,
            verifyPhone: L,
            startAmount: ee,
            isDataFinished: d,
            isOpenDiskDisplay: U,
            receiveTipVisible: M,
            amountNoDialog: te
        }
    };
export {
    ne as u
};