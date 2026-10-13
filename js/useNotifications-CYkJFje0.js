import {
    r as a,
    ak as w,
    al as C
} from "./index-BgAwOX9Q.js";
const n = a([]),
    h = a(!0),
    p = a(!1),
    o = a(!1),
    i = a({
        pageNo: 1,
        pageSize: 10
    }),
    c = a(0),
    s = a([]),
    r = a({}),
    R = a(!1),
    S = a(0),
    k = a(!1),
    v = a({}),
    y = a(!1),
    f = a(!1),
    d = a({
        pageNo: 1,
        pageSize: 10
    }),
    g = a(0),
    I = a(0),
    N = a(!0);

function U() {
    return {
        load1: async () => {
            try {
                const {
                    data: e,
                    code: u
                } = await C({ ...i.value
                });
                u == 0 && (c.value = e.totalCount || 0, n.value = [...n.value, ...e.list || []])
            } catch {} finally {
                if (p.value = !1, n.value.length === 0) {
                    h.value = !1, o.value = !0;
                    return
                }
                n.value.length >= c.value ? o.value = !0 : ++i.value.pageNo
            }
        },
        list1: n,
        has1: h,
        loading1: p,
        finished1: o,
        page1: i,
        total1: c,
        load2: async () => {
            try {
                const {
                    data: e,
                    code: u
                } = await w({ ...d.value
                });
                u == 0 && (g.value = e.totalCount || 0, s.value = [...s.value, ...e.list || []], I.value = s.value.filter(l => (l == null ? void 0 : l.state) == 0).length || 0, r.value = { ...r.value,
                    ...(e.list || []).reduce((l, t) => (t.inmailId && (l[t.inmailId] = t.state === 0), l), {})
                }, v.value = { ...v.value,
                    ...(e.list || []).reduce((l, t) => (t.inmailId && (l[t.inmailId] = t.isHasReward), l), {})
                })
            } catch {} finally {
                if (y.value = !1, s.value.length === 0) {
                    N.value = !1, f.value = !0;
                    return
                }
                s.value.length >= g.value ? f.value = !0 : ++d.value.pageNo
            }
        },
        list2: s,
        readState: r,
        hasReward: v,
        isDelete: R,
        clickId: S,
        isMenuEnter: k,
        has2: N,
        loading2: y,
        finished2: f,
        page2: d,
        total2: g,
        noReadCount: I
    }
}
export {
    U as u
};