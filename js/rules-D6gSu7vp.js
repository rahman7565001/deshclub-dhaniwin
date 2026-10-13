import {
    b8 as c,
    aZ as _,
    aU as d,
    b0 as s,
    O as a,
    a$ as i,
    b1 as o,
    b_ as l,
    a_ as r,
    aY as h
} from "./index-BgAwOX9Q.js";
const m = {
        class: "rule"
    },
    u = {
        class: "head"
    },
    p = {
        class: "head-words"
    },
    f = {
        class: "body"
    },
    b = c({
        __name: "rules",
        props: {
            title: {},
            content: {}
        },
        setup(t) {
            return (n, v) => {
                const e = i;
                return d(), _("div", m, [s("div", u, [a(e, {
                    "icon-class": "head-bg",
                    name: "rule_head_mid"
                }), s("div", p, o(t.title), 1), a(e, {
                    "icon-class": "head-right",
                    name: "rule_head_right"
                }), a(e, {
                    "icon-class": "head-left",
                    name: "rule_head_left"
                })]), s("div", f, [l(o(t.content) + " ", 1), r(n.$slots, "default", {}, void 0, !0)])])
            }
        }
    }),
    x = h(b, [
        ["__scopeId", "data-v-d1ef68fb"]
    ]);
export {
    x as _
};