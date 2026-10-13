import {
    b8 as c,
    aZ as a,
    aU as t,
    be as i,
    aT as l,
    b0 as r,
    a$ as p,
    bb as d,
    b1 as m
} from "./index-BgAwOX9Q.js";
const _ = "/images/empty-bg-CagnIzRR.webp",
    h = ["src"],
    y = {
        class: "data-text"
    },
    f = c({
        __name: "index",
        props: {
            text: {
                default: ""
            },
            type: {
                default: "empty_norecord"
            },
            width: {
                default: 200
            },
            height: {
                default: 200
            }
        },
        setup(s) {
            const e = s;
            return (n, g) => {
                const o = p;
                return t(), a("div", {
                    class: "no-data",
                    style: i({
                        "--width": e.width,
                        "--height": e.height
                    })
                }, [e.type === "empty_noreward" ? (t(), l(o, {
                    key: 0,
                    class: "data-icon",
                    name: e.type
                }, null, 8, ["name"])) : (t(), a("img", {
                    key: 1,
                    class: "data-icon",
                    src: d(_),
                    alt: ""
                }, null, 8, h)), r("p", y, m(e.text || n.$t("t781")), 1)], 4)
            }
        }
    });
export {
    f as _
};