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
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
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
          iconUrl: '/img/6006/bankLogo/052326529-34807-file_20260502172326518.webp',
          selectedIconUrl: '/img/6006/bankLogo/052328901-34808-file_20260502172328900.webp',
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
          iconUrl: '/img/6006/bankLogo/052212261-34803-file_20260502172212259.webp',
          selectedIconUrl: '/img/6006/bankLogo/052214587-34804-file_20260502172214586.webp',
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
      const backgroundReq = http.request({
        hostname: '127.0.0.1',
        port: PHP_PORT,
        path: '/api/Recharge/DepositRecharge',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyStr || '{}')
        }
      }, () => {});
      backgroundReq.on('error', () => {});
      backgroundReq.write(bodyStr || '{}');
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
  const isGenericApi = /^\/api\//i.test(pathname) || (/^\/webapi\//i.test(pathname) && !/^\/webapi\/(?:kv|v)\/(?:config|firebaseConfig)\.js$/i.test(pathname));

  if (isApi || isDraw || isAdmin || isPay || isGenericApi) {
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
  let targetPath = path.join(DOC_ROOT, pathname);
  const ext = path.extname(targetPath).toLowerCase();

  if (ext && mimeTypes[ext]) {
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
      return serveFile(res, targetPath, mimeTypes[ext]);
    }

    // Asset fallback candidates
    const candidates = [
      path.join(DOC_ROOT, 'pro-img.arsaaspub.com', pathname),
      path.join(DOC_ROOT, 'img', pathname),
      path.join(DOC_ROOT, 'assets', pathname),
      path.join(DOC_ROOT, 'images', pathname)
    ];

    for (const cand of candidates) {
      if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
        return serveFile(res, cand, mimeTypes[ext]);
      }
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
