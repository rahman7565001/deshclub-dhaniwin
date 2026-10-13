import {
    u as m
} from "./use-placeholder-DpWtpWbS.js";
import {
    b8 as D,
    bA as s,
    bp as A,
    bm as I,
    O as l,
    bX as f,
    bY as R,
    bZ as C,
    bq as w,
    r as P,
    ar as L
} from "./index-BgAwOX9Q.js";
const [N, t] = I("nav-bar"), S = {
    title: String,
    fixed: Boolean,
    zIndex: A,
    border: s,
    leftText: String,
    rightText: String,
    leftDisabled: Boolean,
    rightDisabled: Boolean,
    leftArrow: Boolean,
    placeholder: Boolean,
    safeAreaInsetTop: Boolean,
    clickable: s
};
var O = D({
    name: N,
    props: S,
    emits: ["clickLeft", "clickRight"],
    setup(e, {
        emit: r,
        slots: a
    }) {
        const n = P(),
            d = m(n, t),
            o = i => {
                e.leftDisabled || r("clickLeft", i)
            },
            b = i => {
                e.rightDisabled || r("clickRight", i)
            },
            h = () => a.left ? a.left() : [e.leftArrow && l(w, {
                class: t("arrow"),
                name: "arrow-left"
            }, null), e.leftText && l("span", {
                class: t("text")
            }, [e.leftText])],
            g = () => a.right ? a.right() : l("span", {
                class: t("text")
            }, [e.rightText]),
            c = () => {
                const {
                    title: i,
                    fixed: x,
                    border: u,
                    zIndex: v
                } = e, B = R(v), T = e.leftArrow || e.leftText || a.left, k = e.rightText || a.right;
                return l("div", {
                    ref: n,
                    style: B,
                    class: [t({
                        fixed: x
                    }), {
                        [C]: u,
                        "van-safe-area-top": e.safeAreaInsetTop
                    }]
                }, [l("div", {
                    class: t("content")
                }, [T && l("div", {
                    class: [t("left", {
                        disabled: e.leftDisabled
                    }), e.clickable && !e.leftDisabled ? f : ""],
                    onClick: o
                }, [h()]), l("div", {
                    class: [t("title"), "van-ellipsis"]
                }, [a.title ? a.title() : i]), k && l("div", {
                    class: [t("right", {
                        disabled: e.rightDisabled
                    }), e.clickable && !e.rightDisabled ? f : ""],
                    onClick: b
                }, [g()])])])
            };
        return () => e.fixed && e.placeholder ? d(c) : c()
    }
});
const _ = L(O);
export {
    _ as N
};