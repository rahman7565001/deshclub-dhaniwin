import {
    t as B,
    u as V,
    c as W,
    r as l,
    F as z,
    n as y,
    G as O,
    H,
    I as K,
    f as Q,
    J as Y,
    K as w,
    m as X,
    L as Z,
    M as ee
} from "./index-BgAwOX9Q.js";
import {
    c as te
} from "./currency-DTUBf2lI.js";
const ae = Q(),
    oe = ["LocalBankCard", "LocalEWallet"],
    re = c => {
        const T = {
                key: "holderName",
                icon: "user",
                prefix: !0,
                props: {
                    placeholder: c("t117"),
                    disabled: !1
                },
                rule: {
                    message: c("t117"),
                    validate: o => !!o
                }
            },
            i = {
                key: "accountNo",
                icon: "bank",
                props: {
                    placeholder: c("t118"),
                    disabled: !1,
                    type: "digit"
                },
                rule: {
                    message: c("t118"),
                    validate: o => !!(o != null && o.trim()) && /^[\d\s]+$/.test(o)
                }
            };
        return {
            userNameInput: T,
            accountInput: i
        }
    },
    ce = () => {
        const c = B(),
            {
                getBackgroundImgVal: T
            } = X(),
            {
                t: i
            } = V(),
            o = l({}),
            N = l(!1),
            h = l({}),
            k = l([]),
            u = l(""),
            m = l(""),
            g = l(!1),
            R = l({
                accountNo: "",
                holderName: ""
            });
        let I = null,
            v = null;
        const p = e => {
                const t = new Date(e).getTime() - Date.now();
                if (t <= 0) return "00:00:00";
                const a = Math.floor(t / (1e3 * 60 * 60)),
                    n = Math.floor(t % (1e3 * 60 * 60) / (1e3 * 60)),
                    r = Math.floor(t % (1e3 * 60) / 1e3);
                return `${String(a).padStart(2,"0")}:${String(n).padStart(2,"0")}:${String(r).padStart(2,"0")}`
            },
            U = () => {
                I && (clearInterval(I), I = null)
            },
            E = () => {
                v && (clearInterval(v), v = null)
            },
            D = e => {
                if (U(), !e || new Date(e).getTime() <= Date.now()) {
                    u.value = "";
                    return
                }
                u.value = p(e), I = window.setInterval(() => {
                    u.value = p(e)
                }, 1e3)
            },
            _ = async () => {
                var a;
                const {
                    data: e,
                    code: t
                } = await Z({
                    poupDialogType: 1
                });
                t === 0 && e && (sessionStorage.removeItem("ws_rechangeGift"), o.value = e[0], D((a = o.value.popupInfo) == null ? void 0 : a.expiredTime))
            },
            x = e => {
                var t;
                o.value = e, D((t = e.popupInfo) == null ? void 0 : t.expiredTime)
            },
            A = async () => {
                const {
                    data: e,
                    code: t
                } = await H();
                t === 0 && (e == null ? void 0 : e.length) > 0 && (k.value = e)
            },
            F = (e = null, t = !1) => {
                var a;
                if (e && (o.value = {
                        id: e.id,
                        imageUrl: e.imageUrl,
                        popupInfo: e
                    }), o.value.popupInfo.rechargeAmount === 0) {
                    const {
                        close: n,
                        open: r
                    } = Y({
                        props: {
                            title: i("t1045"),
                            isShowConfirmBtn: !0,
                            confirmText: i("t582"),
                            hideClose: !0,
                            onConfirm: () => {
                                C(), n(), f()
                            }
                        },
                        slots: {
                            default: () => {
                                var s, d;
                                return w("div", {
                                    class: "recharge-gift-dialog"
                                }, [w("div", {
                                    class: "recharge-gift-dialog-tip"
                                }, i("t1344") + "."), w("div", {
                                    class: "recharge-gift-dialog-icon",
                                    style: {
                                        "--icon": T("icon_gold")
                                    }
                                }, [w("span", {}, te(((d = (s = o.value) == null ? void 0 : s.popupInfo) == null ? void 0 : d.bonusAmount) || 0))])])
                            }
                        }
                    });
                    r(), delete o.value.title;
                    return
                }
                if (((a = o.value) == null ? void 0 : a.popupInfo.buyMode) === 0 || t) {
                    if (o.value.popupInfo.rechargeAmount === 0) {
                        C(), f();
                        return
                    }
                    N.value = !0
                } else c.push({
                    name: "rechargeGift"
                }), f()
            },
            f = () => {
                o.value = {}, U(), u.value = ""
            },
            C = async (e = null) => {
                const t = e && Object.keys(e).length > 0,
                    a = {
                        rechargeCategoryId: h.value.id || 0,
                        activityId: o.value.popupInfo.activityId,
                        rechargeGiftPackId: o.value.popupInfo.rechargeGiftPackId,
                        conditionIndex: o.value.popupInfo.conditionIndex,
                        createTime: o.value.popupInfo.createTime,
                        rechargeAmount: o.value.popupInfo.rechargeAmount,
                        urlInfo: window.location.origin + ",status/rechargeStatus",
                        returnUrl: "https://" + window.location.host + "/#/main"
                    };
                t && (a.customerInfo = e);
                try {
                    const {
                        code: n,
                        data: r
                    } = await K(a);
                    if (n === 0 && r) {
                        if (g.value = !1, (a == null ? void 0 : a.rechargeAmount) === 0) {
                            ae.success({
                                message: i("t637"),
                                zIndex: 2999
                            });
                            return
                        }
                        if (t) {
                            c.push({
                                name: "rechargeDetail",
                                params: {
                                    orderNo: r.orderNo,
                                    createTime: r.createTime
                                }
                            });
                            return
                        }
                        if ([26001, 26e3].includes(r.rechargeChannelId)) return G(r);
                        const {
                            redirectUrl: s
                        } = r;
                        y.isInPack() ? y.openExternalUrl(s) : O(s)
                    }
                } finally {
                    S(), f()
                }
            },
            S = () => {
                N.value = !1
            },
            M = e => {
                h.value = e
            },
            G = e => {
                const {
                    submitUrl: t,
                    rechargeChannelId: a,
                    onGoingOrder: n
                } = e;
                if (t) {
                    const r = ee.parse(t.split("?")[1]);
                    localStorage.setItem("ar_p_t", r == null ? void 0 : r.token), localStorage.setItem("ar_p_lang", r == null ? void 0 : r.lang), c.push({
                        name: "arUpiV2",
                        query: {
                            payTypeId: a
                        }
                    })
                }
                n && n.rechargeChannelId && c.push({
                    name: "arUpiV2",
                    query: {
                        payTypeId: n.rechargeChannelId
                    }
                })
            },
            J = e => {
                E(), e > 0 && new Date(e).getTime() > Date.now() ? (m.value = p(e), v = window.setInterval(() => {
                    m.value = p(e)
                }, 1e3)) : m.value = ""
            },
            $ = () => {
                const e = localStorage.getItem("customerInfo");
                e && (R.value = JSON.parse(e)), g.value = !0
            },
            {
                userNameInput: L,
                accountInput: P
            } = re(i),
            j = W(() => {
                const e = localStorage.getItem("customerInfo");
                let t = {
                    holderName: "",
                    accountNo: ""
                };
                if (e) try {
                    t = JSON.parse(e)
                } catch {}
                const a = !!(t.holderName && t.accountNo);
                return L.props.disabled = a, P.props.disabled = a, [L, P]
            }),
            q = async (e, t) => {
                const a = {
                    holderName: e.holderName,
                    accountNo: e.accountNo
                };
                return !a.holderName || !a.accountNo ? !1 : (localStorage.setItem("customerInfo", JSON.stringify(a)), g.value = !1, await b(t, a), !0)
            },
            b = async (e, t = {}) => {
                const a = t && Object.keys(t).length > 0,
                    n = {
                        rechargeCategoryId: h.value.id || 0,
                        cardType: e,
                        urlInfo: window.location.origin + ",status/rechargeStatus",
                        returnUrl: "https://" + window.location.host + "/#/main",
                        vendorId: 1
                    };
                a && (n.customerInfo = t);
                try {
                    const {
                        code: r,
                        data: s
                    } = await z(n);
                    if (r === 0 && s) {
                        if (a) {
                            g.value = !1, c.push({
                                name: "rechargeDetail",
                                params: {
                                    orderNo: s.orderNo,
                                    createTime: s.createTime
                                }
                            });
                            return
                        }
                        if ([26001, 26e3].includes(s.rechargeChannelId)) return G(s);
                        const {
                            redirectUrl: d
                        } = s;
                        y.isInPack() ? y.openExternalUrl(d || "") : O(d)
                    }
                } finally {
                    S()
                }
            };
        return {
            lastTriggerRecord: o,
            otherExpiredTime: u,
            luckyExpiredTime: m,
            isShowRechangeDialog: N,
            currPayType: h,
            packsList: k,
            localDialog: g,
            formData: R,
            closeRechargeGift: f,
            GetLastTriggerRecordFun: _,
            toGetGiftPack: F,
            handRecharge: C,
            closeShowRechangeDialog: S,
            categoryChange: M,
            getUserRechargeGiftPackListFun: A,
            setLastTriggerRecord: x,
            setCountdown: J,
            handRechargeWeekCard: b,
            customerRecharge: $,
            handleLocalRecharge: q,
            localRechargeFormConfigs: j,
            formatCountdown: p,
            hasCustomerInfo: oe
        }
    };
export {
    ce as u
};