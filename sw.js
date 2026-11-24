// 웹판을 안드로이드 크롬에서 '앱 설치'할 수 있게 하는 도우미.
// 1.2.12: 늘 인터넷에서 새로 받고(웹판을 올리면 바로 반영), 받을 때마다 사본을 하나 둔다.
//         인터넷이 없을 때만 그 사본으로 연다 → 끊겨도 기록을 '보기만' 할 수 있다 (개인정보처리방침 2번과 같게).
//         우리 주소의 파일만 다룬다. 구글 로그인·DB 같은 다른 주소는 손대지 않는다.
const CACHE = 'lifeguard-shell-v1';
const SHELL = ['./', './index.html', './tailwindcss.min.js', './privacy.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true })
      .then(r => r || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
      .then(r => r || Response.error()))
  );
});
