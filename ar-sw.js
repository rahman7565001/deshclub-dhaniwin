importScripts(
    './sw-utils.js',
    './sw-domain.js',
    './sw-page.js',
);
// 监听 install 事件
self.addEventListener('message', (event) => {});
// 监听 install 事件
self.addEventListener('install', (event) => {
    // 跳过等待，直接进入 active 状态
    self.skipWaiting();
});
// 监听 activate 事件 (激活 SW)
self.addEventListener('activate', (event) => {});
self.addEventListener('error', (event) => {
    console.error('[SW] 捕获到错误:', event.message, '脚本:', event.filename, '行号:', event.lineno, '列号:', event.colno, '错误对象:', event.error);
})

// 监听 fetch 事件
self.addEventListener('fetch', (event) => {
    // 避免处理非同源请求
    const url = new URL(event.request.url);
    // 只处理 GET 请求和同源请求
    if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
    // 忽略 API 请求、Cashier 支付网关、Admin 和静态资源请求
    if (url.pathname.includes('/api') || url.pathname.includes('/webapi') || url.pathname.includes('/pay') || url.pathname.includes('/admin') || url.pathname.includes('.')) {
        return;
    }

    // 🚫 过滤掉疑似无效路由（如 undefined、null、空路径等）
    const invalidPaths = ['', '/undefined', '/null', '/[object Object]'];
    if (invalidPaths.includes(url.pathname)) {
        console.warn('[SW] 忽略无效路径请求:', url.pathname);
        return;
    }
    event.respondWith((
        async () => {
            try {
                const networkResponse = await fetch(event.request);
                if (networkResponse.ok) {
                    return networkResponse;
                }
                console.warn('network error when fetching request');
            } catch (error) {
                // 如果网络请求失败，返回离线页面
                if (!navigator.onLine) {
                    return new Response(
                        '<h1>navigator is offLine,Please check the device network</h1>', {
                            status: 503,
                            headers: {
                                'Content-Type': 'text/html'
                            },
                        }
                    );
                } else {
                    const htmlContent = createDynamicOnlinePage(buildStringMap());
                    // 异步缓存响应
                    try {
                        const cache = await caches.open('online-page');
                        await cache.put('sw-page.html', htmlContent.clone());
                    } catch (cacheError) {
                        console.error('缓存失败:', cacheError);
                    }

                    // 优先返回新生成的响应，或从缓存中获取
                    const cachedResponse = await caches.match('sw-page.html');
                    return cachedResponse || htmlContent;
                }
            }
        }
    )());
});