const __vite__mapDeps = (i, m=__vite__mapDeps, d=(m.f || (m.f = ["js/inde-CyMMJlPn.js", "js/index-BgAwOX9Q.js", "css/index-DgM0Jizq.css", "js/currency-DTUBf2lI.js", "css/inde-CJy2Gtfo.css", "js/LuckyPopup-DUzgQZ7D.js", "css/LuckyPopup-DqBQVzlf.css", "js/WeekCardPop-CvF5DyXa.js", "css/WeekCardPop-niSYOTqs.css", "js/TabPopup-CwGdibsH.js", "css/TabPopup-DyTDQYaE.css"]))) => i.map(i => d[i]);
import {b8 as Io, t as ko, u as _o, d as Po, _ as To, a as wo, bG as So, R as Co, r as v, P as bo, C as Ro, bH as Ao, cF as Do, bM as Lo, aZ as i, aU as l, bh as _, aT as B, O as b, ba as g, bb as a, aW as M, c as R, be as P, b0 as r, a$ as J, b1 as h, bi as be, bd as te, bN as xo, bf as No, bj as Oo, bg as Re, b9 as Bo, aC as Eo, aX as U, v as Go, L as zo, p as Ae, a1 as De, A as Fo, cG as $o, cH as Vo, aY as Mo} from "./index-BgAwOX9Q.js";
import {c as Le} from "./currency-DTUBf2lI.js";
import {j as Jo} from "./common-DUTauiI4.js";
import {u as Uo} from "./index-BcjvKTEd.js";
import {u as jo} from "./useRechargeGift-CFRl18Ah.js";
import "./index-Wui3UtXk.js";
import "./use-route-CdVOVz1N.js";
import "./use-placeholder-DpWtpWbS.js";
import "./use-height-D78eGhcW.js";
import "./index-BgifHrBr.js";
const Wo = ["src"]
  , Zo = {
    class: "countdown"
}
  , Yo = {
    class: "expiredTime"
}
  , Ko = ["onClick"]
  , Ho = ["onClick"]
  , Xo = {
    class: "text"
}
  , qo = ["onClick"]
  , Qo = {
    class: "popup_img"
}
  , et = {
    key: 0,
    class: "otherBtn"
}
  , ot = {
    class: "countdown"
}
  , tt = {
    class: "expiredTime"
}
  , st = {
    key: 2,
    class: "popup-checkbox"
}
  , nt = {
    key: 0,
    class: "giftpackAnimat"
}
  , at = {
    class: "regCountdown"
}
  , lt = ["data-number"]
  , ct = ["data-number"]
  , it = {
    key: 0,
    class: "hideCountdown"
}
  , rt = {
    class: "rechargeInfo"
}
  , ut = {
    class: "errTip"
}
  , I = 2e3
  , se = "popup_closed_ids"
  , dt = Io({
    __name: "index",
    setup(pt, {expose: xe}) {
        const Ne = M( () => U( () => import("./inde-CyMMJlPn.js"), __vite__mapDeps([0, 1, 2, 3, 4])))
          , Oe = M( () => U( () => import("./LuckyPopup-DUzgQZ7D.js"), __vite__mapDeps([5, 1, 2, 3, 6])))
          , Be = M( () => U( () => import("./WeekCardPop-CvF5DyXa.js"), __vite__mapDeps([7, 1, 2, 3, 8])))
          , Ee = M( () => U( () => import("./TabPopup-CwGdibsH.js"), __vite__mapDeps([9, 1, 2, 3, 10])))
          , E = ko()
          , {t: ne} = _o()
          , {getARGameAndPlatWalletList: ae} = Po()
          , {on: Ge, off: le} = Do()
          , {toggleDropdown: ze} = To()
          , {goServicePage: Fe, getServiceList: $e, serviceList: ce} = Uo()
          , {hasLogin: ie, customizePopupConfig: re, customizePopupLocation: Ve} = wo()
          , {listenerBroadcast: Me, EventType: j, eventBus: ue} = Ro()
          , {userInfo: W, isShowL3ReceiveCommission: Je} = Fo()
          , {otherExpiredTime: de, lastTriggerRecord: T, closeRechargeGift: Ue, GetLastTriggerRecordFun: pe, toGetGiftPack: Z, isShowRechangeDialog: je, closeShowRechangeDialog: We, handRecharge: fe, currPayType: me, categoryChange: Ze, setLastTriggerRecord: Ye, setCountdown: Ke, localDialog: ve, formData: G, luckyExpiredTime: Y, customerRecharge: He, hasCustomerInfo: Xe, localRechargeFormConfigs: qe} = jo()
          , d = v([])
          , w = v([])
          , K = v([])
          , A = v({})
          , D = v({})
          , Qe = So(document.body)
          , L = v(!1)
          , H = v(!1)
          , X = v(!1)
          , S = v(!1)
          , z = v(!1)
          , k = v([])
          , F = v(!1)
          , ge = R( () => (W == null ? void 0 : W.value.userId) || "guest")
          , q = R( () => {
            var e;
            return !!((e = T.value) != null && e.title)
        }
        )
          , ye = R( () => re.value && !q.value && k.value.length > 0)
          , eo = R( () => !q.value && !ye.value && d.value.length > 0)
          , oo = R( () => d.value.some(e => e.commonPopupType === 4))
          , to = R( () => {
            var e, o;
            return ((o = (e = A.value) == null ? void 0 : e.popupInfo) == null ? void 0 : o.doubleActivityType) === 0
        }
        )
          , so = qe;
        function $() {
            try {
                return JSON.parse(localStorage.getItem(se) || "{}")[ge.value] || {}
            } catch {
                return {}
            }
        }
        function he(e) {
            let o = {};
            try {
                o = JSON.parse(localStorage.getItem(se) || "{}")
            } catch {}
            o[ge.value] = e,
            localStorage.setItem(se, JSON.stringify(o))
        }
        function Ie(e) {
            return $()[e] === new Date().toDateString()
        }
        const no = e => new Promise(o => {
            const n = new Image;
            n.onload = () => o(!0),
            n.onerror = () => o(!1),
            n.src = e
        }
        )
          , ao = e => o => {
            o && (D.value[e] = o)
        }
          , lo = async () => {
            if (Xe.includes(me.value.rechargeType))
                return He();
            await fe(),
            await ae()
        }
          , co = async e => {
            await fe(e)
        }
        ;
        async function ke(e, o=!1, n=!1) {
            if (Ie(e.id) && !n) {
                N();
                return
            }
            if (await no(e.imageUrl),
            (e == null ? void 0 : e.commonPopupType) === 4 && Te(e, 2))
                return N();
            if (!(d.value.length > 0))
                return d.value.push({
                    ...e,
                    showCheckbox: o
                }),
                e.id
        }
        async function x(e, o) {
            V(e),
            e.commonPopupType === 2 && !S.value && await Pe({
                batchNo: e.popupInfo.batchNo
            }, $o),
            e.commonPopupType === 3 && !S.value && await Pe({
                orderNo: e.popupInfo.orderNo
            }, Vo);
            const n = d.value.findIndex(s => s.id === e.id);
            if (n !== -1 && d.value.splice(n, 1),
            H.value) {
                H.value = !1;
                return
            }
            if (e.commonPopupType === 0 && L.value) {
                const s = $();
                s[e.id] = new Date().toDateString(),
                he(s),
                L.value = !1
            }
            o || N()
        }
        async function Q(e) {
            var f, y, t;
            if (V(e),
            e.commonPopupType === 1)
                return Z(e.popupInfo, !0);
            if ([2, 3].includes(e.commonPopupType))
                return x(e);
            const {jumpType: o, jumpLink: n, jumpPage: s} = e.popupInfo;
            let c = !1
              , m = !1;
            if (o === 2 && n)
                Jo(n),
                c = !0,
                m = !0;
            else if (o === 3 && s)
                s === 10 ? (f = ze.value) == null || f.toggleDropdown() : (E.push({
                    name: Go[s].name
                }),
                c = !0),
                m = !0;
            else if (o === 4 && s) {
                (y = ce.value) != null && y.length || await $e(!0);
                const u = (t = ce.value) == null ? void 0 : t.find(p => p.workOrderTypeId === s);
                u ? Fe(u) : E.push({
                    name: "workOrder"
                }),
                c = !0,
                m = !0
            }
            e.isForcePopup && !m || x(e, c)
        }
        function N() {
            for (; w.value.length > 0; ) {
                const e = w.value.shift();
                if (V(e),
                !Ie(e.id)) {
                    ke(e, !0);
                    break
                }
            }
        }
        async function _e(e) {
            if (!e) {
                N();
                return
            }
            const o = K.value.find(n => n.id === e);
            o && (ke(o, !1, !0),
            H.value = !0)
        }
        const ee = async (e=!1) => {
            if (!(X.value || K.value.length > 0))
                try {
                    X.value = !0;
                    const {data: o, code: n} = await zo({
                        poupDialogType: 0,
                        isLogin: e
                    });
                    if (n !== 0)
                        return;
                    let s = io(o);
                    const c = sessionStorage.getItem("popup_data");
                    if (c)
                        try {
                            const f = JSON.parse(c);
                            s = ro(f, o)
                        } catch {}
                    const m = o.filter(f => f.commonPopupType === 4);
                    if (m.length > 0 && Te(m[0], 1),
                    (s == null ? void 0 : s.length) > 0) {
                        K.value = s;
                        const f = $()
                          , y = new Date().toDateString();
                        if (w.value = s.filter(p => f[p.id] !== y && p.commonPopupType !== 1),
                        re.value) {
                            const p = w.value.filter(C => C.commonPopupType === 0);
                            p.length > 0 && (k.value = p,
                            w.value = w.value.filter(C => C.commonPopupType !== 0))
                        }
                        const t = s.find(p => p.commonPopupType === 1)
                          , u = s.filter(p => p.id !== (t == null ? void 0 : t.id) && p.commonPopupType !== 4);
                        sessionStorage.setItem("popup_data", JSON.stringify(u)),
                        t && Ye(t)
                    }
                } finally {
                    X.value = !1
                }
        }
        ;
        function io(e) {
            if (!Array.isArray(e) || e.length === 0)
                return e;
            const o = e.filter(s => s.commonPopupType === 4)
              , n = e.filter(s => s.commonPopupType !== 4);
            return [...o, ...n]
        }
        function ro(e, o) {
            const n = new Map;
            [...e, ...o].filter(c => c.commonPopupType === 1).forEach(c => n.set(c.id, c));
            const s = [...e, ...o].filter(c => c.commonPopupType !== 1);
            return [...Array.from(n.values()), ...s]
        }
        const Pe = async (e, o) => {
            S.value = !0;
            try {
                const {code: n} = await o(e);
                n === 0 && (await new Promise(s => setTimeout(s, 2e3)),
                await ae(),
                await new Promise(s => setTimeout(s, 800)))
            } finally {
                S.value = !1
            }
        }
        ;
        function uo() {
            if (!F.value)
                return;
            const e = $()
              , o = new Date().toDateString();
            k.value.forEach(n => {
                e[n.id] = o
            }
            ),
            he(e)
        }
        function po() {
            k.value.forEach(e => V(e)),
            k.value = [],
            F.value = !1
        }
        function fo() {
            uo(),
            po(),
            N()
        }
        function mo(e) {
            Q(e)
        }
        const V = e => {
            const o = sessionStorage.getItem("popup_data");
            if (o)
                try {
                    const s = JSON.parse(o).filter(c => c.id !== e.id).filter(c => c.commonPopupType !== 4);
                    sessionStorage.setItem("popup_data", JSON.stringify(s))
                } catch {}
        }
          , Te = (e, o) => {
            var s, c, m, f, y, t;
            const n = localStorage.getItem("lucky_data");
            if (n) {
                try {
                    const u = JSON.parse(n);
                    return (s = u == null ? void 0 : u.popupInfo) != null && s.orderNo && u.popupInfo.orderNo === ((c = e == null ? void 0 : e.popupInfo) == null ? void 0 : c.orderNo) ? e.isForcePopup && o === 1 ? (d.value = [e],
                    Ae().then( () => {
                        D.value[0] && D.value[0].changeState()
                    }
                    ),
                    !1) : (A.value = u,
                    z.value = !0,
                    (m = A.value.popupInfo) != null && m.expiredTime && Ke((f = A.value.popupInfo) == null ? void 0 : f.expiredTime),
                    localStorage.setItem("lucky_data", JSON.stringify(e)),
                    !0) : (d.value.push(e),
                    (y = e == null ? void 0 : e.popupInfo) != null && y.orderNo && localStorage.setItem("lucky_data", JSON.stringify(e)),
                    !1)
                } catch {}
                return !1
            } else
                return d.value.push(e),
                (t = e == null ? void 0 : e.popupInfo) != null && t.orderNo && localStorage.setItem("lucky_data", JSON.stringify(e)),
                !1
        }
          , vo = async (e=0) => {
            e !== 1 && (z.value = !1,
            localStorage.removeItem("lucky_data"));
            const o = d.value.findIndex(n => n.commonPopupType === 4);
            o !== -1 && d.value.splice(o, 1)
        }
          , go = e => {
            E.push({
                name: "luckyDetail",
                params: {
                    doubleConfigId: e
                }
            })
        }
          , yo = async () => {
            z.value = !1,
            A.value = {};
            const e = localStorage.getItem("lucky_data");
            if (e)
                try {
                    const o = JSON.parse(e)
                      , {doubleMode: n, doubleConfigId: s} = o.popupInfo;
                    if (n === 2)
                        return E.push({
                            name: "luckyDetail",
                            params: {
                                doubleConfigId: s
                            }
                        });
                    d.value.push(o),
                    Ae().then( () => {
                        D.value[0] && D.value[0].changeState()
                    }
                    )
                } catch {}
        }
          , ho = e => {
            const o = d.value.find(n => n.commonPopupType === 6 && n.popupInfo.cardType === e);
            o && x(o)
        }
        ;
        Co([ () => d.value.length, () => k.value.length], ([e,o]) => {
            Qe.value = e > 0 || o > 0
        }
        ),
        xe({
            openPopup: _e,
            getMessageList: ee
        });
        async function oe() {
            await pe()
        }
        const we = async () => {
            if (!ie())
                return;
            const e = sessionStorage.getItem(De.ActivityPopupShowKey) || "false";
            le("rechangeGift", oe),
            Ge("rechangeGift", oe),
            sessionStorage.getItem("ws_rechangeGift") === "true" && await pe(),
            e === "false" ? (await ee(!0),
            sessionStorage.setItem(De.ActivityPopupShowKey, "true")) : await ee(),
            !oo.value && _e()
        }
          , Se = () => ie() && Je.value && !localStorage.getItem("L3ReceiveCommissionGuideShown");
        return bo(async () => {
            if (Se()) {
                ue.emit(j.ACTIVITY_POPUP_ZERO);
                return
            }
            await we()
        }
        ),
        Me(async e => {
            if (e === j.LOGIN) {
                if (Se()) {
                    ue.emit(j.ACTIVITY_POPUP_ZERO);
                    return
                }
                await we()
            }
        }
        ),
        Ao( () => {
            le("rechangeGift", oe)
        }
        ),
        (e, o) => {
            var m, f, y;
            const n = Bo
              , s = Oo
              , c = Lo("lazy");
            return l(),
            i(_, null, [(l(),
            B(No, {
                to: "body"
            }, [a(je) ? (l(),
            B(a(Ne), {
                key: 0,
                amount: (m = a(T)) == null ? void 0 : m.popupInfo.rechargeAmount,
                currPayType: a(me),
                baseZIndex: I + 1,
                currRechargeMethod: ((f = a(T)) == null ? void 0 : f.popupInfo.supportRechargeCategorys) || [],
                onSelectMethod: a(Ze),
                onGoodsRecharge: lo,
                onClose: a(We)
            }, null, 8, ["amount", "currPayType", "baseZIndex", "currRechargeMethod", "onSelectMethod", "onClose"])) : g("", !0), q.value ? (l(),
            i("div", {
                key: 1,
                class: "popup-mask",
                style: P({
                    zIndex: I
                })
            }, [r("div", {
                class: "popup-content",
                style: P({
                    zIndex: I + 1
                })
            }, [b(J, {
                name: "icon_close03",
                iconClass: "popup-close",
                onClick: a(Ue)
            }, null, 8, ["onClick"]), r("img", {
                src: (y = a(T)) == null ? void 0 : y.imageUrl,
                class: "popup_img",
                onClick: o[0] || (o[0] = t => a(Z)(null, !0))
            }, null, 8, Wo), a(T).popupInfo.rechargeAmount ? (l(),
            i("div", {
                key: 0,
                class: "otherBtn",
                onClick: o[1] || (o[1] = t => a(Z)(null, !0))
            }, h(a(Le)(a(T).popupInfo.rechargeAmount)), 1)) : g("", !0), r("div", Zo, h(a(ne)("t428")), 1), r("div", Yo, h(a(de)), 1)], 4)], 4)) : ye.value ? (l(),
            B(a(Ee), {
                key: 2,
                dontShowAgain: F.value,
                "onUpdate:dontShowAgain": o[2] || (o[2] = t => F.value = t),
                popups: k.value,
                tabPosition: a(Ve),
                zIndex: I,
                onClose: fo,
                onAction: mo
            }, null, 8, ["dontShowAgain", "popups", "tabPosition"])) : eo.value ? (l(),
            i(_, {
                key: 3
            }, [(l(!0),
            i(_, null, be(d.value, (t, u) => {
                var p, C;
                return l(),
                i("div", {
                    key: t.id,
                    class: te(["popup-mask", {
                        hideMask: S.value
                    }]),
                    style: P({
                        zIndex: I + u * 2
                    })
                }, [t.isForcePopup ? (l(),
                i("div", {
                    key: 0,
                    class: "isForcePopup_link",
                    onClick: O => Q(t)
                }, null, 8, Ko)) : g("", !0), t.commonPopupType === 4 ? (l(),
                i("div", {
                    key: 1,
                    class: "lucky-main",
                    style: P({
                        zIndex: I + u * 2 + 1
                    })
                }, [b(a(Oe), {
                    ref_for: !0,
                    ref: ao(u),
                    popupInfo: t.popupInfo,
                    onReceiveReward: vo
                }, null, 8, ["popupInfo"])], 4)) : t.commonPopupType === 5 ? (l(),
                i("div", {
                    key: 2,
                    class: "popup-content lucky-register",
                    onClick: O => {
                        var Ce;
                        return go((Ce = t == null ? void 0 : t.popupInfo) == null ? void 0 : Ce.doubleConfigId)
                    }
                    ,
                    style: P({
                        zIndex: I + u * 2 + 1
                    })
                }, [r("div", Xo, h((p = t == null ? void 0 : t.popupInfo) == null ? void 0 : p.content), 1), o[7] || (o[7] = r("div", {
                    class: "regBox"
                }, null, -1))], 12, Ho)) : t.commonPopupType === 6 ? (l(),
                i("div", {
                    key: 3,
                    class: "popup-content",
                    style: P({
                        zIndex: I + u * 2 + 1
                    })
                }, [t.isForcePopup ? g("", !0) : (l(),
                B(J, {
                    key: 0,
                    name: "icon_close03",
                    iconClass: "popup-close",
                    onClick: O => x(t)
                }, null, 8, ["onClick"])), b(a(Be), {
                    popupInfo: t.popupInfo,
                    onReceiveReward: ho
                }, null, 8, ["popupInfo"])], 4)) : (l(),
                i("div", {
                    key: 4,
                    class: "popup-content",
                    style: P({
                        zIndex: I + 1
                    })
                }, [t.isForcePopup ? g("", !0) : (l(),
                B(J, {
                    key: 0,
                    name: "icon_close04",
                    iconClass: "popup-close popup-close-4",
                    onClick: O => x(t)
                }, null, 8, ["onClick"])), r("div", {
                    onClick: O => Q(t)
                }, [xo(r("img", Qo, null, 512), [[c, t.imageUrl]]), (C = t.popupInfo) != null && C.bonusAmount ? (l(),
                i("div", et, h(a(Le)(t.popupInfo.bonusAmount)), 1)) : g("", !0)], 8, qo), t.commonPopupType === 1 ? (l(),
                i(_, {
                    key: 1
                }, [r("div", ot, h(a(ne)("t428")), 1), r("div", tt, h(a(de)), 1)], 64)) : g("", !0), t.showCheckbox && t.commonPopupType === 0 && !t.isForcePopup ? (l(),
                i("div", st, [b(J, {
                    name: L.value ? "check_icon" : "uncheck_icon",
                    iconClass: "check-svg",
                    onClick: o[3] || (o[3] = O => L.value = !L.value)
                }, null, 8, ["name"]), r("label", null, h(e.$t("t833")), 1)])) : g("", !0)], 4))], 6)
            }
            ), 128)), S.value ? (l(),
            i("div", nt)) : g("", !0)], 64)) : g("", !0), z.value ? (l(),
            i("div", {
                key: 4,
                onClick: yo,
                class: "hideRightBox"
            }, [to.value ? (l(),
            i(_, {
                key: 0
            }, [o[9] || (o[9] = r("div", {
                class: "hideRegBox"
            }, null, -1)), r("div", at, [(l(!0),
            i(_, null, be(a(Y) || "00:00:00", t => (l(),
            i("span", {
                class: te({
                    digitBg: t !== ":"
                }),
                "data-number": t
            }, [r("i", {
                class: te({
                    digit: t !== ":"
                }),
                "data-number": t
            }, null, 10, ct)], 10, lt))), 256)), o[8] || (o[8] = r("div", {
                class: "cutTopBg"
            }, null, -1))])], 64)) : (l(),
            i(_, {
                key: 1
            }, [o[10] || (o[10] = r("div", {
                class: "hideBoxBg"
            }, null, -1)), a(Y) ? (l(),
            i("div", it, h(a(Y)), 1)) : g("", !0)], 64))])) : g("", !0)])), b(s, {
                modelValue: a(ve),
                title: e.$t("t203"),
                zIndex: 10009,
                onClose: o[6] || (o[6] = t => ve.value = !1)
            }, {
                default: Re( () => [r("div", rt, [b(n, {
                    ref: "formRef",
                    modelValue: a(G),
                    "onUpdate:modelValue": o[4] || (o[4] = t => Eo(G) ? G.value = t : null),
                    configs: a(so),
                    onSubmit: o[5] || (o[5] = t => co(a(G)))
                }, {
                    formfooter: Re( () => [r("div", ut, h(e.$t("t817")), 1)]),
                    _: 1
                }, 8, ["modelValue", "configs"])])]),
                _: 1
            }, 8, ["modelValue", "title"])], 64)
        }
    }
})
  , Tt = Mo(dt, [["__scopeId", "data-v-26485d02"]]);
export {Tt as default};
