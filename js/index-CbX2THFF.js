import {
    by as s,
    aw as o,
    bz as i
} from "./index-BgAwOX9Q.js";
const t = s.create({
    baseURL: "https://apiweb.arbpay.me",
    timeout: 3e4
});
t.interceptors.request.use(e => {
    const a = e.data;
    return a && Object.keys(a).forEach(r => {
        a[r] === "" && delete a[r]
    }), e.method === "post" && (e.data = { ...e.data,
        token: localStorage.getItem("ar_p_t") || ""
    }), e.method === "get" && (e.params = { ...e.params,
        token: localStorage.getItem("ar_p_t") || ""
    }), e
}, e => Promise.reject(e));
t.interceptors.response.use(e => {
    const {
        data: a,
        config: r,
        status: n
    } = e;
    return r.method === "put" && n === 200 ? (o("Upload Successful"), !0) : a
}, e => (i("Please contact customer service."), Promise.reject(e)));

function u(e) {
    return t.post("/ar-wallet/v4/apiCenter/payWithoutUtr", e)
}

function c(e) {
    return t.post("/ar-wallet/v4/apiCenter/subUtr", e)
}

function l(e) {
    return t.post("/ar-wallet/v4/apiCenter/status", e)
}

function m(e) {
    return t.get("/ar-wallet/v4/apiCenter/fetchThirdPartyRechargePageInfoEncryption")
}

function f(e) {
    return t.post("/ar-wallet/v4/apiCenter/noPay", e)
}

function y(e) {
    return t.get("/ar-wallet/signUp/getCurrentCustomerServiceSystem", {
        params: e
    })
}

function w(e) {
    return t.post("/ar-wallet/v4/apiCenter/submitRechargeAppeal", e)
}

function v(e) {
    return t.post("/ar-wallet/v4/apiCenter/rechargeAppealExist", e)
}

function C(e) {
    return t.post("/ar-wallet/v4/apiCenter/getBanks/forBuyAppeal", e)
}

function h(e) {
    return t.post("/ar-wallet/v4/apiCenter/sendOtp", e)
}

function g(e) {
    return t.post("/ar-wallet/v4/apiCenter/verifyOtp", e)
}

function d(e) {
    return t.post("/ar-wallet/v4/apiCenter/confirmPayment", e)
}

function b(e) {
    return t.post("/ar-wallet/v4/apiCenter/onPaymentPageExit", e)
}

function P(e) {
    return t.post("/ar-wallet/v4/apiCenter/cancellationReasonList", e)
}

function S(e) {
    return t.post("/ar-wallet/v4/apiCenter/subForWakeUp", e)
}
export {
    y as C, C as G, h as K, v as R, w as S, P as a, u as b, f as c, g as d, c as e, l as f, b as g, d as h, t as i, m as p, S as s
};