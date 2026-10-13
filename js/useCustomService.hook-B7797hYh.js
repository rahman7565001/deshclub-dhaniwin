import {
    u as y
} from "./useMessage-C68PgFYf.js";
import {
    C as b
} from "./index-CbX2THFF.js";
import {
    as as l,
    r as C
} from "./index-BgAwOX9Q.js";
const n = C();

function I(u) {
    const {
        jumpOutLink: d
    } = y(), {
        type: a
    } = u, w = async () => {
        window.__lc = window.__lc || {}, window.__lc.license = 15861567, window.__lc.asyncInit = !0, (function(e, t, i) {
            function c(s) {
                return o._h ? o._h.apply(null, s) : o._q.push(s)
            }
            const o = {
                _q: [],
                _h: null,
                _v: "2.0",
                on: function() {
                    c(["on", i.call(arguments)])
                },
                once: function() {
                    c(["once", i.call(arguments)])
                },
                off: function() {
                    c(["off", i.call(arguments)])
                },
                get: function() {
                    if (!o._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
                    return c(["get", i.call(arguments)])
                },
                call: function() {
                    c(["call", i.call(arguments)])
                },
                init: function() {
                    const s = t.createElement("script");
                    s.async = !0, s.type = "text/javascript", s.src = "https://cdn.livechatinc.com/tracking.js", t.head.appendChild(s)
                }
            };
            !e.__lc.asyncInit && o.init(), e.LiveChatWidget = e.LiveChatWidget || o
        })(window, document, [].slice)
    }, m = (e, t) => {
        window.Tawk_API.toggle(), window.Tawk_API.setAttributes({
            userid: e,
            vv075mxt0i: t
        }, function(i) {})
    }, f = e => {
        window.Tawk_API.toggle(), window.Tawk_API.setAttributes({
            wizmpunyhe: e
        }, function(t) {})
    }, h = () => {
        document.getElementById("tawk-chatjs") || (window.Tawk_API = window.Tawk_API || {}, window.Tawk_LoadStart = new Date, (function() {
            var i;
            const e = document.createElement("script"),
                t = document.getElementsByTagName("script")[0];
            e.async = !0, e.src = "https://embed.tawk.to/6452138631ebfa0fe7fbb175/1hjs089gi", e.charset = "UTF-8", e.setAttribute("crossorigin", "*"), (i = t.parentNode) == null || i.insertBefore(e, t)
        })())
    };

    function g(e) {
        var t;
        switch (e.visibility) {
            case "maximized":
                break;
            case "minimized":
                (t = window.LiveChatWidget) == null || t.call("hide");
                break
        }
    }
    const _ = l(async (e, t) => {
            a === 1 ? (n.value.call("set_session_variables", {
                userId: e,
                balance: t
            }), n.value.call("maximize")) : a === 2 ? m(e, t) : a === 3 && r()
        }, 2e3),
        v = l(async e => {
            a === 1 ? (n.value.call("set_session_variables", {
                routhPath: e
            }), n.value.call("maximize")) : a === 2 ? f(e) : a === 3 && r()
        }, 2e3),
        p = async () => {
            if (a !== 3)
                if (a == 1) {
                    if (window.LiveChatWidget) return;
                    await w(), n.value = window.LiveChatWidget, await n.value.init(), n.value.call("hide"), n.value.on("visibility_changed", g)
                } else h()
        },
        r = async () => {
            const e = await b({
                antCustomer: "2"
            });
            e.code === "1" && d(e.data.serviceSystemUrl)
        };
    return {
        LiveChatWidget: n,
        onReady: p,
        handleOpen: _,
        handleLoginOpen: v
    }
}
export {
    I as u
};