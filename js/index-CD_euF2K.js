import {
    bm as i,
    b8 as f,
    an as h,
    cv as x,
    R as g,
    bE as p,
    bw as V,
    O as k,
    cI as v,
    cy as P,
    c as C,
    dv as G,
    dw as O,
    bA as E,
    ar as _
} from "./index-BgAwOX9Q.js";
const [y, R] = i("checkbox-group"), $ = Symbol(y), [w, B] = i("checkbox"), I = h({}, O, {
    shape: String,
    bindGroup: E,
    indeterminate: {
        type: Boolean,
        default: null
    }
});
var K = f({
    name: w,
    props: I,
    emits: ["change", "update:modelValue"],
    setup(e, {
        emit: c,
        slots: m
    }) {
        const {
            parent: a
        } = x($), r = n => {
            const {
                name: l
            } = e, {
                max: d,
                modelValue: b
            } = a.props, t = b.slice();
            if (n) !(d && t.length >= +d) && !t.includes(l) && (t.push(l), e.bindGroup && a.updateValue(t));
            else {
                const s = t.indexOf(l);
                s !== -1 && (t.splice(s, 1), e.bindGroup && a.updateValue(t))
            }
        }, o = C(() => a && e.bindGroup ? a.props.modelValue.indexOf(e.name) !== -1 : !!e.modelValue), u = (n = !o.value) => {
            a && e.bindGroup ? r(n) : c("update:modelValue", n), e.indeterminate !== null && c("change", n)
        };
        return g(() => e.modelValue, n => {
            e.indeterminate === null && c("change", n)
        }), p({
            toggle: u,
            props: e,
            checked: o
        }), V(() => e.modelValue), () => k(G, P({
            bem: B,
            role: "checkbox",
            parent: a,
            checked: o.value,
            onToggle: u
        }, e), v(m, ["default", "icon"]))
    }
});
const S = _(K);
export {
    S as C
};