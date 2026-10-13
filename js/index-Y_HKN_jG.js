import {
    cq as ve,
    cr as ye,
    cs as Ie,
    ct as xe,
    cu as Se,
    b8 as Ce,
    an as Ve,
    bm as ke,
    cv as Ee,
    bE as we,
    R as Me,
    p as M,
    P as Te,
    co as Le,
    c as S,
    O as d,
    bB as C,
    Y as Ae,
    cw as Y,
    cx as Pe,
    aq as Re,
    r as R,
    br as B,
    bq as _,
    bo as T,
    cl as Be,
    bp as z,
    bv as _e,
    bF as Ne,
    bx as U,
    b_ as ze,
    cy as Oe,
    cz as qe,
    cA as De,
    cB as Fe,
    ar as We
} from "./index-BgAwOX9Q.js";
import {
    C as je,
    c as $e
} from "./index-C8L92s_R.js";
import {
    u as He
} from "./use-id-FH6KOsM0.js";

function Q(t) {
    return Array.isArray(t) ? !t.length : t === 0 ? !1 : !t
}

function Ke(t, i) {
    if (Q(t)) {
        if (i.required) return !1;
        if (i.validateEmpty === !1) return !0
    }
    return !(i.pattern && !i.pattern.test(String(t)))
}

function Ye(t, i) {
    return new Promise(l => {
        const f = i.validator(t, i);
        if (Se(f)) {
            f.then(l);
            return
        }
        l(f)
    })
}

function J(t, i) {
    const {
        message: l
    } = i;
    return xe(l) ? l(t, i) : l || ""
}

function Ue({
    target: t
}) {
    t.composing = !0
}

function G({
    target: t
}) {
    t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")))
}

function Je(t, i) {
    const l = ve();
    t.style.height = "auto";
    let f = t.scrollHeight;
    if (ye(i)) {
        const {
            maxHeight: r,
            minHeight: s
        } = i;
        r !== void 0 && (f = Math.min(f, r)), s !== void 0 && (f = Math.max(f, s))
    }
    f && (t.style.height = `${f}px`, Ie(l))
}

function Ge(t) {
    return t === "number" ? {
        type: "text",
        inputmode: "decimal"
    } : t === "digit" ? {
        type: "tel",
        inputmode: "numeric"
    } : {
        type: t
    }
}

function v(t) {
    return [...t].length
}

function N(t, i) {
    return [...t].slice(0, i).join("")
}
const [Qe, g] = ke("field"), Xe = {
    id: String,
    name: String,
    leftIcon: String,
    rightIcon: String,
    autofocus: Boolean,
    clearable: Boolean,
    maxlength: z,
    max: Number,
    min: Number,
    formatter: Function,
    clearIcon: T("clear"),
    modelValue: Be(""),
    inputAlign: String,
    placeholder: String,
    autocomplete: String,
    autocapitalize: String,
    autocorrect: String,
    errorMessage: String,
    enterkeyhint: String,
    clearTrigger: T("focus"),
    formatTrigger: T("onChange"),
    spellcheck: {
        type: Boolean,
        default: null
    },
    error: {
        type: Boolean,
        default: null
    },
    disabled: {
        type: Boolean,
        default: null
    },
    readonly: {
        type: Boolean,
        default: null
    }
}, Ze = Ve({}, $e, Xe, {
    rows: z,
    type: T("text"),
    rules: Array,
    autosize: [Boolean, Object],
    labelWidth: z,
    labelClass: _e,
    labelAlign: String,
    showWordLimit: Boolean,
    errorMessageAlign: String,
    colon: {
        type: Boolean,
        default: null
    }
});
var pe = Ce({
    name: Qe,
    props: Ze,
    emits: ["blur", "focus", "clear", "keypress", "clickInput", "endValidate", "startValidate", "clickLeftIcon", "clickRightIcon", "update:modelValue"],
    setup(t, {
        emit: i,
        slots: l
    }) {
        const f = He(),
            r = Ae({
                status: "unvalidated",
                focused: !1,
                validateMessage: ""
            }),
            s = R(),
            O = R(),
            L = R(),
            {
                parent: m
            } = Ee(Ne),
            x = () => {
                var e;
                return String((e = t.modelValue) != null ? e : "")
            },
            u = e => {
                if (C(t[e])) return t[e];
                if (m && C(m.props[e])) return m.props[e]
            },
            X = S(() => {
                const e = u("readonly");
                if (t.clearable && !e) {
                    const n = x() !== "",
                        a = t.clearTrigger === "always" || t.clearTrigger === "focus" && r.focused;
                    return n && a
                }
                return !1
            }),
            q = S(() => L.value && l.input ? L.value() : t.modelValue),
            Z = S(() => {
                var e;
                const n = u("required");
                return n === "auto" ? (e = t.rules) == null ? void 0 : e.some(a => a.required) : n
            }),
            p = e => e.reduce((n, a) => n.then(() => {
                if (r.status === "failed") return;
                let {
                    value: o
                } = q;
                if (a.formatter && (o = a.formatter(o, a)), !Ke(o, a)) {
                    r.status = "failed", r.validateMessage = J(o, a);
                    return
                }
                if (a.validator) return Q(o) && a.validateEmpty === !1 ? void 0 : Ye(o, a).then(c => {
                    c && typeof c == "string" ? (r.status = "failed", r.validateMessage = c) : c === !1 && (r.status = "failed", r.validateMessage = J(o, a))
                })
            }), Promise.resolve()),
            V = () => {
                r.status = "unvalidated", r.validateMessage = ""
            },
            D = () => i("endValidate", {
                status: r.status,
                message: r.validateMessage
            }),
            F = (e = t.rules) => new Promise(n => {
                V(), e ? (i("startValidate"), p(e).then(() => {
                    r.status === "failed" ? (n({
                        name: t.name,
                        message: r.validateMessage
                    }), D()) : (r.status = "passed", n(), D())
                })) : n()
            }),
            A = e => {
                if (m && t.rules) {
                    const {
                        validateTrigger: n
                    } = m.props, a = Y(n).includes(e), o = t.rules.filter(c => c.trigger ? Y(c.trigger).includes(e) : a);
                    o.length && F(o)
                }
            },
            ee = e => {
                var n;
                const {
                    maxlength: a
                } = t;
                if (C(a) && v(e) > +a) {
                    const o = x();
                    if (o && v(o) === +a) return o;
                    const c = (n = s.value) == null ? void 0 : n.selectionEnd;
                    if (r.focused && c) {
                        const y = [...e],
                            I = y.length - +a;
                        return y.splice(c - I, I), y.join("")
                    }
                    return N(e, +a)
                }
                return e
            },
            k = (e, n = "onChange") => {
                var a, o;
                const c = e;
                e = ee(e);
                const y = v(c) - v(e);
                if (t.type === "number" || t.type === "digit") {
                    const h = t.type === "number";
                    e = Pe(e, h, h), n === "onBlur" && e !== "" && (t.min !== void 0 || t.max !== void 0) && (e = Re(+e, (a = t.min) != null ? a : -1 / 0, (o = t.max) != null ? o : 1 / 0).toString())
                }
                let I = 0;
                if (t.formatter && n === t.formatTrigger) {
                    const {
                        formatter: h,
                        maxlength: b
                    } = t;
                    if (e = h(e), C(b) && v(e) > +b && (e = N(e, +b)), s.value && r.focused) {
                        const {
                            selectionEnd: w
                        } = s.value, K = N(c, w);
                        I = v(h(K)) - v(K)
                    }
                }
                if (s.value && s.value.value !== e)
                    if (r.focused) {
                        let {
                            selectionStart: h,
                            selectionEnd: b
                        } = s.value;
                        if (s.value.value = e, C(h) && C(b)) {
                            const w = v(e);
                            y ? (h -= y, b -= y) : I && (h += I, b += I), s.value.setSelectionRange(Math.min(h, w), Math.min(b, w))
                        }
                    } else s.value.value = e;
                e !== t.modelValue && i("update:modelValue", e)
            },
            te = e => {
                e.target.composing || k(e.target.value)
            },
            P = () => {
                var e;
                return (e = s.value) == null ? void 0 : e.blur()
            },
            W = () => {
                var e;
                return (e = s.value) == null ? void 0 : e.focus()
            },
            E = () => {
                const e = s.value;
                t.type === "textarea" && t.autosize && e && Je(e, t.autosize)
            },
            ne = e => {
                r.focused = !0, i("focus", e), M(E), u("readonly") && P()
            },
            ae = e => {
                r.focused = !1, k(x(), "onBlur"), i("blur", e), !u("readonly") && (A("onBlur"), M(E), qe())
            },
            j = e => i("clickInput", e),
            ie = e => i("clickLeftIcon", e),
            re = e => i("clickRightIcon", e),
            le = e => {
                B(e), i("update:modelValue", ""), i("clear", e)
            },
            $ = S(() => {
                if (typeof t.error == "boolean") return t.error;
                if (m && m.props.showError && r.status === "failed") return !0
            }),
            oe = S(() => {
                const e = u("labelWidth"),
                    n = u("labelAlign");
                if (e && n !== "top") return {
                    width: U(e)
                }
            }),
            se = e => {
                e.keyCode === 13 && (!(m && m.props.submitOnEnter) && t.type !== "textarea" && B(e), t.type === "search" && P()), i("keypress", e)
            },
            H = () => t.id || `${f}-input`,
            ce = () => r.status,
            ue = () => {
                const e = g("control", [u("inputAlign"), {
                    error: $.value,
                    custom: !!l.input,
                    "min-height": t.type === "textarea" && !t.autosize
                }]);
                if (l.input) return d("div", {
                    class: e,
                    onClick: j
                }, [l.input()]);
                const n = {
                    id: H(),
                    ref: s,
                    name: t.name,
                    rows: t.rows !== void 0 ? +t.rows : void 0,
                    class: e,
                    disabled: u("disabled"),
                    readonly: u("readonly"),
                    autofocus: t.autofocus,
                    placeholder: t.placeholder,
                    autocomplete: t.autocomplete,
                    autocapitalize: t.autocapitalize,
                    autocorrect: t.autocorrect,
                    enterkeyhint: t.enterkeyhint,
                    spellcheck: t.spellcheck,
                    "aria-labelledby": t.label ? `${f}-label` : void 0,
                    "data-allow-mismatch": "attribute",
                    onBlur: ae,
                    onFocus: ne,
                    onInput: te,
                    onClick: j,
                    onChange: G,
                    onKeypress: se,
                    onCompositionend: G,
                    onCompositionstart: Ue
                };
                return t.type === "textarea" ? d("textarea", n, null) : d("input", Oe(Ge(t.type), n), null)
            },
            de = () => {
                const e = l["left-icon"];
                if (t.leftIcon || e) return d("div", {
                    class: g("left-icon"),
                    onClick: ie
                }, [e ? e() : d(_, {
                    name: t.leftIcon,
                    classPrefix: t.iconPrefix
                }, null)])
            },
            fe = () => {
                const e = l["right-icon"];
                if (t.rightIcon || e) return d("div", {
                    class: g("right-icon"),
                    onClick: re
                }, [e ? e() : d(_, {
                    name: t.rightIcon,
                    classPrefix: t.iconPrefix
                }, null)])
            },
            ge = () => {
                if (t.showWordLimit && t.maxlength) {
                    const e = v(x());
                    return d("div", {
                        class: g("word-limit")
                    }, [d("span", {
                        class: g("word-num")
                    }, [e]), ze("/"), t.maxlength])
                }
            },
            me = () => {
                if (m && m.props.showErrorMessage === !1) return;
                const e = t.errorMessage || r.validateMessage;
                if (e) {
                    const n = l["error-message"],
                        a = u("errorMessageAlign");
                    return d("div", {
                        class: g("error-message", a)
                    }, [n ? n({
                        message: e
                    }) : e])
                }
            },
            he = () => {
                const e = u("labelWidth"),
                    n = u("labelAlign"),
                    a = u("colon") ? ":" : "";
                if (l.label) return [l.label(), a];
                if (t.label) return d("label", {
                    id: `${f}-label`,
                    for: l.input ? void 0 : H(),
                    "data-allow-mismatch": "attribute",
                    onClick: o => {
                        B(o), W()
                    },
                    style: n === "top" && e ? {
                        width: U(e)
                    } : void 0
                }, [t.label + a])
            },
            be = () => [d("div", {
                class: g("body")
            }, [ue(), X.value && d(_, {
                ref: O,
                name: t.clearIcon,
                class: g("clear")
            }, null), fe(), l.button && d("div", {
                class: g("button")
            }, [l.button()])]), ge(), me()];
        return we({
            blur: P,
            focus: W,
            validate: F,
            formValue: q,
            resetValidation: V,
            getValidationStatus: ce
        }), De(Fe, {
            customValue: L,
            resetValidation: V,
            validateWithTrigger: A
        }), Me(() => t.modelValue, () => {
            k(x()), V(), A("onChange"), M(E)
        }), Te(() => {
            k(x(), t.formatTrigger), M(E)
        }), Le("touchstart", le, {
            target: S(() => {
                var e;
                return (e = O.value) == null ? void 0 : e.$el
            })
        }), () => {
            const e = u("disabled"),
                n = u("labelAlign"),
                a = de(),
                o = () => {
                    const c = he();
                    return n === "top" ? [a, c].filter(Boolean) : c || []
                };
            return d(je, {
                size: t.size,
                class: g({
                    error: $.value,
                    disabled: e,
                    [`label-${n}`]: n
                }),
                center: t.center,
                border: t.border,
                isLink: t.isLink,
                clickable: t.clickable,
                titleStyle: oe.value,
                valueClass: g("value"),
                titleClass: [g("label", [n, {
                    required: Z.value
                }]), t.labelClass],
                arrowDirection: t.arrowDirection
            }, {
                icon: a && n !== "top" ? () => a : null,
                title: o,
                value: be,
                extra: l.extra
            })
        }
    }
});
const at = We(pe);
export {
    at as F, Xe as f
};