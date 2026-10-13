import {
    D as r
} from "./index-BgAwOX9Q.js";
const e = () => r.post("/Withdraw/GetWithdrawBasicInfo"),
    s = t => r.post("/Withdraw/GetUserWithdrawWallet", t),
    i = t => r.post("/Withdraw/AddUserWithdrawWallet", t),
    o = t => r.post("/Withdraw/GetWalletCodeList", t),
    W = t => r.post("/Withdraw/GetWithdrawHistory", t),
    d = t => r.post("/Withdraw/WithdrawApply", t),
    l = () => r.post("/Withdraw/GetArbWalletInfo"),
    n = t => r.post("/Withdraw/ActivityArbWallet", t);
export {
    n as a, l as b, s as c, e as d, i as e, W as f, o as g, d as w
};