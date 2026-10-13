import {
    V as y,
    f as e
} from "./index-BgAwOX9Q.js";

function f({
    source: o
} = {
    source: void 0
}) {
    const {
        text: s,
        copy: t,
        copied: p,
        isSupported: c
    } = y({
        source: o,
        legacy: !0
    }), a = e();
    return {
        text: s,
        copy: async n => {
            await t(n || (o == null ? void 0 : o.value)), a.success("copy successful")
        },
        copied: p,
        isSupported: c
    }
}
export {
    f as u
};