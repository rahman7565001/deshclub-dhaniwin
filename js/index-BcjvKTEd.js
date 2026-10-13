import {b8 as Oe, bA as Te, bm as Pe, r as s, bD as Vt, O as v, ar as Be, an as Y, cv as Zt, bE as Qt, c as be, d8 as Xt, eO as Ke, cy as Xe, cI as Jt, ef as eo, bx as to, cS as oo, Y as $, eB as ao, eg as so, bo as no, bv as ro, bp as co, ct as lo, eu as io, eP as uo, cM as fo, eF as po, eG as go, bt as mo, u as vo, t as yo, at as ho, A as wo, ch as Co, f as To, ae as bo, cW as ko, cX as Ce, h as Io, ag as Ye, ai as Ve, eQ as Oo, a4 as Po, D as y} from "./index-BgAwOX9Q.js";
import {B as ke} from "./index-Wui3UtXk.js";
import {u as Bo} from "./use-placeholder-DpWtpWbS.js";
import {u as So, r as xo} from "./use-route-CdVOVz1N.js";
import {g as Ao, c as Do} from "./index-BgifHrBr.js";
const [Je,Ze] = Pe("action-bar")
  , et = Symbol(Je)
  , Eo = {
    placeholder: Boolean,
    safeAreaInsetBottom: Te
};
var Fo = Oe({
    name: Je,
    props: Eo,
    setup(o, {slots: n}) {
        const c = s()
          , l = Bo(c, Ze)
          , {linkChildren: i} = Vt(et);
        i();
        const h = () => {
            var m;
            return v("div", {
                ref: c,
                class: [Ze(), {
                    "van-safe-area-bottom": o.safeAreaInsetBottom
                }]
            }, [(m = n.default) == null ? void 0 : m.call(n)])
        }
        ;
        return () => o.placeholder ? l(h) : h()
    }
});
const No = Be(Fo)
  , [Lo,Ro] = Pe("action-bar-button")
  , Uo = Y({}, xo, {
    type: String,
    text: String,
    icon: String,
    color: String,
    loading: Boolean,
    disabled: Boolean
});
var Wo = Oe({
    name: Lo,
    props: Uo,
    setup(o, {slots: n}) {
        const c = So()
          , {parent: l, index: i} = Zt(et)
          , h = be( () => {
            if (l) {
                const d = l.children[i.value - 1];
                return !(d && "isButton"in d)
            }
        }
        )
          , m = be( () => {
            if (l) {
                const d = l.children[i.value + 1];
                return !(d && "isButton"in d)
            }
        }
        );
        return Qt({
            isButton: !0
        }),
        () => {
            const {type: d, icon: w, text: g, color: C, loading: O, disabled: F} = o;
            return v(ke, {
                class: Ro([d, {
                    last: m.value,
                    first: h.value
                }]),
                size: "large",
                type: d,
                icon: w,
                color: C,
                loading: O,
                disabled: F,
                onClick: c
            }, {
                default: () => [n.default ? n.default() : g]
            })
        }
    }
});
const Qe = Be(Wo)
  , [$o,I,ae] = Pe("dialog")
  , _o = Y({}, so, {
    title: String,
    theme: String,
    width: co,
    message: [String, Function],
    callback: Function,
    allowHtml: Boolean,
    className: ro,
    transition: no("van-dialog-bounce"),
    messageAlign: String,
    closeOnPopstate: Te,
    showCancelButton: Boolean,
    cancelButtonText: String,
    cancelButtonColor: String,
    cancelButtonDisabled: Boolean,
    confirmButtonText: String,
    confirmButtonColor: String,
    confirmButtonDisabled: Boolean,
    showConfirmButton: Te,
    closeOnClickOverlay: Boolean
})
  , Mo = [...eo, "transition", "closeOnPopstate"];
var tt = Oe({
    name: $o,
    props: _o,
    emits: ["confirm", "cancel", "keydown", "update:show"],
    setup(o, {emit: n, slots: c}) {
        const l = s()
          , i = $({
            confirm: !1,
            cancel: !1
        })
          , h = u => n("update:show", u)
          , m = u => {
            var f;
            h(!1),
            (f = o.callback) == null || f.call(o, u)
        }
          , d = u => () => {
            o.show && (n(u),
            o.beforeClose ? (i[u] = !0,
            ao(o.beforeClose, {
                args: [u],
                done() {
                    m(u),
                    i[u] = !1
                },
                canceled() {
                    i[u] = !1
                }
            })) : m(u))
        }
          , w = d("cancel")
          , g = d("confirm")
          , C = Xt(u => {
            var f, T;
            if (u.target !== ((T = (f = l.value) == null ? void 0 : f.popupRef) == null ? void 0 : T.value))
                return;
            ({
                Enter: o.showConfirmButton ? g : Ke,
                Escape: o.showCancelButton ? w : Ke
            })[u.key](),
            n("keydown", u)
        }
        , ["enter", "esc"])
          , O = () => {
            const u = c.title ? c.title() : o.title;
            if (u)
                return v("div", {
                    class: I("header", {
                        isolated: !o.message && !c.default
                    })
                }, [u])
        }
          , F = u => {
            const {message: f, allowHtml: T, messageAlign: b} = o
              , P = I("message", {
                "has-title": u,
                [b]: b
            })
              , S = lo(f) ? f() : f;
            return T && typeof S == "string" ? v("div", {
                class: P,
                innerHTML: S
            }, null) : v("div", {
                class: P
            }, [S])
        }
          , B = () => {
            if (c.default)
                return v("div", {
                    class: I("content")
                }, [c.default()]);
            const {title: u, message: f, allowHtml: T} = o;
            if (f) {
                const b = !!(u || c.title);
                return v("div", {
                    key: T ? 1 : 0,
                    class: I("content", {
                        isolated: !b
                    })
                }, [F(b)])
            }
        }
          , _ = () => v("div", {
            class: [uo, I("footer")]
        }, [o.showCancelButton && v(ke, {
            size: "large",
            text: o.cancelButtonText || ae("cancel"),
            class: I("cancel"),
            style: {
                color: o.cancelButtonColor
            },
            loading: i.cancel,
            disabled: o.cancelButtonDisabled,
            onClick: w
        }, null), o.showConfirmButton && v(ke, {
            size: "large",
            text: o.confirmButtonText || ae("confirm"),
            class: [I("confirm"), {
                [io]: o.showCancelButton
            }],
            style: {
                color: o.confirmButtonColor
            },
            loading: i.confirm,
            disabled: o.confirmButtonDisabled,
            onClick: g
        }, null)])
          , N = () => v(No, {
            class: I("footer")
        }, {
            default: () => [o.showCancelButton && v(Qe, {
                type: "warning",
                text: o.cancelButtonText || ae("cancel"),
                class: I("cancel"),
                color: o.cancelButtonColor,
                loading: i.cancel,
                disabled: o.cancelButtonDisabled,
                onClick: w
            }, null), o.showConfirmButton && v(Qe, {
                type: "danger",
                text: o.confirmButtonText || ae("confirm"),
                class: I("confirm"),
                color: o.confirmButtonColor,
                loading: i.confirm,
                disabled: o.confirmButtonDisabled,
                onClick: g
            }, null)]
        })
          , L = () => c.footer ? c.footer() : o.theme === "round-button" ? N() : _();
        return () => {
            const {width: u, title: f, theme: T, message: b, className: P} = o;
            return v(oo, Xe({
                ref: l,
                role: "dialog",
                class: [I([T]), P],
                style: {
                    width: to(u)
                },
                tabindex: 0,
                "aria-labelledby": f || b,
                onKeydown: C,
                "onUpdate:show": h
            }, Jt(o, Mo)), {
                default: () => [O(), B(), L()]
            })
        }
    }
});
let Ie;
const qo = {
    title: "",
    width: "",
    theme: null,
    message: "",
    overlay: !0,
    callback: null,
    teleport: "body",
    className: "",
    allowHtml: !1,
    lockScroll: !0,
    transition: void 0,
    beforeClose: null,
    overlayClass: "",
    overlayStyle: void 0,
    messageAlign: "",
    cancelButtonText: "",
    cancelButtonColor: null,
    cancelButtonDisabled: !1,
    confirmButtonText: "",
    confirmButtonColor: null,
    confirmButtonDisabled: !1,
    showConfirmButton: !0,
    showCancelButton: !1,
    closeOnPopstate: !0,
    closeOnClickOverlay: !1
};
let Go = Y({}, qo);
function jo() {
    ({instance: Ie} = po({
        setup() {
            const {state: n, toggle: c} = go();
            return () => v(tt, Xe(n, {
                "onUpdate:show": c
            }), null)
        }
    }))
}
function ot(o) {
    return fo ? new Promise( (n, c) => {
        Ie || jo(),
        Ie.open(Y({}, Go, o, {
            callback: l => {
                (l === "confirm" ? n : c)(l)
            }
        }))
    }
    ) : Promise.resolve(void 0)
}
const Na = o => ot(Y({
    showCancelButton: !0
}, o))
  , La = Be(tt)
  , zo = {
    0: "--",
    1: "t1246",
    2: "t126",
    3: "t128",
    4: "t266",
    5: "t126"
}
  , Ho = {
    text: "accountNo",
    value: "walletId"
}
  , Ko = ["ImageUpload", "FileUpload"]
  , Yo = ["UsdtAddress", "BankAccountNumber", "PixAccount", "EWallet", "UpiWallet"]
  , Vo = ["PixType", "BankName"]
  , Zo = {
    walletDelete: [16, 20],
    bankDelete: [14, 18],
    USDTDelete: [13, 19],
    withdrawPwd: [22, 21]
}
  , Qo = 1024 * 1024 * 10
  , Xo = 1024 * 1024 * 100
  , Jo = ["video/mp4", "video/quicktime"]
  , ea = ["image/jpg", "image/png", "image/jpeg", "application/pdf", "video/mp4", "video/quicktime"];
function ta(o) {
    return {
        Account: {
            RegExp: "^.{1,64}$"
        },
        UserId: {
            RegExp: "^[0-9]{1,20}$"
        },
        UserName: {
            RegExp: "^.{1,35}$"
        },
        TextContent: {
            RegExp: "^.{1,40}$"
        },
        Captcha: {
            RegExp: "^[a-zA-Z0-9]{6}$"
        },
        BankAccountNumber: {
            RegExp: "^[0-9]{6,25}$"
        },
        IFSC: {
            RegExp: "^[A-Z]{4}0[A-Z0-9]{6}$"
        },
        BankName: {
            RegExp: "^.{1,30}$"
        },
        DepositOrderNo: {
            disabled: !0
        },
        UsdtAddress: {
            RegExp: "^T[1-9A-HJ-NP-Za-km-z]{33}$"
        },
        UTR: {
            RegExp: "^[0-9]{12}$"
        },
        WithdrawOrderNo: {
            disabled: !0
        },
        OrderAmount: {
            disabled: !0
        },
        WithdrawAmount: {
            disabled: !0
        },
        PhoneEmailCaptcha: {
            RegExp: "^[0-9]{6}$"
        },
        NewWithdrawPassword: {
            RegExp: "^[0-9]{6}$"
        },
        NewPassword: {
            RegExp: "^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d]{8,30}$",
            errorMessage: o("formatPwdError")
        },
        LongText: {
            type: "textarea"
        },
        FileUpload: {
            type: "file",
            tipText: "Upload"
        }
    }
}
function oa(o) {
    return /^[a-zA-Z0-9@.]{8,64}$/.test(o)
}
function aa(o) {
    return /^[a-zA-Z0-9]{6}$/.test(o)
}
function sa(o) {
    return mo(o).format("YYYY-MM-DD HH:mm:ss")
}
function na(o) {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(o)
}
function ra(o, n) {
    var c;
    return new RegExp(((c = n[o]) == null ? void 0 : c.RegExp) || ".*")
}
function ca(o) {
    return o.filter(n => {
        if (o.filter(l => l.workOrderTypeId === n.workOrderTypeId).length > 1) {
            const l = Math.max(...o.filter(i => i.workOrderTypeId === n.workOrderTypeId).map(i => i.sort || 0));
            return n.sort === l
        }
        return !0
    }
    ).filter( (n, c, l) => {
        const i = l.filter(m => m.workOrderTypeId === n.workOrderTypeId);
        if (i.length === 1)
            return !0;
        const h = i.map(m => l.indexOf(m))[0];
        return c === h
    }
    )
}
function la(o, n, c) {
    const l = []
      , i = new Map;
    for (const d of o)
        i.set(d.workOrderTypeId, d);
    const h = {};
    for (const d in n) {
        const w = n[d];
        h[d] = w.every(g => i.has(g))
    }
    const m = {};
    for (const d of o) {
        const w = d.workOrderTypeId
          , g = Object.keys(n).find(C => n[C].includes(w));
        g && h[g] ? (n[g].forEach(C => {
            const O = i.get(C);
            O && (c[O.id] = O)
        }
        ),
        m[g] || (l.push(d),
        m[g] = !0)) : l.push(d)
    }
    return l
}
function ia(o, n, c) {
    var l;
    return !n && (o.typeCode === "NewPassword" || o.typeCode === "NewWithdrawPassword") ? "password" : ((l = c[o.typeCode || ""]) == null ? void 0 : l.type) || "text"
}
const Ra = () => {
    const {t: o} = vo()
      , n = To()
      , {userInfo: c} = wo()
      , {onAnalyticsTrigger: l} = Io()
      , i = ta(o)
      , h = zo
      , m = Ho
      , d = Ko
      , w = Yo
      , g = Vo
      , C = Zo
      , O = e => oa(String(e))
      , F = s({})
      , B = s()
      , _ = s([])
      , N = be( () => {
        var a;
        const e = ((a = c.value) == null ? void 0 : a.userId) || ""
          , t = localStorage.getItem(Po.TOKEN);
        return e && t
    }
    )
      , L = s(!1)
      , u = s(!1)
      , f = s(!1)
      , T = s(!1)
      , b = s([])
      , P = s({})
      , S = s("")
      , Se = s()
      , se = s(!0)
      , xe = s()
      , R = $({})
      , ne = $({
        account: "",
        pageSize: 10,
        pageNo: 1
    })
      , re = s("selfService")
      , Ae = s(!1)
      , x = s([])
      , E = $({
        id: "",
        captchaId: "",
        code: "",
        file: ""
    })
      , V = s(!1)
      , ce = s([])
      , le = s([])
      , De = s([])
      , Ee = s(!1)
      , Fe = s()
      , Ne = s(0)
      , Z = s(10)
      , M = s(1)
      , ie = s(!1)
      , q = s(new Map)
      , Q = s("");
    let ue = null;
    const G = s(!1)
      , Le = s([])
      , de = s([])
      , at = 60
      , Re = s([])
      , j = s(!1)
      , Ue = s(!1)
      , A = s({})
      , We = $({})
      , z = $(new Map)
      , fe = s()
      , D = yo()
      , st = ho();
    let {serviceId: U, typeId: k, amount: $e, orderNo: X, payTypeId: _e, payName: nt} = st.query;
    const H = s([])
      , pe = s([])
      , Me = s("")
      , ge = s()
      , J = s(!1)
      , ee = s(!1)
      , me = s("")
      , ve = s(!1)
      , rt = (e, t) => la(e, t, We)
      , ct = e => {
        D.push({
            name: e,
            query: {
                serviceId: U
            }
        })
    }
      , qe = () => {
        history.go(-1)
    }
      , lt = na
      , it = sa
      , Ge = async (e=!1) => {
        e ? Ye(["serviceListall"]).then(t => {
            B.value = (t == null ? void 0 : t.serviceListall) || []
        }
        ) : Ye(["serviceList"]).then(t => {
            B.value = (t == null ? void 0 : t.serviceList) || []
        }
        );
        try {
            const {data: t, code: a} = await da({});
            if (a === 0) {
                if (e) {
                    const r = Array.isArray(t) ? ca(t) : [t];
                    B.value = r,
                    Ve("serviceListall", r)
                } else {
                    const r = Array.isArray(t) ? rt(t, C) : [t];
                    B.value = r,
                    Ve("serviceList", r)
                }
                Ce()
            }
        } catch {
            Ce()
        }
    }
      , ut = () => {
        D.push({
            name: "workOrderProgress"
        })
    }
      , dt = e => {
        const t = Object.keys(C).find(a => C[a].includes(e.workOrderTypeId));
        if (t) {
            const a = C[t]
              , r = Object.values(We).find(p => p.workOrderTypeId !== e.workOrderTypeId && a.includes(p.workOrderTypeId));
            if (r)
                return z.set(0, t),
                z.set(e.workOrderTypeId, e),
                z.set(r.workOrderTypeId, r),
                f.value = !0
        }
        if (e.workOrderTypeId === 4)
            return D.push({
                name: "DepositHistory"
            });
        if (e.workOrderTypeId === 5)
            return D.push({
                name: "WithdrawHistory"
            });
        D.push({
            name: "selfService",
            query: {
                serviceId: e.id,
                typeId: e.workOrderTypeId
            }
        })
    }
      , ft = e => {
        const t = z.get(C[z.get(0)][e]);
        !t.id || !t.workOrderTypeId || (D.push({
            name: "selfService",
            query: {
                serviceId: t.id,
                typeId: t.workOrderTypeId
            }
        }),
        f.value = !1)
    }
      , pt = () => {
        D.push({
            name: "faqModules"
        })
    }
      , gt = async () => {
        const {data: e, code: t} = await Ta({});
        t === 0 && (F.value = e || {})
    }
      , te = e => {
        A.value[e] = [],
        q.value.delete(e)
    }
      , mt = () => {
        x.value.sort( (e, t) => {
            const a = e.typeCode === "FileUpload" || e.typeCode === "ImageUpload"
              , r = t.typeCode === "FileUpload" || t.typeCode === "ImageUpload";
            if (a && !r)
                return 1;
            if (!a && r)
                return -1;
            const p = e.sort ?? 0
              , W = t.sort ?? 0;
            return p - W
        }
        )
    }
      , vt = async e => {
        const t = e === "PixType" ? "PIX" : "BankCard"
          , {code: a, data: r} = await Ao({
            withdrawType: t
        });
        a === 0 && Array.isArray(r) && (de.value = r.map(p => ({
            accountNo: p.name,
            walletId: p.code
        })),
        pe.value = [...de.value])
    }
      , yt = async e => {
        let t = "BankCard";
        e === "UsdtAddress" ? t = "USDT" : e === "EWallet" ? t = "EWallet" : e === "PixAccount" ? t = "PIX" : e === "UpiWallet" && (t = "UPI");
        const {data: a, code: r} = await Do({
            withdrawType: t
        });
        r === 0 && (Le.value = Array.isArray(a) ? a : [])
    }
      , ht = async e => {
        const t = Array.isArray(e) ? e[0] : e;
        if (!ea.includes(t.type))
            return n.error("The uploaded file type is incorrect."),
            Promise.reject();
        if (Jo.includes(t.type)) {
            if (t.size > Xo)
                return n.error("The size cannot exceed 100M"),
                Promise.reject()
        } else if (t.size > Qo)
            return n.error("The size cannot exceed 10M"),
            Promise.reject();
        return Promise.resolve(e)
    }
    ;
    function wt(e, t, a) {
        return async function(r) {
            if (!r.file)
                return te(e);
            ko({
                duration: 5e4,
                message: "Loading"
            });
            let p = 0;
            Reflect.set(R, e, {
                status: "uploading",
                message: p
            });
            const W = setInterval( () => {
                p < 80 && (p += 10,
                Reflect.set(R, e, {
                    status: "uploading",
                    message: p
                }))
            }
            , 500);
            r.status = "uploading";
            const oe = {
                file: r.file
            };
            try {
                const {code: He, data: K, msg: Kt} = await ka(oe);
                if (Ce(),
                He === 0 && (K != null && K.imagePath)) {
                    const Yt = {
                        typeCode: t,
                        fieldId: e,
                        fieldValue: `${K.imagePath}?${K.fileName}`
                    };
                    q.value.set(e, Yt),
                    r.status = "done",
                    Reflect.set(R, e, {
                        status: "uploading",
                        message: 100
                    }),
                    setTimeout( () => {
                        Reflect.set(R, e, {
                            status: "done",
                            message: 100
                        })
                    }
                    , 300)
                } else
                    te(e),
                    Reflect.set(R, e, {
                        status: "failed",
                        message: 100
                    }),
                    r.status = "failed",
                    n.error(Kt || "Upload Failed")
            } catch {
                r.status = "failed",
                te(e),
                n.error("Upload Failed")
            } finally {
                clearInterval(W)
            }
        }
    }
    const Ct = () => {
        x.value.forEach(e => {
            e.id !== void 0 && (["OrderAmount", "WithdrawAmount"].includes(e.typeCode) && $e ? A.value[e.id] = $e : (e.typeCode === "DepositOrderNo" && X || e.typeCode === "WithdrawOrderNo" && X) && (A.value[e.id] = X))
        }
        )
    }
      , Tt = async () => {
        const {data: e, code: t} = await pa({
            formId: Number(U)
        });
        t === 0 && (Re.value = (e == null ? void 0 : e.outLinkList) || [],
        re.value = (e == null ? void 0 : e.formTitle) || "outLinkService")
    }
      , bt = async () => {
        const {data: e, code: t} = await fa({
            formId: Number(U)
        });
        t === 0 && (x.value = (e == null ? void 0 : e.formFields) || [],
        re.value = (e == null ? void 0 : e.displayName) || "selfService",
        Ae.value = !!(e != null && e.hasUserGuide) || !1,
        x.value.forEach(a => {
            a.typeCode === "Captcha" && (ve.value = !0,
            E.id = String(a.id),
            ye()),
            a.typeCode && g.includes(a.typeCode) && N.value && vt(a.typeCode),
            a.typeCode && w.includes(a.typeCode) && N.value && yt(a.typeCode)
        }
        ),
        mt(),
        (k === "4" || k === "5") && x.value.length > 0 && Ct())
    }
      , kt = async () => {
        var e, t;
        if (k)
            if (k === "1")
                Tt();
            else {
                if ((k === "4" || k === "5" || k === "2") && (await Ge(),
                U = (t = (e = B.value) == null ? void 0 : e.find(a => a.workOrderTypeId === Number(k))) == null ? void 0 : t.id,
                !U))
                    return n.error("The work order configuration could not be retrieved."),
                    qe();
                bt()
            }
    }
      , It = e => ia(e, J.value, i)
      , Ot = e => aa(String(e))
      , Pt = [{
        required: !0,
        message: o("t53")
    }, {
        validator: Ot,
        message: o("captchaError"),
        trigger: "onBlur"
    }]
      , Bt = e => ra(e, i)
      , St = async () => {
        var a, r;
        const e = {
            verifyCodeType: 1,
            phoneOrEmail: (r = (a = c.value) == null ? void 0 : a.verifyMethods) == null ? void 0 : r.phone,
            codeType: 15
        };
        if (!e.phoneOrEmail)
            return n.error("No mobile number bound");
        (await bo(e)).code === 0 && (n.success(o("t52")),
        xt(at),
        ie.value = !0)
    }
      , xt = e => {
        let t = e;
        Q.value = t,
        ue = setInterval( () => {
            t--,
            Q.value = t,
            t <= 0 && (clearInterval(ue),
            ie.value = !1,
            Q.value = "")
        }
        , 1e3)
    }
      , At = () => x.value.map(t => ({
        typeCode: t.typeCode,
        fieldId: t.id,
        fieldValue: t.id ? A.value[t.id] : ""
    })).filter(t => t.fieldValue && t.fieldValue !== "" && !d.includes(t.typeCode || ""))
      , Dt = () => {
        J.value = !J.value
    }
      , Et = () => {
        ee.value = !1,
        me.value = "",
        H.value = pe.value
    }
      , Ft = e => {
        Rt()
    }
      , Nt = e => {
        g.includes(e.typeCode) ? H.value = de.value : w.includes(e.typeCode) && (H.value = Le.value),
        ee.value = !0,
        ge.value = e
    }
      , Lt = ({selectedValues: e, selectedOptions: t}) => {
        x.value.forEach(a => {
            var r, p, W, oe;
            a.id === ((r = ge.value) == null ? void 0 : r.id) && (a.name = (p = t[0]) == null ? void 0 : p.accountNo,
            A.value[a.id] = `${(W = t[0]) == null ? void 0 : W.walletId}|${(oe = t[0]) == null ? void 0 : oe.accountNo}`)
        }
        ),
        ee.value = !1
    }
      , Rt = Co( () => {
        const e = [];
        pe.value.forEach(t => {
            t.accountNo.toUpperCase().indexOf(me.value.toUpperCase()) > -1 && e.push(t)
        }
        ),
        H.value = e
    }
    , 300)
      , Ut = () => {}
      , Wt = async () => {
        var e;
        j.value || (e = fe.value) == null || e.validate().then(async () => {
            const t = {
                formId: Number(U),
                workOrderTypeId: Number(k),
                formFields: [...At(), ...q.value.values()]
            };
            Number(k) === 4 && (t.payTypeId = _e ? Number(_e) : 0,
            t.payName = nt || ""),
            ve.value && E.captchaId && (t.captchaId = E.captchaId),
            j.value = !0;
            try {
                const a = await va(t);
                a.code === 0 ? (l("cs_ticket_submit", {
                    category: t.workOrderTypeId
                }),
                n.success(o("submitSuccessTip")),
                setTimeout( () => {
                    j.value = !1,
                    D.replace({
                        name: "workOrder"
                    })
                }
                , 3e3)) : (ve.value && a.msgCode === 5019 && (A.value[Number(E.id)] = "",
                ye()),
                setTimeout( () => {
                    j.value = !1
                }
                , 1500))
            } catch {
                j.value = !1
            }
        }
        )
    }
      , ye = async () => {
        if (!V.value)
            try {
                V.value = !0;
                const e = await ba({});
                e.code === 0 && (E.file = "data:image/png;base64," + e.data.imageFile,
                E.captchaId = e.data.captchaId)
            } catch {} finally {
                V.value = !1
            }
    }
      , $t = () => {
        N.value ? he() : se.value = !1
    }
      , he = async () => {
        var e;
        try {
            G.value = !0;
            const t = await ua(ne);
            t.code === 0 && Oo(t.data.list) ? (se.value = !0,
            _.value.push(...t.data.list),
            L.value = _.value.length >= ((e = t.data) == null ? void 0 : e.totalCount)) : L.value = !0
        } catch {} finally {
            G.value = !1
        }
    }
      , _t = async () => {
        L.value || (ne.pageNo += 1,
        await he())
    }
      , Mt = async () => {
        var e;
        (e = fe.value) == null || e.validate().then(async () => {
            ne.account = String(xe.value),
            await he()
        }
        )
    }
      , qt = async (e, t=!0) => {
        if (!t) {
            ot({
                className: "remind-dialog",
                message: o("remindText")
            });
            return
        }
        e.isBtnDisabled = !0;
        const {code: a} = await ha({
            orderId: e.id,
            userId: e.userId ?? 0
        });
        a === 0 && (Ue.value = !0,
        window.setTimeout( () => {
            u.value = !1
        }
        , 300 * 1e3))
    }
      , Gt = async e => {
        const t = await ya({
            orderId: e.workOrderNo,
            userId: e.userId ?? 0
        });
        t.code === 0 && (b.value = (t.data ?? []).slice().sort( (a, r) => (a.commentAt || 0) - (r.commentAt || 0)),
        T.value = !0)
    }
      , jt = e => {
        P.value = e,
        f.value = !0
    }
      , zt = async () => {
        var p;
        const e = (p = q.value.get("commit")) == null ? void 0 : p.fieldValue
          , t = {};
        if (!S.value && !e) {
            n.fail(o("inputMessage"));
            return
        }
        e && e.split("?").length > 1 && (t.attachmentName = e.split("?")[1],
        t.attachmentPath = e.split("?")[0]);
        const a = {
            orderId: P.value.workOrderNo,
            userId: P.value.userId ?? 0,
            commentContent: S.value,
            ...t
        };
        (await ma(a)).code === 0 && (je(),
        n.success(o("submitSuccess")))
    }
      , je = () => {
        S.value = "",
        q.value.clear(),
        Se.value = [],
        f.value = !1
    }
      , Ht = async () => {
        const {data: e, code: t} = await wa({});
        t === 0 && (ce.value = e,
        ze(0))
    }
      , ze = e => {
        var t;
        le.value = (t = ce.value[e]) == null ? void 0 : t.questionTitle,
        we()
    }
      , we = () => {
        const e = (M.value - 1) * Z.value
          , t = e + Z.value;
        Ne.value = Math.ceil(le.value.length / Z.value),
        De.value = le.value.slice(e, t)
    }
    ;
    return {
        getServiceList: Ge,
        getHomeConfig: gt,
        serviceList: B,
        handleQueryProgress: ut,
        goServicePage: dt,
        formItemData: x,
        formData: A,
        captchaRules: Pt,
        initServiceData: kt,
        handleSubmit: Wt,
        formRef: fe,
        serviceName: re,
        afterRead: wt,
        beforeRead: ht,
        smsCodeBtn: ie,
        countdown: ue,
        getSmsCode: St,
        codeText: Q,
        fileTypes: d,
        fileDelete: te,
        initProgessPage: $t,
        loading: G,
        goToFaq: pt,
        getFaqData: Ht,
        faqDataList: ce,
        faqContList: De,
        onClickTab: e => {
            const {name: t} = e;
            M.value = 1,
            ze(t)
        }
        ,
        showQuester: async e => {
            const {code: t, data: a} = await Ca({
                faqId: e
            });
            t === 0 && (Fe.value = a,
            Ee.value = !0)
        }
        ,
        faqDialog: Ee,
        faqAnswer: Fe,
        totalPage: Ne,
        pageNo: M,
        pPage: () => {
            M.value--,
            we()
        }
        ,
        nPage: () => {
            M.value++,
            we()
        }
        ,
        pageSize: Z,
        captchaObj: E,
        captchaLoading: V,
        getCaptcode: ye,
        progressList: _,
        handleReminders: qt,
        finished: L,
        isBtnDisabled: u,
        fieldConfig: i,
        checkMore: Gt,
        showDialogForm: f,
        showPopover: T,
        commitList: b,
        getCoursePage: async e => {
            try {
                G.value = !0;
                const t = {
                    formId: e
                }
                  , {code: a, data: r} = await ga(t);
                a === 0 && (Me.value = r.userGuideContent)
            } catch {} finally {
                G.value = !1
            }
        }
        ,
        courseContent: Me,
        homeConfig: F,
        pattern: Bt,
        handleConfirm: zt,
        currentData: P,
        handleReply: jt,
        messageText: S,
        commitImg: Se,
        onBeforeClose: je,
        workOrderStatus: h,
        typeId: k,
        outlinkData: Re,
        columnsData: H,
        customFieldName: m,
        isVisible: J,
        showPickerSearch: ee,
        keyWord: me,
        changeI: Dt,
        handleCancel: Et,
        handleSearch: Ft,
        onConfirm: Lt,
        openPopup: Ut,
        hasUserGuide: Ae,
        goToRoute: ct,
        checkAccount: O,
        progressSubmit: Mt,
        showProgress: se,
        account: xe,
        dateFormat: it,
        isImageUrl: lt,
        onLoad: _t,
        getFieldType: It,
        goB: qe,
        selectTypes: w,
        typeTypes: g,
        selectPicker: Nt,
        userInfo: c,
        selectId: ge,
        isLogin: N,
        showRemider: Ue,
        goAutoServicePage: ft,
        fileStatus: R
    }
}
  , ua = o => y.post("/WorkOrder/GetPageList", o)
  , da = o => y.post("/WorkOrder/GetFormList", o)
  , fa = o => y.post("/WorkOrder/GetFormFieldList", o)
  , pa = o => y.post("/WorkOrder/GetOutLinkList", o)
  , ga = o => y.post("/WorkOrder/GetFormTutorialInfo", o)
  , ma = o => y.post("/WorkOrder/SubmitComment", o)
  , va = o => y.post("/WorkOrder/Submit", o)
  , ya = o => y.post("/WorkOrder/GetCommentList", o)
  , ha = o => y.post("/WorkOrder/SendReminder", o)
  , wa = o => y.post("/WorkOrder/GetFaqList", o)
  , Ca = o => y.post("/WorkOrder/GetFaqDetail", o)
  , Ta = o => y.post("/WorkOrder/GetHomePageConfigs", o)
  , ba = o => y.post("/WorkOrder/GetCaptcha", o)
  , Ua = o => y.post("/WorkOrder/DataCheckByOrderNo", o)
  , ka = o => y.upload("/WorkOrder/UploadToOss", o);
export {La as D, ot as a, Ua as d, Na as s, Ra as u};
