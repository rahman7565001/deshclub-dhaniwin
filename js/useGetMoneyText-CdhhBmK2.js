import {a as s, _ as c, u as i, c as r} from "./index-BgAwOX9Q.js";
function f() {
    const {currencySign: e} = s()
      , {giftpackInfo: n} = c()
      , {t: u} = i();
    return r( () => {
        var t;
        const a = e.value && e.value !== "undefined" ? e.value : ""
          , o = ((t = n.value) == null ? void 0 : t.invitedWheelTotalPrizeAmount) ?? 0;
        return `${u("t1350")} ${a}${o}`
    }
    )
}
export {f as u};
