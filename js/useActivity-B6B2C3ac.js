import {t as k, a as S, r as m, c as d, v as g, w as O, x as D, y as v, z as R, A as P} from "./index-BgAwOX9Q.js";
import {j} from "./link.utils-vOIN8uPL.js";
import {u as q} from "./index-BcjvKTEd.js";
const J = 1440 * 60 * 1e3
  , h = m(!0);
function Y() {
    const u = k()
      , f = m([])
      , y = m([])
      , {userInfo: A} = P()
      , {newActivityInformationDays: T} = S()
      , w = d( () => !A.value.hasReceivedOpenPushGuideReward && h.value)
      , I = d( () => {
        const t = [...f.value, ...y.value];
        let r = [];
        if (t.length) {
            const s = t.filter(n => n.activityInquiryType === 2)
              , o = t.filter(n => n.activityInquiryType !== 2);
            w.value ? r = [...s, ...o] : r = [...o, ...s]
        }
        return r
    }
    )
      , {goServicePage: L} = q();
    function N(t, r=Date.now()) {
        if (Number(t == null ? void 0 : t.newActivityState) !== 1)
            return !1;
        const s = Number(t == null ? void 0 : t.lastUpdateTime);
        if (!s)
            return !1;
        const o = T.value;
        return r - s <= o * J
    }
    return {
        showActivityList: I,
        getActivityList: async () => {
            var s, o;
            v.get("activityList").then(n => {
                n && (y.value = n)
            }
            ),
            v.get("activityNewList").then(async n => {
                n && (f.value = n)
            }
            );
            const {code: t, data: r} = await R();
            if (t === 0) {
                const n = []
                  , p = []
                  , a = []
                  , l = Date.now();
                for (const e of r || []) {
                    if (!e.isShowTips && e.pageType === 19) {
                        const c = e.tipsDetail;
                        e.firstItem = ((s = c == null ? void 0 : c.pendingDayTask) == null ? void 0 : s[0]) || ((o = c == null ? void 0 : c.pendingWeekTask) == null ? void 0 : o[0])
                    }
                    const i = {
                        ...e,
                        isNew: N(e, l)
                    };
                    i.isShowTips ? p.push(i) : i.isNew ? n.push(i) : a.push(i)
                }
                f.value = [...p.sort( (e, i) => ((i == null ? void 0 : i.sort) ?? 0) - ((e == null ? void 0 : e.sort) ?? 0)), ...n.sort( (e, i) => ((i == null ? void 0 : i.sort) ?? 0) - ((e == null ? void 0 : e.sort) ?? 0))],
                y.value = a.sort( (e, i) => ((i == null ? void 0 : i.sort) ?? 0) - ((e == null ? void 0 : e.sort) ?? 0));
                try {
                    v.set("activityList", JSON.parse(JSON.stringify(y.value))),
                    v.set("activityNewList", JSON.parse(JSON.stringify(f.value)))
                } catch {}
            }
        }
        ,
        clickActivity: async (t, r) => {
            const {informationType: s, id: o, content: n, pageType: p} = t;
            if (s === 0 && j(n),
            s === 1 && await u.push({
                name: "activityDetail",
                query: {
                    id: o
                }
            }),
            s === 2 || s === 18) {
                const a = g[p].name;
                if (!a)
                    return;
                await u.push({
                    name: a
                })
            }
            if (s === 3 && Array.isArray(r)) {
                const a = r.find(l => l.workOrderTypeId === t.pageId);
                return a ? L(a) : u.push({
                    name: "workOrder"
                })
            }
            if (s === 5)
                return n ? u.push({
                    name: "activityInsideLink",
                    query: {
                        url: D(n)
                    }
                }) : void 0
        }
        ,
        getActivetyDetail: async t => {
            const {code: r, data: s} = await O({
                id: t
            });
            if (r === 0)
                return s || {}
        }
        ,
        jumpPageItem: t => {
            const r = g[t].name;
            r && u.push({
                name: r
            })
        }
        ,
        canReceiveReward: w,
        isReceiveReward: h
    }
}
export {Y as u};
