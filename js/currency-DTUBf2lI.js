const f = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    BRL: "R$",
    INR: "₹",
    PKR: "₨",
    NPR: "₨",
    BDT: "৳",
    VND: "₫",
    IDR: "Rp",
    MYR: "RM",
    THB: "฿",
    PHP: "₱",
    RUB: "₽",
    CNY: "¥",
    JPY: "¥",
    KRW: "₩",
    AED: "AED",
    SAR: "SAR"
}
  , l = {
    en: "USD",
    es: "EUR",
    pt: "BRL",
    hi: "INR",
    bn: "BDT",
    ur: "PKR",
    vi: "VND",
    id: "IDR",
    ms: "MYR",
    th: "THB",
    ru: "RUB",
    zh: "CNY"
};
function D(t, e) {
    return Math.floor(Math.random() * e) + t
}
const p = () => {
    const t = (localStorage.getItem("language") || "en").toLowerCase()
      , e = t.split("-")[0]
      , n = l[t] || l[e] || "USD";
    return f[n] || ""
}
  , R = (t="") => {
    const e = String(t || "").trim();
    if (!e)
        return sessionStorage.getItem("dollarSign") || p();
    const n = e.toUpperCase();
    return f[n] || e
}
  , S = (t, e) => {
    let n = "";
    t >= 1e6 ? n = (t / 1e6).toFixed(1).replace(/\.0$/, "") + "M" : t >= 1e3 ? n = (t / 1e3).toFixed(1).replace(/\.0$/, "") + "K" : n = t + "";
    const o = R();
    return typeof e == "boolean" && e ? o + n : typeof e == "string" ? R(e) + n : n
}
  , C = (t, e="", n=2) => {
    const o = /(\d{3})(?=\d)/g;
    if (t = parseFloat(t),
    !isFinite(t) || !t && t !== 0)
        return "";
    typeof e == "string" ? e = R(e) : e = "",
    n = n ?? 2;
    const r = Math.abs(t).toFixed(n)
      , s = n ? r.slice(0, -1 - n) : r
      , i = s.length % 3
      , g = i > 0 ? s.slice(0, i) + (s.length > 3 ? "," : "") : ""
      , a = n ? r.slice(-1 - n) : ""
      , c = t < 0 ? "-" : "";
    return localStorage.getItem("language") == "vi" ? c + g + s.slice(i).replace(o, "$1,") + a + e : c + e + g + s.slice(i).replace(o, "$1,") + a
}
  , u = (t, e="", n=2) => C(t, e, n).replace(/(\.\d*?)0+$|(\.0+)$/, "$1").replace(/\.$/, "")
  , E = (t, e=2) => {
    const n = /(\d{3})(?=\d)/g;
    if (t = parseFloat(t),
    !isFinite(t) || !t && t !== 0)
        return "";
    e = e ?? 2;
    const o = Math.abs(t).toFixed(e)
      , r = e ? o.slice(0, -1 - e) : o
      , s = r.length % 3
      , i = s > 0 ? r.slice(0, s) + (r.length > 3 ? "," : "") : ""
      , g = e ? o.slice(-1 - e) : "";
    return (t < 0 ? "-" : "") + i + r.slice(s).replace(n, "$1,") + g
}
;
export {S as a, E as b, C as c, u as f, D as g};
