const i = "data-ar-home-hero-preload";

function c(e) {
    const n = e.trim();
    return !(!n || n.includes(".json"))
}

function f(e, n) {
    if (typeof document > "u") return;
    d(e);
    const o = new Set;
    for (const a of n) {
        const t = typeof a == "string" ? a.trim() : "";
        if (!c(t) || o.has(t)) continue;
        o.add(t);
        const r = document.createElement("link");
        r.rel = "preload", r.as = "image", r.href = t, r.setAttribute(i, e), document.head.appendChild(r)
    }
}

function d(e) {
    typeof document > "u" || document.querySelectorAll(`link[${i}="${e}"]`).forEach(n => n.remove())
}
export {
    d as c, f as r
};