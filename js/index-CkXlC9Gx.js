import {
    b8 as w,
    bA as h,
    bp as y,
    bm as A,
    bD as T,
    bE as C,
    O as M,
    bF as N,
    br as O,
    ar as _
} from "./index-BgAwOX9Q.js";
const [k, q] = A("form"), x = {
    colon: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    required: [Boolean, String],
    showError: Boolean,
    labelWidth: y,
    labelAlign: String,
    inputAlign: String,
    scrollToError: Boolean,
    scrollToErrorPosition: String,
    validateFirst: Boolean,
    submitOnEnter: h,
    showErrorMessage: h,
    errorMessageAlign: String,
    validateTrigger: {
        type: [String, Array],
        default: "onBlur"
    }
};
var D = w({
    name: k,
    props: x,
    emits: ["submit", "failed"],
    setup(l, {
        emit: s,
        slots: c
    }) {
        const {
            children: i,
            linkChildren: b
        } = T(N), a = e => e ? i.filter(t => e.includes(t.name)) : i, v = e => new Promise((t, n) => {
            const o = [];
            a(e).reduce((F, V) => F.then(() => {
                if (!o.length) return V.validate().then(g => {
                    g && o.push(g)
                })
            }), Promise.resolve()).then(() => {
                o.length ? n(o) : t()
            })
        }), p = e => new Promise((t, n) => {
            const o = a(e);
            Promise.all(o.map(r => r.validate())).then(r => {
                r = r.filter(Boolean), r.length ? n(r) : t()
            })
        }), E = e => {
            const t = i.find(n => n.name === e);
            return t ? new Promise((n, o) => {
                t.validate().then(r => {
                    r ? o(r) : n()
                })
            }) : Promise.reject()
        }, d = e => typeof e == "string" ? E(e) : l.validateFirst ? v(e) : p(e), P = e => {
            typeof e == "string" && (e = [e]), a(e).forEach(n => {
                n.resetValidation()
            })
        }, S = () => i.reduce((e, t) => (e[t.name] = t.getValidationStatus(), e), {}), u = (e, t) => {
            i.some(n => n.name === e ? (n.$el.scrollIntoView(t), !0) : !1)
        }, f = () => i.reduce((e, t) => (t.name !== void 0 && (e[t.name] = t.formValue.value), e), {}), m = () => {
            const e = f();
            d().then(() => s("submit", e)).catch(t => {
                s("failed", {
                    values: e,
                    errors: t
                });
                const {
                    scrollToError: n,
                    scrollToErrorPosition: o
                } = l;
                n && t[0].name && u(t[0].name, o ? {
                    block: o
                } : void 0)
            })
        }, B = e => {
            O(e), m()
        };
        return b({
            props: l
        }), C({
            submit: m,
            validate: d,
            getValues: f,
            scrollToField: u,
            resetValidation: P,
            getValidationStatus: S
        }), () => {
            var e;
            return M("form", {
                class: q(),
                onSubmit: B
            }, [(e = c.default) == null ? void 0 : e.call(c)])
        }
    }
});
const j = _(D);
export {
    j as F
};