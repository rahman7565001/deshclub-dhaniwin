import {
    aY as e,
    aZ as t,
    aU as a,
    b0 as o,
    bh as r
} from "./index-BgAwOX9Q.js";
const c = "/assets/d1-BcK6vZoZ.mp3",
    i = "/assets/d2-DpfFojGs.mp3",
    n = {};

function p(d, s) {
    return a(), t(r, null, [s[0] || (s[0] = o("audio", {
        id: "voice1"
    }, [o("source", {
        src: c,
        type: "audio/mpeg"
    })], -1)), s[1] || (s[1] = o("audio", {
        id: "voice2"
    }, [o("source", {
        src: i,
        type: "audio/mpeg"
    })], -1))], 64)
}
const u = e(n, [
    ["render", p]
]);
export {
    u as a
};