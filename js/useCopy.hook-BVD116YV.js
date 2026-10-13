import {
    u as y,
    V as u,
    f as i
} from "./index-BgAwOX9Q.js";

function f({
    source: o
} = {
    source: void 0
}) {
    const {
        t
    } = y(), {
        text: s,
        copy: p,
        copied: a,
        isSupported: n
    } = u({
        source: o,
        legacy: !0
    }), c = i();
    return {
        text: s,
        copy: async e => {
            await p(e || (o == null ? void 0 : o.value)), c.success(t("t1253"))
        },
        copied: a,
        isSupported: n
    }
}
export {
    f as u
};