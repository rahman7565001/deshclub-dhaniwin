import {
    b8 as o,
    aZ as t,
    aU as a,
    a_ as s,
    ba as d,
    bd as c,
    b1 as r,
    aY as l
} from "./index-BgAwOX9Q.js";
const i = {
        class: "badge-wrapper"
    },
    b = o({
        __name: "index",
        props: {
            content: {
                default: ""
            },
            tab: {
                type: Boolean,
                default: !1
            }
        },
        setup(e) {
            return (n, f) => (a(), t("div", i, [s(n.$slots, "default", {}, void 0, !0), e.content ? (a(), t("div", {
                key: 0,
                class: c({
                    badge: !0,
                    dot: e.content === "dot",
                    tab: e.tab
                })
            }, r(e.content === "dot" ? "" : e.content), 3)) : d("", !0)]))
        }
    }),
    u = l(b, [
        ["__scopeId", "data-v-da7837f1"]
    ]);
export {
    u as B
};