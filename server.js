const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const PHP_PORT = 8080;
const DOC_ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

function serveFile(res, filePath, contentType) {
  const isHtml = contentType.includes('text/html');
  const isJs = contentType.includes('javascript') || contentType.includes('json');
  const cacheControl = (isHtml || isJs) ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400';
  res.writeHead(200, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': cacheControl,
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  fs.createReadStream(filePath).pipe(res);
}

function proxyToPhp(req, res) {
  const clientHost = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
  const clientProto = req.headers['x-forwarded-proto'] || (req.connection && req.connection.encrypted ? 'https' : 'http');
  const options = {
    hostname: '127.0.0.1',
    port: PHP_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${PHP_PORT}`,
      'x-forwarded-host': clientHost,
      'x-forwarded-proto': clientProto
    }
  };

  const phpReq = http.request(options, phpRes => {
    res.writeHead(phpRes.statusCode, phpRes.headers);
    phpRes.pipe(res);
  });

  phpReq.on('error', err => {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ code: -1, msg: 'PHP backend error: ' + err.message }));
  });

  req.pipe(phpReq);
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle CORS OPTIONS preflight immediately
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    });
    return res.end();
  }

  // Fast path for recharge categories so page renders instantaneously
  if (/GetRechargeCategoryList/i.test(pathname)) {
    const categoriesPayload = {
      code: 0,
      msg: 'Succeed',
      msgCode: 0,
      serverTime: Date.now(),
      data: [
        {
          id: 400102,
          name: 'Bkash',
          rechargeType: 'LocalUPI',
          state: 1,
          sort: 1,
          iconUrl: '/img/6006/bankLogo/bkash.svg',
          selectedIconUrl: '/img/6006/bankLogo/bkash.svg',
          rate: 1,
          minAmount: 100,
          maxAmount: 25000,
          accountName: '',
          accountValue: '01700000000',
          qrText: '',
          rechargeGiftRatio: { giftRatioType: 3, scaleType: 1, uniformRatioData: null, intervalRatioList: null },
          quickConfigList: [
            { rechargeAmount: 100, giftAmount: 0 },
            { rechargeAmount: 200, giftAmount: 0 },
            { rechargeAmount: 300, giftAmount: 0 },
            { rechargeAmount: 500, giftAmount: 0 },
            { rechargeAmount: 1000, giftAmount: 0 },
            { rechargeAmount: 2000, giftAmount: 0 },
            { rechargeAmount: 3000, giftAmount: 0 },
            { rechargeAmount: 5000, giftAmount: 0 },
            { rechargeAmount: 10000, giftAmount: 0 },
            { rechargeAmount: 20000, giftAmount: 0 }
          ],
          giftRatioType: 0,
          giftAmount: 0,
          isUsedArUpiRechargeAmount: false
        },
        {
          id: 400103,
          name: 'Nagad',
          rechargeType: 'LocalUPI',
          state: 1,
          sort: 2,
          iconUrl: '/img/6006/bankLogo/nagad.svg',
          selectedIconUrl: '/img/6006/bankLogo/nagad.svg',
          rate: 1,
          minAmount: 100,
          maxAmount: 25000,
          accountName: '',
          accountValue: '01800000000',
          qrText: '',
          rechargeGiftRatio: { giftRatioType: 3, scaleType: 1, uniformRatioData: null, intervalRatioList: null },
          quickConfigList: [
            { rechargeAmount: 100, giftAmount: 0 },
            { rechargeAmount: 200, giftAmount: 0 },
            { rechargeAmount: 300, giftAmount: 0 },
            { rechargeAmount: 500, giftAmount: 0 },
            { rechargeAmount: 1000, giftAmount: 0 },
            { rechargeAmount: 2000, giftAmount: 0 },
            { rechargeAmount: 3000, giftAmount: 0 },
            { rechargeAmount: 5000, giftAmount: 0 },
            { rechargeAmount: 10000, giftAmount: 0 },
            { rechargeAmount: 20000, giftAmount: 0 }
          ],
          giftRatioType: 0,
          giftAmount: 0,
          isUsedArUpiRechargeAmount: false
        }
      ]
    };
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, X-Requested-With',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    return res.end(JSON.stringify(categoriesPayload));
  }

  // Fast path for recharge basic info
  if (/GetRechargeBasicInfo/i.test(pathname)) {
    const basicPayload = {
      code: 0,
      msg: 'Succeed',
      msgCode: 0,
      serverTime: Date.now(),
      data: {
        gameSaasBalance: [
          { vendorCode: 'ARGame', balance: 0, currency: 'BDT', tenantId: 6006, userId: 599822 },
          { vendorCode: 'PlatForm', balance: 0, currency: 'BDT', tenantId: 6006, userId: 599822 }
        ],
        goodsList: [],
        advisementList: [],
        onGoingOrder: null,
        amountCoding: 0,
        classicBonusDetails: null
      }
    };
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, X-Requested-With',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    return res.end(JSON.stringify(basicPayload));
  }

  // Fast path for withdraw basic info so withdraw page renders instantaneously with bKash, Nagad, UPI, BankCard
  if (/GetWithdrawBasicInfo/i.test(pathname)) {
    const withdrawBasicPayload = {
      code: 0,
      msg: 'Succeed',
      msgCode: 0,
      serverTime: Date.now(),
      data: {
        balance: 4.45,
        realName: 'MemberBE170952',
        amountCoding: 0.0,
        hasWithdrawPassword: false,
        withdrawCategoryList: [
          {
            id: 400085,
            tenantId: 6006,
            withdrawType: 'BKASH',
            name: 'bKash',
            iconUrl: '/img/6006/bankLogo/bkash.svg',
            selectedIconUrl: '/img/6006/bankLogo/bkash.svg',
            userMaxBindCount: 5,
            maxWithdrawTimes: 10,
            minAmount: 100.0,
            maxAmount: 25000.0,
            feeAmountRangeMin: 0.0,
            feeAmountRangeMax: 0.0,
            feeType: 0,
            feePercent: 0.0,
            fee: 0.0,
            allowStartTime: '00:00',
            allowEndTime: '23:59',
            sort: 200,
            state: 1
          },
          {
            id: 400086,
            tenantId: 6006,
            withdrawType: 'NAGAD',
            name: 'Nagad',
            iconUrl: '/img/6006/bankLogo/nagad.svg',
            selectedIconUrl: '/img/6006/bankLogo/nagad.svg',
            userMaxBindCount: 5,
            maxWithdrawTimes: 10,
            minAmount: 100.0,
            maxAmount: 25000.0,
            feeAmountRangeMin: 0.0,
            feeAmountRangeMax: 0.0,
            feeType: 0,
            feePercent: 0.0,
            fee: 0.0,
            allowStartTime: '00:00',
            allowEndTime: '23:59',
            sort: 150,
            state: 1
          },
          {
            id: 400080,
            tenantId: 6006,
            withdrawType: 'UPI',
            name: 'UPI / Mobile Banking',
            iconUrl: '/img/6006/bankLogo/115634796-38755-file_20260511115634703.webp',
            selectedIconUrl: '/img/6006/bankLogo/115636400-38756-file_20260511115636396.webp',
            userMaxBindCount: 5,
            maxWithdrawTimes: 10,
            minAmount: 100.0,
            maxAmount: 50000.0,
            feeAmountRangeMin: 0.0,
            feeAmountRangeMax: 0.0,
            feeType: 0,
            feePercent: 0.0,
            fee: 0.0,
            allowStartTime: '00:00',
            allowEndTime: '23:59',
            sort: 100,
            state: 1
          },
          {
            id: 400078,
            tenantId: 6006,
            withdrawType: 'BankCard',
            name: 'Bank Card',
            iconUrl: '/img/6006/bankLogo/053755188-34816-file_20260502173755187.webp',
            selectedIconUrl: '/img/6006/bankLogo/053757456-34817-file_20260502173757455.webp',
            userMaxBindCount: 5,
            maxWithdrawTimes: 10,
            minAmount: 100.0,
            maxAmount: 50000.0,
            feeAmountRangeMin: 0.0,
            feeAmountRangeMax: 0.0,
            feeType: 0,
            feePercent: 0.0,
            fee: 0.0,
            allowStartTime: '00:00',
            allowEndTime: '23:59',
            sort: 50,
            state: 1
          }
        ],
        addWalletNeedEmailVerifyCode: false,
        addWalletNeedSmsVerifyCode: false,
        userTodayWithdrawFreeCount: 5,
        userTodayWithdrawAmount: -1.0,
        userTodayWithdrawCount: -1,
        isWithdrawAmountFixed: false,
        fixedWithdrawAmountList: [],
        isWithdrawAmountAllowInput: true,
        pendingCompensationAmount: 0.0,
        isNeedWithdrawPassword: false
      }
    };
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, X-Requested-With',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    return res.end(JSON.stringify(withdrawBasicPayload));
  }

  // Fast path for DepositRecharge to ensure instant sub-millisecond response without PHP server queueing
  if (/(?:DepositRecharge|RechargeToPay)/i.test(pathname)) {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', () => {
      let parsed = {};
      try { parsed = JSON.parse(bodyStr || '{}'); } catch(e){}
      const amount = Number(parsed.amount || parsed.rechargeAmount || 100);
      const catId = Number(parsed.rechargeCategoryId || parsed.categoryId || 400102);
      const isBkash = catId === 400102;
      const methodName = isBkash ? 'Bkash' : 'Nagad';
      const accountValue = isBkash ? '01700000000' : '01800000000';
      const orderNo = 'PAY' + (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, 14) + Math.floor(1000 + Math.random() * 9000);
      const createTime = Date.now();

      // Forward to PHP in background so order is recorded into SQLite recharge_orders table
      const forwardPayload = JSON.stringify({ ...parsed, orderNo: orderNo, amount: amount, rechargeCategoryId: catId });
      const backgroundReq = http.request({
        hostname: '127.0.0.1',
        port: PHP_PORT,
        path: '/api/Recharge/DepositRecharge',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(forwardPayload)
        }
      }, () => {});
      backgroundReq.on('error', () => {});
      backgroundReq.write(forwardPayload);
      backgroundReq.end();

      const clientHost = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
      const clientProto = req.headers['x-forwarded-proto'] || (req.connection && req.connection.encrypted ? 'https' : 'http');
      const detailPath = '/pay/?orderNo=' + encodeURIComponent(orderNo) + '&amount=' + encodeURIComponent(amount) + '&catId=' + encodeURIComponent(catId);
      const redirectUrl = `${clientProto}://${clientHost}${detailPath}`;

      const payload = {
        code: 0,
        msg: 'Succeed',
        msgCode: 0,
        serverTime: createTime,
        data: {
          merchantOrderNo: orderNo,
          rechargeNumber: orderNo,
          createTime: createTime,
          redirectUrl: redirectUrl,
          scanCodePay: false,
          amount: amount,
          originAmount: amount,
          status: 'Pending',
          rechargeType: 'LocalUPI',
          rechargeChannelId: catId,
          rechargeChannelName: methodName,
          methodName: methodName,
          accountName: '',
          accountValue: accountValue,
          qrText: '',
          upiId: accountValue,
          expireTime: createTime + 900000,
          expiredTime: createTime + 900000
        }
      };

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, X-Requested-With',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(JSON.stringify(payload));
    });
    return;
  }

  // 1. Lottery draw endpoints, dynamic API routes & manual Pay gateway -> Forward to PHP
  const isApi = /^\/(?:(?:webapi|api)\/)?(?:Recharge|Withdraw|Activity|User|Home|Game|Lottery|ThirdGame|VipLevel|AgentRebate|WorkOrder)(?:\/|$)/i.test(pathname);
  const isDraw = /^\/webapi\/(?:kv|v)\/issue\//i.test(pathname) || /^\/(?:WinGo|K3|D5|MotoRace|TrxWinGo)\/.*\.json$/i.test(pathname);
  const isAdmin = /^\/admin(?:\/|$)/i.test(pathname);
  const isPay = /^\/pay(?:\/|$)/i.test(pathname);
  const isAviator = /^\/aviator(?:\/|$)/i.test(pathname);
  const isChicken = /^\/chicken(?:\/|$)/i.test(pathname);
  const isJdb = /^\/jdb(?:\/|$)/i.test(pathname);
  const isMines = /^\/mines(?:\/|$)/i.test(pathname);
  const isCard365 = /^\/card365(?:\/|$)/i.test(pathname);
  const isJackpotFishing = /^\/(?:jackpot_fishing|fishing)(?:\/|$)/i.test(pathname);
  const isRoulette = /^\/roulette(?:\/|$)/i.test(pathname);
  const isSpaceDice = /^\/space_dice(?:\/|$)/i.test(pathname);
  const isPlinko = /^\/plinko(?:\/|$)/i.test(pathname);
  const isGame = /^\/game(?:\/|$)/i.test(pathname);
  const isPhp = /\.php$/i.test(pathname);
  const isGenericApi = /^\/api\//i.test(pathname) || (/^\/webapi\//i.test(pathname) && !/^\/webapi\/(?:kv|v)\/(?:config|firebaseConfig)\.js$/i.test(pathname));

  if (isApi || isDraw || isAdmin || isPay || isAviator || isChicken || isJdb || isMines || isCard365 || isJackpotFishing || isRoulette || isSpaceDice || isPlinko || isGame || isPhp || isGenericApi) {
    return proxyToPhp(req, res);
  }

  // 2. config fallback
  if (pathname === '/webapi/v/config.js') {
    pathname = '/webapi/kv/config.js';
  }
  if (pathname === '/webapi/v/firebaseConfig.js') {
    pathname = '/webapi/kv/firebaseConfig.js';
  }

  // 3. Static files
  if (/(?:052326529|052328901)/i.test(pathname)) {
    return serveFile(res, path.join(DOC_ROOT, 'img', '6006', 'bankLogo', 'bkash.svg'), 'image/svg+xml');
  }
  if (/(?:052212261|052214587)/i.test(pathname)) {
    return serveFile(res, path.join(DOC_ROOT, 'img', '6006', 'bankLogo', 'nagad.svg'), 'image/svg+xml');
  }

  let targetPath = path.join(DOC_ROOT, pathname);
  const ext = path.extname(targetPath).toLowerCase();

  if (ext && mimeTypes[ext]) {
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
      return serveFile(res, targetPath, mimeTypes[ext]);
    }

    // Asset fallback candidates
    const candidates = [
      path.join(DOC_ROOT, '0', pathname),
      path.join(DOC_ROOT, '6006', pathname),
      path.join(DOC_ROOT, 'pro-img.arsaaspub.com', pathname),
      path.join(DOC_ROOT, 'img', pathname),
      path.join(DOC_ROOT, 'assets', pathname),
      path.join(DOC_ROOT, 'images', pathname),
      path.join(DOC_ROOT, 'draw.ar-lottery01.com', pathname)
    ];

    const stripped = pathname.replace(/^\/(?:img|images|assets|pro-img\.arsaaspub\.com|0|6006)\//i, '/');
    if (stripped !== pathname) {
      candidates.push(path.join(DOC_ROOT, stripped));
      candidates.push(path.join(DOC_ROOT, 'img', stripped));
      candidates.push(path.join(DOC_ROOT, 'assets', stripped));
      candidates.push(path.join(DOC_ROOT, 'images', stripped));
      candidates.push(path.join(DOC_ROOT, 'pro-img.arsaaspub.com', stripped));
      candidates.push(path.join(DOC_ROOT, '0', stripped));
      candidates.push(path.join(DOC_ROOT, '6006', stripped));
    }

    const baseName = path.basename(pathname);
    candidates.push(path.join(DOC_ROOT, 'assets', baseName));
    candidates.push(path.join(DOC_ROOT, 'images', baseName));
    candidates.push(path.join(DOC_ROOT, 'img', baseName));

    for (const cand of candidates) {
      if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
        return serveFile(res, cand, mimeTypes[ext]);
      }
    }

    if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'].includes(ext)) {
      const transparentPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400'
      });
      return res.end(transparentPixel);
    }

    if (ext === '.css') {
      res.writeHead(200, {
        'Content-Type': 'text/css; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      });
      return res.end('/* deshclub fallback css */');
    }

    if (ext === '.js' || ext === '.mjs') {
      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      });
      return res.end('export default {}; export const N = {};');
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  // 4. SPA Fallback
  const indexPath = path.join(DOC_ROOT, 'index.html');
  if (fs.existsSync(indexPath)) {
    return serveFile(res, indexPath, 'text/html; charset=utf-8');
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/ (Proxying API to PHP on ${PHP_PORT})`);
});
