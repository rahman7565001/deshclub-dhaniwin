function d(o, e) {
    let t, n, r = !1;

    function a(s) {
        t || (t = s), s - t >= e && (o(), t = s), r || (n = requestAnimationFrame(a))
    }
    n = requestAnimationFrame(a);

    function c() {
        r = !0, cancelAnimationFrame(n)
    }
    return c
}

function l(o) {
    const e = document.createElement("textarea");
    e && (e.innerHTML = o || "");
    const t = e.value;
    return e && (e.innerHTML = t || ""), e.value
}

function u(o, e = "YYYY-MM-DD HH:mm:ss") {
    const t = new Date(o),
        n = a => String(a).padStart(2, "0"),
        r = {
            YYYY: String(t.getFullYear()),
            MM: n(t.getMonth() + 1),
            DD: n(t.getDate()),
            HH: n(t.getHours()),
            mm: n(t.getMinutes()),
            ss: n(t.getSeconds())
        };
    return e.replace(/YYYY|MM|DD|HH|mm|ss/g, a => r[a])
}
const m = o => {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(o).then(() => {}).catch(e => {});
    else {
        const e = document.createElement("textarea");
        e.value = o, e.style.position = "fixed", e.style.left = "-999999px", document.body.appendChild(e), e.select();
        try {
            document.execCommand("copy")
        } catch {}
        document.body.removeChild(e)
    }
};
export {
    m as c, l as d, u as f, d as u
};