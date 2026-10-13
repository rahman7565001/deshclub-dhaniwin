import {u as k, a as h, r as o, c as d, g as p, n as y, s as m, b as z} from "./index-BgAwOX9Q.js";
const {getActiveLanguage: B} = h();
function J() {
    const {t: v} = k()
      , l = o("")
      , {giftCodeConfig: w} = h()
      , {giftCodeBannerList: c=[], giftCodeExternalLinkList: g=[], giftCodeRuleList: L=[]} = w.value || {}
      , C = async () => {
        if (!l.value) {
            m(v("t273"));
            return
        }
        const {code: e} = await z({
            giftCode: l.value
        });
        if (e === 0) {
            m(v("t266")),
            l.value = "",
            b();
            return
        }
    }
      , b = async () => {
        if (!n) {
            n = !0,
            r.value = !0;
            try {
                const {code: e, data: t} = await p({
                    pageNo: 1,
                    pageSize: 20
                });
                if (e === 0 && t) {
                    const a = t.list || [];
                    u.value = a,
                    i.value = t.totalPage || 0,
                    s.value = 2,
                    f.value = !a.length || s.value > i.value
                }
            } finally {
                n = !1,
                r.value = !1
            }
        }
    }
      , P = d( () => {
        var e, t, a;
        return c && ((e = c[0]) != null && e.value1) ? {
            url: ((t = c[0]) == null ? void 0 : t.value1) || "",
            name: ((a = c[0]) == null ? void 0 : a.settingName) || ""
        } : {
            url: "",
            name: ""
        }
    }
    )
      , R = e => {
        y.isInPack() ? x(e) : E(e)
    }
    ;
    async function x(e) {
        y.openExternalUrl(e)
    }
    async function E(e) {
        try {
            window.location.href = e
        } catch {
            window.open(e, "_blank")
        }
    }
    const I = d( () => {
        const e = L.find(t => t.sysLanguage === B.value);
        return (e == null ? void 0 : e.content) || ""
    }
    )
      , N = d( () => g ? g.filter(t => t.state === 1).sort( (t, a) => t.linkIndex - a.linkIndex) : [])
      , u = o([])
      , s = o(1)
      , i = o(0)
      , r = o(!1)
      , f = o(!1);
    let n = !1;
    return {
        giftCode: l,
        shareBtns: N,
        banner: P,
        confirm: C,
        jump: R,
        content: I,
        recordList: u,
        recordLoading: r,
        recordFinished: f,
        loadRecord: async () => {
            if (!n) {
                n = !0,
                r.value = !0;
                try {
                    const {code: e, data: t} = await p({
                        pageNo: s.value,
                        pageSize: 20
                    });
                    if (e === 0 && t) {
                        let a = t.list || [];
                        u.value = u.value.concat(a),
                        i.value = t.totalPage || 0,
                        s.value += 1,
                        (!a.length || s.value > i.value) && (f.value = !0)
                    } else
                        f.value = !0
                } finally {
                    n = !1,
                    r.value = !1
                }
            }
        }
    }
}
export {J as u};
