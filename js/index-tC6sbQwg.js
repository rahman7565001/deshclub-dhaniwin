import {b8 as u, a as f, P as _, aT as d, aU as s, aZ as t, ba as c, bb as a, b0 as p, bf as m, n as l, aY as g} from "./index-BgAwOX9Q.js";
const k = {
    key: 0,
    class: "packagePopup"
}
  , b = {
    class: "popup-content"
}
  , v = ["src"]
  , C = u({
    __name: "index",
    setup(h) {
        const {getTransferConfig: n, transferConfig: e} = f();
        async function r() {
            n(e.value, !1)
        }
        function i() {
            l.isInPack() ? l.openExternalUrl(e.value.jumpUrl) : window.open(e.value.jumpUrl, "_blank")
        }
        return _( () => {
            const o = localStorage.getItem("packageTransferConfig");
            o && n(JSON.parse(o))
        }
        ),
        (o, x) => (s(),
        d(m, {
            to: "body"
        }, [a(e).popupImageUrl && a(e).isShowPop ? (s(),
        t("div", k, [p("div", b, [a(e).configType === 1 ? (s(),
        t("div", {
            key: 0,
            class: "popup-close",
            onClick: r
        })) : c("", !0), p("img", {
            src: a(e).popupImageUrl,
            class: "popup_img",
            onClick: i
        }, null, 8, v)])])) : c("", !0)]))
    }
})
  , y = g(C, [["__scopeId", "data-v-dff527a3"]]);
export {y as default};
