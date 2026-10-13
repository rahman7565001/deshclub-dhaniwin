import {
    D as r
} from "./index-BgAwOX9Q.js";
const a = e => r.post("/Recharge/GetRechargeCategoryList", e),
    c = e => r.post("/Recharge/GetRechargeRecord", e),
    s = e => r.post("/Recharge/GetLocalRechargeOrderDetail", e),
    o = e => r.post("/Recharge/SubmitCertificate", e),
    g = e => r.post("/Recharge/CancelLocalRecharge", e),
    n = e => r.post("/Recharge/DepositRecharge", e),
    i = e => r.post("/Recharge/GoodsDepositRecharge", e),
    R = e => r.post("/Recharge/ArUpiGetBankListToken", e),
    h = e => r.post("/Recharge/CreateRechargeOrderAppeal", e),
    p = e => r.post("/Recharge/ArUpiCancelRechargeOrder", e),
    u = e => r.post("/Recharge/GetArUpiOnGoingOrder", e),
    d = e => r.post("/Recharge/ArUpiSubmitUtr", e),
    l = e => r.post("/Recharge/ArBuriedPage", e),
    G = () => r.post("/Recharge/GetRechargeBasicInfo");
export {
    c as a, p as b, h as c, R as d, n as e, u as f, G as g, a as h, i, d as j, g as k, s as l, l as m, o as s
};