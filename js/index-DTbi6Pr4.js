import {b8 as $, a as D, u as U, r as d, n as r, t as V, P as z, aZ as A, aU as B, O as l, bg as C, b0 as e, b1 as i, bb as t, a$ as L, bj as O, bs as R, bJ as G, bh as M, a1 as _, bK as P, a5 as Z, bL as j, aY as H} from "./index-BgAwOX9Q.js";
const J = {
    class: "welcome-tips"
}
  , K = {
    class: "new-user"
}
  , Y = {
    class: "wel-info"
}
  , q = {
    class: "wel-title"
}
  , Q = {
    class: "wel-desc"
}
  , T = {
    class: "new-user"
}
  , W = {
    class: "wel-info"
}
  , X = {
    class: "wel-title"
}
  , ee = {
    class: "wel-desc"
}
  , se = {
    class: "loading"
}
  , ae = $({
    __name: "index",
    props: {
        guestLogin: {
            type: Function
        }
    },
    emits: ["close", "Logined"],
    setup(I, {emit: x}) {
        var c, w, p;
        const {isEnableGuestLogin: y} = D()
          , {t: o} = U()
          , h = d(((p = (w = (c = r) == null ? void 0 : c.readClipboardPayloadNoEncode) == null ? void 0 : w.call(c)) == null ? void 0 : p.data) || "")
          , S = new RegExp(`^${r.SCHEME}\\?shortLoginCode=([a-zA-Z0-9]*)$`,"i")
          , m = d(h.value.replace(S, "$1"))
          , u = V()
          , g = x
          , a = d(!1)
          , f = I
          , n = d(!1)
          , k = async () => {
            if (localStorage.setItem(_.FirstIn, "new"),
            y.value === !1) {
                a.value = !1;
                return
            }
            n.value = !0;
            const s = await f.guestLogin();
            n.value = !1,
            s ? g("Logined") : u.push({
                name: "Login"
            }),
            a.value = !1
        }
          , E = async () => {
            localStorage.setItem(_.FirstIn, "old"),
            n.value = !0;
            const s = await f.guestLogin();
            n.value = !1,
            a.value = !1,
            s ? g("Logined") : u.push({
                name: "Login"
            })
        }
          , F = async () => {
            var s, v;
            try {
                const {code: b, data: N} = await P({
                    shortLoginCode: m.value,
                    deviceId: ((s = r) == null ? void 0 : s.getDeviceId()) || ((v = Z.readEventConfigFromUrl()) == null ? void 0 : v.deviceId) || ""
                });
                b === 0 ? (j(N),
                localStorage.setItem(_.FirstIn, "new"),
                a.value = !1,
                g("Logined"),
                u.push({
                    name: "home"
                })) : a.value = !0
            } catch {
                a.value = !0
            }
        }
        ;
        return z(async () => {
            var s;
            (s = r) != null && s.isAndroid() && !localStorage.getItem("ar_refresh_token") && !localStorage.getItem("ar_token") ? h.value.includes("shortLoginCode=") && m.value ? await F() : a.value = !0 : a.value = !1
        }
        ),
        (s, v) => (B(),
        A(M, null, [l(O, {
            modelValue: a.value,
            title: t(o)("t796"),
            customClass: "withdraw-dialog",
            "z-index": 9999999,
            hideClose: "",
            maskNotClose: !0
        }, {
            default: C( () => [e("div", J, i(t(o)("t797")), 1), e("div", {
                class: "dialog-content-btns mb40",
                onClick: k
            }, [e("div", K, [l(L, {
                class: "img",
                name: "wel-user"
            })]), e("div", Y, [e("div", q, i(t(o)("t798")), 1), e("div", Q, i(t(o)("t799")), 1)])]), e("div", {
                class: "dialog-content-btns",
                onClick: E
            }, [e("div", T, [l(L, {
                class: "img",
                name: "wel-old"
            })]), e("div", W, [e("div", X, i(t(o)("t800")), 1), e("div", ee, i(t(o)("t801")), 1)])])]),
            _: 1
        }, 8, ["modelValue", "title"]), l(t(G), {
            show: n.value,
            "z-index": "1000000000000000000"
        }, {
            default: C( () => [e("div", se, [l(t(R))])]),
            _: 1
        }, 8, ["show"])], 64))
    }
})
  , oe = H(ae, [["__scopeId", "data-v-4e024480"]]);
export {oe as default};
