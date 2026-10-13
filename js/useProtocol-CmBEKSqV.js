import {r as c, E as s} from "./index-BgAwOX9Q.js";
const e = new Map;
function l(o) {
    const t = c("");
    return {
        richText: t,
        getProtocol: async (a=!0) => {
            if (e.has(o) && a) {
                t.value = e.get(o);
                return
            }
            const r = await s({
                type: o
            });
            r.code === 0 && (t.value = r.data,
            e.set(o, t.value))
        }
    }
}
export {l as u};
