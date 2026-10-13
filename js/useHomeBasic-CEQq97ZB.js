import {
    c as o,
    r as n,
    B as m,
    C as v
} from "./index-BgAwOX9Q.js";
const {
    eventBus: d
} = v(), t = n(null), s = n(0), e = n(!1);

function p() {
    const c = async () => {
            if (!e.value) try {
                e.value = !0;
                const a = await m();
                a.code == 0 && a.data && (t.value = a.data, s.value = a == null ? void 0 : a.serverTime, a.data.isShowDownloadAppPopup && d.emit("show_download_app_popup"))
            } finally {
                e.value = !1
            }
        },
        u = o(() => {
            var a;
            return ((a = t.value) == null ? void 0 : a.cashRainInfo) || null
        }),
        i = o(() => {
            var a;
            return ((a = t.value) == null ? void 0 : a.floatWindows) || null
        }),
        l = o(() => {
            var a;
            return ((a = t.value) == null ? void 0 : a.rechargeDiscountAmount) || 0
        }),
        r = o(() => {
            var a;
            return ((a = t.value) == null ? void 0 : a.activityInformationCount) || 0
        }),
        f = o(() => {
            var a;
            return ((a = t.value) == null ? void 0 : a.homeFrontData) || {}
        });
    return {
        homeBasicData: t,
        isLoading: e,
        serverTimeData: s,
        fetchHomeBasicData: c,
        cashRainInfoData: u,
        floatWindowsData: i,
        rechargeDiscountAmountData: l,
        activityCount: r,
        homeFrontData: f
    }
}
export {
    p as u
};