import {
    t as A,
    a as J,
    af as T,
    c as g,
    v as I,
    ag as L,
    Y as O,
    ah as S,
    ai as j
} from "./index-BgAwOX9Q.js";
import {
    u as U
} from "./index-BcjvKTEd.js";
import {
    j as d
} from "./link.utils-vOIN8uPL.js";
const l = "commonMessageList",
    t = O({
        list: []
    });

function E() {
    const {
        serviceList: c,
        getServiceList: f,
        goServicePage: y
    } = U(), o = A(), {
        getActiveLanguage: n
    } = J(), m = g(() => t.list.filter(e => [4, 5].includes(e.type) && e.sysLanguage === n.value)), v = g(() => t.list.filter(e => e.type === 2 && e.sysLanguage === n.value)), h = g(() => t.list.filter(e => e.type === 3 && e.sysLanguage === n.value)), w = g(() => t.list.filter(e => e.type === 1 && e.sysLanguage === n.value)), C = e => !!e.jumpUrl, {
        gameUrl: M
    } = T();
    return {
        banners: m,
        loginBefoMessage: v,
        loginAfterMessage: h,
        noticeMessage: w,
        isJump: C,
        getMessage: async (e = !1) => {
            let a = !1;
            const u = async () => {
                    if (!e) try {
                        const s = (await L([l]))[l];
                        s && Array.isArray(s) && s.length > 0 && !a && (t.list = s)
                    } catch {}
                },
                p = async () => {
                    try {
                        const r = await S();
                        if (r && r.code === 0) {
                            const s = r.data,
                                i = Array.isArray(s) ? s : [];
                            if (i.length > 0) {
                                t.list = i, a = !0;
                                try {
                                    j(l, JSON.parse(JSON.stringify(i)))
                                } catch {}
                            }
                        }
                    } catch {}
                };
            await Promise.allSettled([u(), p()])
        },
        onJump: async e => {
            if (e.messageJumpType !== 0) {
                if (e.messageJumpType === 1) {
                    if (!e.jumpUrl) return;
                    if (e.jumpUrl.startsWith("http")) return d(e.jumpUrl)
                }
                if (e.messageJumpType === 2) {
                    const a = I[e.pageType];
                    if (!a) return;
                    await o.push({
                        name: a.name
                    });
                    return
                }
                if (e.messageJumpType === 4) {
                    if (e.gameId && e.gameCode) {
                        await M({
                            vendorCode: e.vendorCode || "",
                            gameCode: e.gameCode || "",
                            gameId: Number(e.gameId) || ""
                        });
                        return
                    }
                    await o.push({
                        name: "allGames",
                        query: {
                            vendorCode: e.vendorCode || "",
                            gameCode: e.gameCode || "",
                            gameId: e.gameId || ""
                        }
                    });
                    return
                }
                if (e.messageJumpType === 5) {
                    await f(!0);
                    const a = e.customPopupId;
                    if (Array.isArray(c.value) && c.value.length !== 0) {
                        const u = c.value.find(p => p.workOrderTypeId === a);
                        if (u) return y(u)
                    }
                    return o.push({
                        name: "workOrder"
                    })
                }
                await o.push({
                    path: e.jumpUrl
                })
            }
        },
        jumpOutLink: d
    }
}
export {
    E as u
};