import {
    D as r,
    u as se,
    ag as L,
    r as o,
    c as ie,
    E as ce,
    ai as z,
    bl as re,
    n as E
} from "./index-BgAwOX9Q.js";
const ue = () => r.post("/AgentL3/GetMyTeamInfo"),
    me = () => r.post("/AgentL3/GetMyInvitationInfo"),
    le = () => r.post("/AgentL3/GetMySubDataSummry"),
    ve = i => r.post("/AgentL3/GetPageListSubData", i),
    ge = i => r.post("/AgentL3/GetListCommissionRecord", i),
    ye = i => r.post("/AgentL3/GetPageListCommissionDetailRecordByRecharge", i),
    Le = i => r.post("/AgentL3/GetPageListCommissionDetailRecordByBet", i),
    ae = i => r.post("/AgentL3/GetPageListInviteRecord", i),
    fe = i => r.post("/AgentL3/GetPageListInviteTaskRecord", i),
    Te = () => r.post("/AgentL3/ReceiveNotSendCommissionAmount"),
    J = o([0, 0, 0]),
    a = o([]),
    j = o(0);

function Ae() {
    const {
        t: i
    } = se(), f = o(0), T = o([]), R = o(null), A = o(0), I = o(0), C = o(0), p = o(0), w = o({}), h = o([]), k = o(0), S = o(0), M = o(0), P = o(0), b = o(0), D = o(0), G = o(!0), B = o([]), F = o(!0), u = o(""), x = o({}), m = o([]), N = o({
        pageNo: 1,
        pageSize: 10
    }), U = o(0), l = o(0), _ = o(0), K = ie(() => a.value.reduce((e, n) => e + (n.commission || 0), 0)), H = async e => {
        try {
            const {
                code: n,
                data: t
            } = await ge(e);
            n === 0 && (a.value = t || [])
        } catch {}
    }, v = o([]), O = o(0), q = o({
        pageNo: 1,
        pageSize: 10
    }), Q = async (e, n) => {
        const t = {
            bet: Le,
            deposit: ye,
            task: fe,
            invite: ae
        };
        try {
            const {
                code: c,
                data: s
            } = await t[e]({ ...n,
                ...q.value
            });
            c === 0 && (v.value = [...v.value, ...s.list || []], O.value = s.totalCount || 0, j.value = s.totalCommission || 0)
        } catch {}
    }, g = e => {
        var n, t, c;
        T.value = ((n = e == null ? void 0 : e.teamLevelConfig) == null ? void 0 : n.sort((s, y) => s.teamLevel - y.teamLevel)) || [], R.value = (e == null ? void 0 : e.myTeamLevel) || 0, A.value = (e == null ? void 0 : e.myTeamBetAmount) || 0, I.value = (e == null ? void 0 : e.myTeamPeoples) || 0, C.value = (e == null ? void 0 : e.todayRewardAmount) || 0, p.value = (e == null ? void 0 : e.totalRewardAmount) || 0, l.value = (e == null ? void 0 : e.notSendCommissionAmount) || 0, F.value = (e == null ? void 0 : e.autoSendCommission) || !0, f.value = (e == null ? void 0 : e.myTeamLevel) || 0, G.value = e == null ? void 0 : e.isOpenAgentRank, B.value = ((c = (t = e == null ? void 0 : e.externalAgentLinkList) == null ? void 0 : t.filter(s => s.state === 1)) == null ? void 0 : c.sort((s, y) => s.linkIndex - y.linkIndex)) || []
    }, V = async () => {
        L(["getMyTeamInfo"]).then(t => {
            t.getMyTeamInfo && g(t.getMyTeamInfo)
        });
        const {
            code: e,
            data: n
        } = await ue();
        e === 0 && (g(n), z("getMyTeamInfo", n))
    }, W = async e => {
        L(["agentL3Rule"]).then(c => {
            c.agentL3Rule && (u.value = c.agentL3Rule)
        });
        const {
            code: n,
            data: t
        } = await ce({
            type: e || 5
        });
        n === 0 && (u.value = t, z("agentL3Rule", t))
    }, X = e => {
        var n;
        h.value = ((n = e == null ? void 0 : e.inviteTaskConfig) == null ? void 0 : n.sort((t, c) => t.userCount - c.userCount)) || [], k.value = (e == null ? void 0 : e.inviteDayLimitCount) || 0, S.value = (e == null ? void 0 : e.inviteRewardAmount) || 0, M.value = (e == null ? void 0 : e.invitedRewardAmount) || 0, P.value = (e == null ? void 0 : e.myTodayInviteUserCount) || 0, b.value = (e == null ? void 0 : e.myTotalInviteTaskRewardAmount) || 0, D.value = (e == null ? void 0 : e.myTotalInviteUserCount) || 0
    }, Y = async () => {
        const {
            code: e,
            data: n
        } = await me();
        e === 0 && X(n)
    }, Z = async () => {
        const {
            code: e,
            data: n
        } = await le();
        e === 0 && (x.value = n || {})
    }, $ = async e => {
        try {
            const {
                code: n,
                data: t
            } = await ve({ ...e,
                ...N.value
            }), c = e.hierarchy || 1, s = [0, t.totalCount_L1, t.totalCount_L2, t.totalCount_L3];
            n === 0 && (m.value = [...m.value, ...t.list || []], U.value = s[c] || 0, J.value = [s[1] || 0, s[2] || 0, s[3] || 0])
        } catch {}
    }, d = async () => {
        try {
            const {
                code: e,
                data: n
            } = await re({
                rankType: 2
            });
            e === 0 && (w.value = n || [])
        } catch {}
    }, ee = e => {
        E.isInPack() ? ne(e) : oe(e)
    };
    async function ne(e) {
        E.openExternalUrl(e)
    }
    async function oe(e) {
        try {
            window.location.href = e
        } catch {
            window.open(e, "_blank")
        }
    }
    const te = async () => {
        const {
            code: e,
            data: n
        } = await Te();
        e === 0 && (l.value = 0, _.value = (n == null ? void 0 : n.receivedAmount) || 0)
    };
    return L(["getMyTeamInfo"]).then(e => {
        e.getMyTeamInfo && g(e.getMyTeamInfo)
    }), {
        myTeamInfo: T,
        myTeamLevel: R,
        myTeamBetAmount: A,
        todayRewardAmount: C,
        totalRewardAmount: p,
        shareLinks: B,
        rule: u,
        inviteTaskConfig: h,
        inviteDayLimitCount: k,
        inviteRewardAmount: S,
        invitedRewardAmount: M,
        myTeamPeoples: I,
        myTodayInviteUserCount: P,
        myTotalInviteTaskRewardAmount: b,
        myTotalInviteUserCount: D,
        subordinateData: x,
        subordinateList: m,
        subordinatePage: N,
        subordinateTotal: U,
        levelData: J,
        commissionRecordList: a,
        commissionRecordTotal: K,
        otherList: v,
        otherPage: q,
        otherTotal: O,
        otherCommissionTotal: j,
        myRank: w,
        activeTab: f,
        autoSendCommission: F,
        notSendCommissionAmount: l,
        receivedAmount: _,
        isOpenAgentRank: G,
        jump: ee,
        getAgentRankRecordFn: d,
        getOtherList: Q,
        getCommissionRecordList: H,
        getSubordinateData: Z,
        getSubordinateList: $,
        getMyTeamInfoFn: V,
        getFrontdeskProtocolFn: W,
        getMyInvitationInfoFn: Y,
        receiveNotSendCommissionAmountFun: te
    }
}
export {
    Ae as u
};