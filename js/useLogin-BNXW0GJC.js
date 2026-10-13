import {
    t as Ye,
    a as je,
    _ as ze,
    $ as Qe,
    u as Xe,
    Y as Ze,
    r as i,
    a0 as Re,
    c as se,
    h as ea,
    n as T,
    a1 as L,
    s as d,
    a2 as aa,
    A as ta,
    a3 as ne,
    a4 as oe,
    a5 as ie,
    a6 as la,
    a7 as sa,
    a8 as na,
    a9 as re,
    C as oa,
    aa as ia,
    ab as ra,
    ac as ua,
    ad as ca,
    ae as va
} from "./index-BgAwOX9Q.js";
const {
    trackEvent: ga
} = ia(), G = Ze({
    isEmail: !0
}), U = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var ue = (c => (c[c.Password = 0] = "Password", c[c.OTP = 1] = "OTP", c))(ue || {});
const ya = c => {
    const ce = typeof c == "object" && c !== null && !("value" in c) ? c : {
            captchaRef: c
        },
        {
            captchaRef: s,
            phoneInputRef: M,
            initialMode: ve = 0,
            onLoginSuccess: V,
            isOnlyLogin: B
        } = ce,
        _ = Ye(),
        {
            set_token: ge,
            browserId: de,
            getTransferConfig: fe,
            turnstileSiteKey: me,
            isOpenLoginTurnstileVerify: ye
        } = je(),
        {
            getUserInfo: x,
            setCanBet: Ie
        } = ta(),
        {
            emitFBToken: pe
        } = oa(),
        {
            getPackInfo: H
        } = ze(),
        {
            guestLogin: we
        } = Qe(),
        {
            onAnalyticsTrigger: W
        } = ea(),
        {
            getFbp: Pe,
            getFbc: Te,
            getTtcsid: Ee
        } = ua(),
        {
            t: y,
            te: he
        } = Xe(),
        N = (e, t) => {
            const l = `m${e}`;
            return e != null && he(l) ? y(l) : t
        },
        I = i(ve),
        f = i(!1),
        q = i(!1),
        u = i(""),
        E = i(!1),
        k = localStorage.getItem("loginType") || "Mobile";
    G.isEmail = k !== "Mobile";
    const a = i({
            loginType: k,
            userName: k === "Mobile" ? localStorage.getItem("PUM") : localStorage.getItem("EUM") || "",
            password: k === "Mobile" ? localStorage.getItem("PPWD") : localStorage.getItem("EPWD") || "",
            verifyCode: void 0,
            captchaId: void 0,
            googleCode: void 0,
            track: void 0
        }),
        g = i(localStorage.getItem("isRememberPwd") === "1"),
        h = i(""),
        n = i(""),
        p = i(""),
        S = i(""),
        D = i({
            Area: ""
        }),
        O = i(!1),
        J = i(!1),
        K = i(!1),
        Y = i(!1),
        Se = se(() => G.isEmail),
        {
            loadingText: be,
            getVerifyCode: j,
            disabled: Ce,
            time: Ne
        } = Re(va),
        ke = () => {
            I.value = I.value === 0 ? 1 : 0, n.value = "", p.value = "", S.value = "", u.value = ""
        },
        Ae = e => {
            I.value = e, n.value = "", p.value = "", S.value = "", u.value = ""
        },
        Le = e => {
            h.value = e, a.value.userName = ""
        },
        b = () => `${h.value}${a.value.userName}`.trim(),
        Me = () => a.value.loginType === "Email" ? `${a.value.userName||""}`.trim() : b(),
        De = async () => {
            let e = [];
            const t = ne(),
                l = t == null ? void 0 : t.eventConfigId;
            !!t && l != null && l !== "" && l !== 0 && l !== "0" && (e = [{
                eventConfigId: t.eventConfigId,
                eventType: (t == null ? void 0 : t.analyticsEventType) || "",
                eventIdentityInfo: JSON.stringify({
                    PixelId: t.eventToken || "",
                    Fbp: await Pe() || "",
                    Fbc: Te() || "",
                    Ttcsid: Ee() || ""
                })
            }]);
            const o = await ca();
            return o != null && o.length && (e = o), {
                eventIdentity: e,
                eventInfo: t
            }
        },
        z = async () => {
            var l, r, o;
            const {
                eventIdentity: e,
                eventInfo: t
            } = await De();
            return {
                deviceId: ((l = T) == null ? void 0 : l.getDeviceId()) || ((r = ie.readEventConfigFromUrl()) == null ? void 0 : r.deviceId) || "",
                browserId: de.value || "",
                packageName: ((o = T) == null ? void 0 : o.getPackId()) || (t == null ? void 0 : t.channelPackageName) || "",
                eventIdentity: re(e).length ? re(e) : void 0
            }
        },
        Fe = (e, t) => {
            e == "loginType" && (G.isEmail = t !== "Mobile", t == "Mobile" ? (a.value.userName = g.value && localStorage.getItem("PUM") || "", a.value.password = g.value && localStorage.getItem("PPWD") || "") : (a.value.userName = g.value && localStorage.getItem("EUM") || "", a.value.password = g.value && localStorage.getItem("EPWD") || ""), n.value = "", p.value = "", u.value = ""), a.value[e] = t
        },
        m = () => {
            a.value.captchaId = void 0, a.value.track = void 0, u.value = ""
        },
        Q = se(() => I.value !== 0 || !ye.value ? !1 : !!me.value),
        $e = async e => {
            if (!e) {
                d("Verification failed, please try again");
                return
            }
            u.value = e, q.value = !1, await F()
        },
        Ge = e => {
            u.value = e
        },
        X = async e => {
            var t;
            sessionStorage.setItem(L.ActivityPopupShowKey, "false"), m(), ge(e), Ie(e.canBet), e.packageTransferConfig && fe(e.packageTransferConfig, !0), pe(), await ga(ra.Login), (t = s == null ? void 0 : s.value) == null || t.setShowHiden(!1), await x(!0), await H(), W("login_success"), V && await V(e), await _.replace("/")
        },
        Z = async () => {
            var e, t;
            if (!ae()) return !1;
            if (Q.value && !u.value) return d("Please complete the verification first"), !1;
            f.value = !0;
            try {
                const l = await z(),
                    r = a.value.loginType === "Email" ? "Email" : "Mobile",
                    o = { ...a.value,
                        loginType: r,
                        userName: r === "Email" ? `${a.value.userName||""}`.trim() : b(),
                        ...u.value ? {
                            turnstileToken: u.value
                        } : {},
                        ...l
                    };
                delete o.verifyCode;
                const {
                    msgCode: v,
                    code: w,
                    data: C,
                    msg: A
                } = await na(o);
                return v === 143 || v === 5008 ? (a.value.captchaId = void 0, a.value.track = void 0, E.value = !0, await ee(), !1) : v === 5001 ? (d(y("m5001")), (e = s == null ? void 0 : s.value) == null || e.setShowHiden(!1), m(), E.value = !1, !1) : w === 0 ? (xe(), le(), E.value = !1, await X(C), !0) : (u.value = "", d(N(v, A)), He(v), (t = s == null ? void 0 : s.value) == null || t.setShowHiden(!1), m(), E.value = !1, !1)
            } catch {
                return !1
            } finally {
                f.value = !1
            }
        },
        R = async () => {
            var e, t, l, r, o, v;
            if (!te()) return !1;
            f.value = !0;
            try {
                const w = await z(),
                    C = ne(),
                    A = a.value.loginType === "Email" ? "Email" : "Mobile",
                    qe = {
                        userName: A === "Email" ? `${a.value.userName||""}`.trim() : b(),
                        verifyCode: a.value.verifyCode,
                        registerDevice: ((e = T) == null ? void 0 : e.getDeviceId()) || ((t = ie.readEventConfigFromUrl()) == null ? void 0 : t.deviceId) || "",
                        registerFingerprint: w.browserId,
                        inviteCode: localStorage.getItem(oe.INVITE_CODE) || "",
                        packageName: ((l = T) == null ? void 0 : l.getPackId()) || (C == null ? void 0 : C.channelPackageName) || "",
                        ...((r = w.eventIdentity) == null ? void 0 : r.length) && {
                            eventIdentity: w.eventIdentity
                        },
                        ...B && {
                            isOnlyLogin: B
                        }
                    },
                    Oe = A === "Email" ? la : sa,
                    {
                        code: Je,
                        data: Ke,
                        msgCode: P,
                        msg: $
                    } = await Oe(qe);
                return P === 143 || P === 5008 ? (m(), d(N(P, $)), !1) : P === 5001 ? (d(N(P, $)), (o = s == null ? void 0 : s.value) == null || o.setShowHiden(!1), m(), !1) : Je === 0 ? (await X(Ke), !0) : (u.value = "", d(N(P, $)), (v = s == null ? void 0 : s.value) == null || v.setShowHiden(!1), m(), !1)
            } catch {
                return !1
            } finally {
                f.value = !1
            }
        },
        F = async e => (e && (a.value.track = e), I.value === 1 ? R() : Z()),
        Ue = async e => (a.value.track = e, F(e)),
        Ve = async e => {
            if ((a.value.loginType === "Email" ? "Email" : "Mobile") === "Mobile") {
                if (!(e || (() => {
                        var v;
                        const o = (v = M == null ? void 0 : M.value) == null ? void 0 : v.validPhone;
                        return typeof o == "function" ? !!o(a.value.userName) : !0
                    }))()) {
                    n.value = y("t783");
                    return
                }
                if (!a.value.userName) {
                    n.value = "Please enter your phone number";
                    return
                }
                await j({
                    verifyCodeType: 1,
                    phoneOrEmail: b(),
                    codeType: 18
                });
                return
            }
            const l = `${a.value.userName||""}`.trim();
            if (!l) {
                n.value = "Please enter the email";
                return
            }
            if (!U.test(l)) {
                n.value = "Please enter a valid email.";
                return
            }
            await j({
                verifyCodeType: 2,
                phoneOrEmail: l,
                codeType: 18
            })
        },
        Be = async () => {
            f.value = !0;
            try {
                return await we() ? (await H(), await x(!0), await _.replace({
                    name: "home"
                }), !0) : (localStorage.setItem(L.AutoLoginFailed, "true"), d("Guest login failed, please login with your account."), !1)
            } catch {
                return localStorage.setItem(L.AutoLoginFailed, "true"), d("Guest login failed, please login with your account."), !1
            } finally {
                f.value = !1
            }
        },
        _e = () => (T.isEmbeddedApk() || T.isFullapk()) && !localStorage.getItem(L.AutoLoginFailed),
        xe = () => {
            if (localStorage.setItem("loginType", g.value ? a.value.loginType : ""), a.value.loginType == "Mobile") {
                const e = localStorage.getItem("quhao") || "";
                localStorage.setItem("PUM", g.value ? a.value.userName.replace(e, "") : ""), localStorage.setItem("PPWD", g.value ? a.value.password : "")
            } else localStorage.setItem("EUM", g.value ? a.value.userName : ""), localStorage.setItem("EPWD", g.value ? a.value.password : "")
        },
        He = e => {
            [5004, 5002].includes(e) && (K.value = !0), [5003, 5009].includes(e) && (J.value = !0), e === 5016 && (O.value = !0), e === 5001 && (Y.value = !0)
        },
        ee = async () => {
            var l, r;
            (l = s == null ? void 0 : s.value) == null || l.startRequestGenerate();
            const {
                data: e,
                code: t
            } = await aa();
            t === 0 && (a.value.captchaId = e.captchaId, (r = s == null ? void 0 : s.value) == null || r.endRequestGenerate(e.backgroundImage, e.sliderImage))
        },
        ae = () => {
            var e;
            if (n.value = "", p.value = "", a.value.loginType === "Email") {
                const t = `${a.value.userName||""}`.trim();
                if (!t) return n.value = "Please enter the email", !1;
                if (!U.test(t)) return n.value = "Please enter a valid email.", !1
            } else if (!((e = a.value.userName) != null && e.toString().replace(D.value.Area, "").trim())) return n.value = y("t783"), !1;
            return a.value.password ? !0 : (p.value = "Please enter the password.", !1)
        },
        te = () => {
            var e;
            if (n.value = "", S.value = "", a.value.loginType === "Email") {
                const t = `${a.value.userName||""}`.trim();
                if (!t) return n.value = "Please enter the email", !1;
                if (!U.test(t)) return n.value = "Please enter a valid email.", !1
            } else if (!((e = a.value.userName) != null && e.toString().replace(D.value.Area, "").trim())) return n.value = y("t783"), !1;
            return a.value.verifyCode ? !0 : (S.value = y("t1123"), !1)
        },
        We = e => {
            D.value = e
        },
        le = () => {
            a.value.captchaId = void 0, a.value.googleCode = void 0, a.value.track = void 0, u.value = ""
        };
    return {
        loginForm: a,
        loginMode: I,
        loading: f,
        isEmail: Se,
        isRememberPwd: g,
        phoneArea: h,
        loginAE: n,
        loginPE: p,
        verifyCodeError: S,
        googleDialog: O,
        banDialog: J,
        lockDialog: K,
        apDialog: Y,
        showTurnstile: q,
        needTurnstileVerify: Q,
        isAwaitingCaptcha: E,
        verifyCodeLoadingText: be,
        verifyCodeDisabled: Ce,
        verifyCodeTime: Ne,
        setForm: Fe,
        setPhoneArea: Le,
        setLoginMode: Ae,
        toggleLoginMode: ke,
        changeArea: We,
        closeGoogle: le,
        reset: m,
        initLastPhone: () => {
            const e = localStorage.getItem(oe.LASTPHONE);
            if (e && h.value) {
                const t = new RegExp(`^${h.value}`);
                a.value.userName = Number(e.replace(t, ""))
            }
        },
        login: Z,
        mobileLogin: R,
        handleSubmit: F,
        captcheLogin: Ue,
        handleGuestLogin: Be,
        verify: ae,
        verifyOTP: te,
        sendOTPCode: Ve,
        captcheRefresh: ee,
        handleTurnstileVerify: $e,
        setTurnstileToken: Ge,
        isShowGuestLogin: _e,
        getFullPhoneNumber: b,
        getLoginAccount: Me,
        triggerViewAuthPage: () => {
            W("view_auth_page", {
                page_type: "login"
            })
        },
        LoginMode: ue
    }
};
export {
    ue as L, ya as u
};