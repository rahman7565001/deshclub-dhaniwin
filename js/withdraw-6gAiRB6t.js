import {u as de, a as z, d as me, r as l, c as f, e as ve, n as pe, f as fe, h as we, i as he, j as H} from "./index-BgAwOX9Q.js";
import {c as W} from "./currency-DTUBf2lI.js";
import {g as _, a as ge, w as ye, b as Ae, c as Ne, d as We, e as _e, f as xe} from "./index-BgifHrBr.js";
const Te = () => {
    const {tenantCurrency: c} = z();
    return c.value === "INR"
}
  , be = {
    Wait: "t126",
    Pass: "t127",
    Reject: "t128",
    Submitted: "t129"
}
  , qe = (c={}) => {
    const {t: e} = de()
      , G = fe()
      , {h5PhoneAreaCodeDictionary: J} = z()
      , {onAnalyticsTrigger: V} = we()
      , {balance: A} = me()
      , K = l(!1)
      , X = a => {
        const t = [];
        for (const v of a) {
            const u = v.Len.split("-");
            for (const ce of u)
                t.push(Number(ce))
        }
        const n = Math.min(...t)
          , o = Math.max(...t);
        return {
            min: n,
            max: o
        }
    }
      , Y = () => {
        const a = [{
            title: "",
            modelKey: "bankCode",
            rules: [{
                required: !0,
                message: e("t145")
            }],
            props: {
                placeholder: e("t69"),
                iconName: "icon_bank_01",
                searchApi: _,
                params: {
                    withdrawType: "BankCard"
                }
            }
        }, {
            title: "",
            modelKey: "holderName",
            rules: [{
                required: !0,
                message: e("t146")
            }],
            props: {
                placeholder: e("t72"),
                iconName: "icon_user"
            },
            OnInput: t => {
                const n = /[0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：""【】、；''，。、\f\n\r\t\v\d]/g;
                return t.target.value.replace(n, "").replace(/ {2,}/g, " ")
            }
        }, {
            title: "",
            modelKey: "accountNo",
            rules: [{
                validator: t => {
                    const n = /^[0-9]{6,25}$/;
                    return t ? n.test(t) ? !0 : new Error(e("t147")) : new Error(e("t146"))
                }
                ,
                message: e("t146")
            }],
            props: {
                placeholder: e("t73"),
                iconName: "icon_Bank_Account"
            }
        }, {
            title: "",
            modelKey: "mobileNo",
            rules: [{
                validator: t => {
                    const {min: n, max: o} = X(J.value)
                      , v = new RegExp(`^[0-9]{${n},${o}}$`);
                    return t ? v.test(t) ? !0 : new Error(e("t147")) : new Error(e("t146"))
                }
                ,
                message: e("t146")
            }],
            props: {
                placeholder: e("t74"),
                iconName: "icon_phone"
            }
        }];
        return Te() && a.push({
            title: "",
            modelKey: "ifscCode",
            rules: [{
                validator: t => {
                    const n = /^[A-Z]{4}0[A-Z0-9]{6}$/;
                    return t ? n.test(t) ? !0 : new Error(e("t147")) : new Error(e("t146"))
                }
                ,
                message: e("t146")
            }],
            props: {
                placeholder: e("t75"),
                iconName: "icon_Verification_Code"
            }
        }),
        a
    }
      , $ = {
        BankCard: {
            title: e("t70"),
            list_title: e("t95"),
            tip: e("t71"),
            get list() {
                return Y()
            }
        },
        EWallet: {
            title: e("t141"),
            list_title: e("t142"),
            tip: e("t71"),
            list: [{
                title: "",
                modelKey: "bankCode",
                rules: [{
                    required: !0,
                    message: e("t145")
                }],
                props: {
                    placeholder: e("t542"),
                    iconName: "icon_bank_01",
                    searchApi: _,
                    params: {
                        withdrawType: "EWallet"
                    }
                }
            }, {
                title: "",
                modelKey: "holderName",
                rules: [{
                    required: !0,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t72"),
                    iconName: "icon_user"
                },
                OnInput: a => {
                    const t = /[0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\f\n\r\t\v\d]/g;
                    return a.target.value.replace(t, "").replace(/ {2,}/g, " ")
                }
            }, {
                title: "",
                modelKey: "accountNo",
                rules: [{
                    validator: a => {
                        const t = /^[0-9]{8,12}$/;
                        return a ? t.test(a) ? !0 : new Error(e("t147")) : new Error(e("t146"))
                    }
                    ,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t73"),
                    iconName: "icon_Bank_Account"
                }
            }]
        },
        USDT: {
            title: e("t143"),
            list_title: e("t144"),
            tip: e("t71"),
            list: [{
                title: "",
                modelKey: "networkType",
                rules: [{
                    required: !0,
                    message: e("t145")
                }],
                props: {
                    placeholder: e("t69"),
                    iconName: "icon_network",
                    searchApi: _,
                    params: {
                        withdrawType: "USDT"
                    },
                    isdefaule: !0
                }
            }, {
                title: "",
                modelKey: "usdtAddress",
                rules: [{
                    validator: a => {
                        const t = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
                        return a ? t.test(a) ? !0 : new Error(e("t147")) : new Error(e("t146"))
                    }
                    ,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t148"),
                    iconName: "icon_address"
                }
            }, {
                title: "",
                modelKey: "aliasAddress",
                rules: [{
                    required: !0,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t149"),
                    iconName: "icon_remark"
                }
            }]
        },
        PIX: {
            title: e("t153"),
            list_title: e("t154"),
            tip: e("t71"),
            list: [{
                title: "",
                modelKey: "holderName",
                rules: [{
                    required: !0,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t72"),
                    iconName: "icon_user"
                },
                OnInput: a => {
                    const t = /[0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\f\n\r\t\v\d]/g;
                    return a.target.value.replace(t, "").replace(/ {2,}/g, " ")
                }
            }, {
                title: "",
                modelKey: "cpf",
                rules: [{
                    required: !0,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t152"),
                    iconName: "icon_information"
                }
            }, {
                title: "",
                modelKey: "pixWalletType",
                rules: [{
                    required: !0,
                    message: e("t145")
                }],
                props: {
                    placeholder: e("t72"),
                    iconName: "icon_Account_General",
                    searchApi: _,
                    params: {
                        withdrawType: "PIX"
                    },
                    isdefaule: !0
                }
            }, {
                title: "",
                modelKey: "accountNo",
                rules: [{
                    validator: (a, t) => {
                        const n = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
                          , o = /^55[0-9]{11}$/;
                        return a ? (t == null ? void 0 : t.pixWalletType) == "Email" && !n.test(a) ? new Error(e("t147")) : (t == null ? void 0 : t.pixWalletType) == "Phone" && !o.test(a) ? new Error(e("t147")) : (t == null ? void 0 : t.pixWalletType) == "CPF" && t.cpf !== a ? new Error(e("t147")) : !0 : new Error(e("t146"))
                    }
                    ,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t155"),
                    iconName: "icon_address"
                }
            }]
        },
        UPI: {
            title: e("t156"),
            list_title: e("t157"),
            tip: e("t71"),
            list: [{
                title: "",
                modelKey: "holderName",
                rules: [{
                    required: !0,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t72"),
                    iconName: "icon_user"
                },
                OnInput: a => {
                    const t = /[0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\f\n\r\t\v\d]/g;
                    return a.target.value.replace(t, "").replace(/ {2,}/g, " ")
                }
            }, {
                title: "",
                modelKey: "accountNo",
                rules: [{
                    validator: a => a ? !0 : new Error(e("t146")),
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t158"),
                    iconName: "icon_Bank_Account"
                }
            }]
        },
        WavePay: {
            title: e("t493"),
            list_title: e("t157"),
            tip: e("t71"),
            list: [{
                title: "",
                modelKey: "holderName",
                props: {
                    placeholder: e("t72"),
                    disabled: !0,
                    modelValue: "Wave Pay",
                    iconName: "icon_bank_01"
                },
                OnInput: a => {
                    const t = /[0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\f\n\r\t\v\d]/g;
                    return a.target.value.replace(t, "").replace(/ {2,}/g, " ")
                }
            }, {
                title: "",
                modelKey: "holderName",
                rules: [{
                    required: !0,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t72"),
                    iconName: "icon_user"
                },
                OnInput: a => {
                    const t = /[0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\f\n\r\t\v\d]/g;
                    return a.target.value.replace(t, "").replace(/ {2,}/g, " ")
                }
            }, {
                title: "",
                modelKey: "accountNo",
                rules: [{
                    required: !0,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t74"),
                    iconName: "icon_phone"
                }
            }]
        },
        ARPay: {
            title: e("t594"),
            list_title: e("t595"),
            tip: e("t596"),
            list: []
        },
        EASYPAISA: {
            title: e("t1355"),
            list_title: e("t1357"),
            tip: e("t71"),
            list: [{
                title: "",
                modelKey: "holderName",
                rules: [{
                    required: !0,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t72"),
                    iconName: "icon_user"
                },
                OnInput: a => {
                    const t = /[0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\f\n\r\t\v\d]/g;
                    return a.target.value.replace(t, "").replace(/ {2,}/g, " ")
                }
            }, {
                title: "",
                modelKey: "accountNo",
                rules: [{
                    required: !0,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t118"),
                    iconName: "icon_phone"
                }
            }]
        },
        JAZZCASH: {
            title: e("t1356"),
            list_title: e("t1358"),
            tip: e("t71"),
            list: [{
                title: "",
                modelKey: "holderName",
                rules: [{
                    required: !0,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t72"),
                    iconName: "icon_user"
                },
                OnInput: a => {
                    const t = /[0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\f\n\r\t\v\d]/g;
                    return a.target.value.replace(t, "").replace(/ {2,}/g, " ")
                }
            }, {
                title: "",
                modelKey: "accountNo",
                rules: [{
                    required: !0,
                    message: e("t146")
                }],
                props: {
                    placeholder: e("t118"),
                    iconName: "icon_phone"
                }
            }]
        }
    }
      , p = l([])
      , d = l("")
      , r = f( () => p.value.find(a => a.withdrawType == d.value) || {})
      , S = l("")
      , b = l(!1)
      , N = l("")
      , h = l([])
      , m = l()
      , s = l("")
      , w = l(0)
      , q = l(!1)
      , x = l(!1)
      , R = l(!0)
      , i = l("")
      , k = l(!1)
      , L = l([])
      , U = l(0)
      , g = l(0)
      , y = l(0)
      , B = l([])
      , M = l(!1)
      , O = l(!0)
      , T = l(!1)
      , D = l(null)
      , F = l(0)
      , I = l(!1)
      , Q = f( () => {
        let a = "";
        return r.value.feePercent && (a += `${r.value.feePercent}%`),
        r.value.fee && (a && (a += " + "),
        a += r.value.fee),
        a
    }
    )
      , j = f( () => {
        if (!r.value.fee || !s.value)
            return 0;
        if (U.value !== 0)
            return s.value;
        let a = s.value - Math.floor(s.value * r.value.fee / 100);
        return r.value.feeType == 1 && (a = s.value - r.value.fee),
        a >= 0 ? a : 0
    }
    )
      , ee = f( () => d.value ? $[d.value] : [])
      , Z = f( () => r.value.maxAmount <= y.value || y.value === -1 ? r.value.maxAmount : y.value)
      , te = f( () => !s.value || Number(s.value) <= 0 || Number(s.value) > A.value ? !1 : !m.value && d.value != "ARPay" ? (i.value = e("t69"),
    !1) : d.value === "ARPay" && !D.value ? !1 : g.value === 0 ? (i.value = e("t539"),
    !1) : y.value === 0 ? (i.value = e("t540"),
    !1) : w.value > 0 ? (i.value = e("t100", [W(w.value)]),
    !1) : r.value.allowStartTime && r.value.allowEndTime && !H(r.value.allowStartTime, r.value.allowEndTime) ? (i.value = e("t101", [`${r.value.allowStartTime}-${r.value.allowEndTime}`]),
    !1) : r.value.maxAmount && r.value.minAmount && (s.value > r.value.maxAmount || s.value < r.value.minAmount) ? (i.value = e("t103", [`${W(r.value.minAmount)}-${W(Z.value)}`]),
    !1) : (i.value = "",
    !0))
      , ae = f( () => g.value === 0 ? (i.value = e("t539"),
    !1) : y.value === 0 ? (i.value = e("t540"),
    !1) : w.value > 0 ? (i.value = e("t100", [W(w.value)]),
    !1) : r.value.allowStartTime && r.value.allowEndTime && !H(r.value.allowStartTime, r.value.allowEndTime) ? (i.value = e("t101", [`${r.value.allowStartTime}-${r.value.allowEndTime}`]),
    !1) : !0)
      , re = f( () => ae.value ? A.value : 0)
      , le = f( () => g.value < 0 ? r.value.maxWithdrawTimes : g.value < r.value.maxWithdrawTimes ? g.value : r.value.maxWithdrawTimes)
      , E = async (a=!0) => {
        const {data: t, code: n} = await We();
        if (n === 0) {
            p.value = t.withdrawCategoryList.sort( (v, u) => u.sort - v.sort) || [],
            N.value = t.realName ?? "",
            w.value = t.amountCoding || 0,
            x.value = t.hasWithdrawPassword || !1,
            R.value = t.isNeedWithdrawPassword !== !1,
            U.value = t.userTodayWithdrawFreeCount || 0,
            g.value = t.userTodayWithdrawCount || 0,
            y.value = t.userTodayWithdrawAmount || 0,
            B.value = (t.fixedWithdrawAmountList || []).filter(Boolean).map(String),
            O.value = t.isWithdrawAmountAllowInput || !1,
            M.value = t.isWithdrawAmountFixed || !1,
            F.value = t.pendingCompensationAmount || 0;
            let o = p.value.find(v => v.withdrawType == localStorage.getItem("wt"));
            if (!o && p.value.length)
                o = p.value[0];
            else if (!o && !p.value.length)
                return;
            a && await C((o == null ? void 0 : o.withdrawType) || p.value[0].withdrawType)
        }
    }
      , C = async (a, t=!1) => {
        var v;
        if (c.show && c.show(),
        a == "ARPay") {
            const u = await Ae();
            if (u.code !== 0 || !u.data) {
                c.hide && c.hide();
                return
            }
            u.data.walletAddress || (T.value = !0),
            D.value = u.data.walletAddress || null
        }
        if (!$[a])
            return c.hide && c.hide();
        s.value = "",
        d.value = a,
        ne(a),
        S.value = (v = p.value.find(u => u.withdrawType == a)) == null ? void 0 : v.iconUrl;
        const {data: n, code: o} = await Ne({
            withdrawType: a
        });
        o === 0 && (h.value = n,
        localStorage.setItem("wt", a),
        h.value.length ? !m.value || t ? m.value = h.value[0] : h.value.find(u => u.walletId == m.value.walletId) || (m.value = h.value[0]) : m.value = null),
        c.hide && c.hide()
    }
      , ne = async a => {
        const t = {
            withdrawType: a,
            pageSize: 3,
            pageNo: 1
        }
          , {data: n, code: o} = await xe(t);
        o == 0 && (L.value = n.list)
    }
      , oe = async a => {
        const {data: t, code: n, msg: o} = await _e(a);
        return n === 0 && (N.value || (N.value = a.holderName),
        b.value = !1,
        C(d.value)),
        {
            code: n,
            data: t,
            msg: o
        }
    }
      , se = a => {
        m.value = a,
        k.value = !1
    }
      , P = async a => {
        var o;
        if (!m.value && d.value != "ARPay")
            return G.error(e("t69"));
        const t = {
            amount: Number(s.value.trim()),
            walletId: (o = m.value) == null ? void 0 : o.walletId,
            withdrawCategoryId: r.value.id,
            withdrawType: d.value,
            withdrawPassword: a
        }
          , {code: n} = await ye(t);
        n == 0 && (K.value = !0,
        s.value = "",
        E(),
        q.value = !1,
        V("withdraw_initiated", {
            amount: t.amount,
            method: t.withdrawType
        }))
    }
      , ie = async a => x.value ? P(a) : ue(a)
      , ue = async a => {
        const {code: t} = await he({
            withdrawPassword: a
        });
        t == 0 && P(a)
    }
    ;
    return {
        addCDialog: b,
        activeIcon: S,
        activeType: d,
        activeTypeInfo: r,
        activeWallet: m,
        amountCoding: w,
        balance: A,
        canSubmit: te,
        withdrawableAmount: re,
        categoryList: p,
        hasWithdrawPassword: x,
        isNeedWithdrawPassword: R,
        historyList: L,
        listDialog: k,
        realName: N,
        realWithdrawalAmount: j,
        SelectedAddForm: ee,
        setPwdDialog: q,
        unSubmitTip: i,
        walletList: h,
        WithdrawalAmount: s,
        maxAmount: Z,
        withdrawTimes: le,
        fixedWithdrawAmountList: B,
        isWithdrawAmountFixed: M,
        isWithdrawAmountAllowInput: O,
        showArbActiveDialog: T,
        addWalletAccount: oe,
        commitPwd: ie,
        getBasicInfo: E,
        getWalletInfo: C,
        setActiveWallet: se,
        setAll: () => {
            w.value || (s.value = String(A.value > r.value.maxAmount ? Math.floor(r.value.maxAmount) : Math.floor(A.value)))
        }
        ,
        subWithdraw: P,
        addWalletAccountArb: async () => {
            const {code: a, data: t, msg: n} = await ge({
                returnUrl: window.location.origin + "/wallet/withdraw"
            });
            a === 0 && (t.walletActivationPageUrl && pe.openExternalUrl(t.walletActivationPageUrl),
            T.value = !1)
        }
        ,
        pendingCompensationAmount: F,
        openReceived: async a => {
            const {code: t} = await ve({
                withdrawNumber: a || ""
            });
            t === 0 && (I.value = !0)
        }
        ,
        showReceived: I,
        handleClose: async () => {
            I.value = !1,
            E()
        }
        ,
        renderFeeText: Q,
        showSuccess: K
    }
}
;
export {qe as u, be as w};
