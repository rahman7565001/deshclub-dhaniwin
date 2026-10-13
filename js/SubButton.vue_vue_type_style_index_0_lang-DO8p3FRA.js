import {
    b8 as o,
    aZ as a,
    aU as i,
    b0 as r,
    b1 as c
} from "./index-BgAwOX9Q.js";
const m = {
        class: "pay-btn"
    },
    u = o({
        __name: "SubButton",
        props: {
            text: {
                type: String,
                default: ""
            }
        },
        emits: ["submit"],
        setup(e, {
            emit: s
        }) {
            const n = s;
            return (p, t) => (i(), a("section", m, [r("div", {
                class: "red-btn",
                onClick: t[0] || (t[0] = b => n("submit"))
            }, c(e.text), 1)]))
        }
    });
export {
    u as _
};