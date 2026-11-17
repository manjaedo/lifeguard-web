// 웹판을 안드로이드 크롬에서 '앱 설치'할 수 있게 하는 최소한의 도우미.
// 아무것도 저장(캐시)하지 않고 늘 인터넷에서 새로 받는다 → 웹판을 올리면 바로 반영된다.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => e.respondWith(fetch(e.request)));
