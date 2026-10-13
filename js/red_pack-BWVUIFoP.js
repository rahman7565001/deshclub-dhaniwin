import {u as K, ch as U, r, Y as X, c as m, ci as z, cj as Q, ck as V, q as Z} from "./index-BgAwOX9Q.js";
import {u as ee} from "./useWorkerIntervalFn.hook-D7_aQ0_N.js";
const se = (o, l) => {
    const E = performance.now();
    let d;
    const f = D => {
        D - E >= l ? o() : d = requestAnimationFrame(f)
    }
    ;
    return d = requestAnimationFrame(f),
    () => cancelAnimationFrame(d)
}
;
var _ = (o => (o.BEFORE_PREHEAT = "before_preheat",
o.PREHEAT = "preheat",
o.COUNTDOWN = "countdown",
o.RAINING = "raining",
o.ENDED = "ended",
o))(_ || {});
const ae = r({
    7089: "This round of red envelopes has been claimed out",
    7090: "Exceeded the activity claim limit",
    7091: "Exceeded the activity claim amount limit",
    7092: "Exceeded the claim amount limit for this round",
    7093: "Available claim amount is less than the minimum amount",
    7094: "Exceeded the claim limit for this round",
    7095: "This round of red envelopes has not started",
    7096: "The balance of this red envelope rain is insufficient"
})
  , h = r(!1)
  , i = r(!1)
  , b = r(!1)
  , x = "ar_cashRain_limit_status"
  , c = r(1)
  , S = r(!1)
  , C = r(!1)
  , k = r(0)
  , y = r()
  , t = r(null)
  , v = r(0)
  , g = r(0);
function re(o) {
    const {t: l} = K()
      , E = X({
        fallSpeed: [5, 6],
        spawnInterval: 200,
        columns: 6,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,
        scaleRange: [.8, 1],
        rotationSpeedRange: [-.05, .05],
        imageSrc: o,
        boundaries: [60, 60, 0, 0]
    })
      , d = () => {
        c.value = 1
    }
      , f = async () => {
        if (Q())
            try {
                const e = await V();
                if (e.code === 0)
                    if (e.data)
                        t.value = e.data,
                        v.value = (e == null ? void 0 : e.serverTime) ?? (e == null ? void 0 : e.serviceTime) ?? Date.now(),
                        g.value = Date.now(),
                        c.value = 1;
                    else {
                        t.value = null,
                        S.value = !1,
                        h.value = !1,
                        w();
                        return
                    }
                if (!t.value)
                    return;
                const a = t.value;
                if (a.roundId != null && a.totalRoundCount != null && a.roundId > a.totalRoundCount) {
                    h.value = !1,
                    i.value = !1,
                    S.value = !0,
                    I();
                    return
                }
                a && a.cashRainConfigId && a.roundId && (F(a.cashRainConfigId, a.roundId) && (h.value = !1,
                i.value = !1,
                S.value = !1,
                C.value = !1),
                M())
            } catch {}
    }
      , D = U(async () => {
        var e, a;
        try {
            if (!t.value)
                return;
            const {code: n, data: s, msg: u, msgCode: P} = await z({
                cashRainConfigId: t.value.cashRainConfigId,
                roundId: t.value.roundId
            });
            return n === 0 ? (k.value = Math.round((k.value + Number(s)) * 100) / 100,
            {
                success: !0,
                amount: s
            }) : (b.value = !0,
            p(((e = t.value) == null ? void 0 : e.cashRainConfigId) || 0, ((a = t.value) == null ? void 0 : a.roundId) || 0, !0),
            {
                success: !1,
                message: P ? ae.value[P] : u,
                hasReachedLimit: !0
            })
        } catch {}
    }
    , 500)
      , F = (e, a) => {
        const n = sessionStorage.getItem(x);
        if (n) {
            const {cashRainConfigId: s, roundId: u} = JSON.parse(n);
            if (s === e && u === a)
                return !1
        }
        return b.value = !1,
        p(e, a, !1),
        !0
    }
      , R = () => {
        const e = sessionStorage.getItem(x);
        if (e) {
            const {hasReachedLimit: a} = JSON.parse(e);
            return a
        }
        return !1
    }
      , p = (e, a, n) => {
        const s = {
            cashRainConfigId: e,
            roundId: a,
            hasReachedLimit: n
        };
        sessionStorage.setItem(x, JSON.stringify(s))
    }
      , T = () => {
        if (!t.value)
            return "before_preheat";
        c.value;
        const e = v.value + Math.max(0, Date.now() - g.value)
          , {startPreheatTime: a=0, startCountdownTime: n=0, startTime: s=0, endTime: u=0} = t.value;
        return e < a ? "before_preheat" : e >= a && e < n ? "preheat" : e >= n && e < s ? "countdown" : e >= s && e < u ? "raining" : "ended"
    }
      , O = m( () => {
        if (!t.value)
            return 0;
        c.value;
        const e = v.value + Math.max(0, Date.now() - g.value)
          , {endTime: a=0} = t.value
          , n = Math.floor((a - e) / 1e3);
        return n > 0 ? n : 0
    }
    )
      , N = m( () => {
        if (!t.value)
            return "";
        const {startTime: e=0} = t.value;
        return Z(e, "HH:mm")
    }
    )
      , A = m( () => {
        if (!t.value)
            return "00:00";
        c.value;
        const {startTime: e=0} = t.value
          , a = v.value + Math.max(0, Date.now() - g.value)
          , n = Math.max(0, e - a);
        return W(n)
    }
    )
      , H = m( () => {
        if (!t.value)
            return null;
        switch (T()) {
        case "preheat":
            return l("t1398", {
                time: N.value
            });
        case "countdown":
            return l("t1399", {
                time: A.value
            });
        case "raining":
            return l("t922");
        default:
            return l("t1400")
        }
    }
    )
      , L = m( () => {
        if (!t.value)
            return !1;
        const e = T();
        return e === "preheat" || e === "countdown" || e === "raining"
    }
    )
      , W = e => {
        if (e <= 0)
            return "00:00";
        const a = Math.floor(e / 1e3)
          , n = Math.floor(a / 60)
          , s = a % 60;
        return `${n.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }
      , q = () => {
        h.value = !1,
        i.value = !1,
        k.value = 0
    }
      , J = () => {
        if (!t.value || R())
            return !0;
        const {endTime: e=0} = t.value;
        return (v.value ? v.value + Math.max(0, Date.now() - g.value) : Date.now()) >= e
    }
      , j = async () => {
        var e;
        !t.value || i.value || (await ((e = y.value) == null ? void 0 : e.startRedPackRain()),
        i.value = !0,
        S.value = !0)
    }
      , w = () => {
        var e;
        I(),
        i.value = !1,
        c.value = 1,
        C.value = !1,
        (e = y.value) == null || e.stopRedPackRain()
    }
      , G = () => {
        var a, n, s, u;
        switch (T()) {
        case "preheat":
            (R() == !0 || R() == null || R() == null) && p(((a = t.value) == null ? void 0 : a.cashRainConfigId) || 0, ((n = t.value) == null ? void 0 : n.roundId) || 0, !1);
            break;
        case "countdown":
            Y();
            break;
        case "raining":
            $();
            break;
        case "ended":
            p(((s = t.value) == null ? void 0 : s.cashRainConfigId) || 0, ((u = t.value) == null ? void 0 : u.roundId) || 0, !0),
            B();
            break
        }
    }
      , Y = async () => {
        C.value || (C.value = !0,
        await f(),
        d())
    }
      , $ = () => {
        i.value && J() && w()
    }
      , B = () => {
        w()
    }
      , {pause: I, start: M} = ee(async () => {
        if (c.value += 1,
        !t.value) {
            I();
            return
        }
        G()
    }
    , 1e3, {
        immediate: !0
    });
    return {
        cashRainInfoData: t,
        displayText: H,
        startTimeText: N,
        countdownText: A,
        TimePhase: _,
        hasTriggered: h,
        isRunning: i,
        hasReachedCurrentRoundLimit: b,
        remainingDuration: O,
        shouldShowRedPackTag: L,
        rainConfig: E,
        canvasComponentRef: y,
        totalRoundAmount: k,
        syncServerTime: d,
        fetchCashRainData: f,
        claimRedPack: D,
        getCurrentTimePhase: T,
        resetState: q,
        startRedPackRain: j,
        stopRedPackRain: w,
        pauseTimer: I,
        startTimer: M
    }
}
const oe = "/images/red_pack-CnXS5jgk.webp";
export {re as a, oe as r, se as u};
