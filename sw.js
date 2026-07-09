/* 고흥귀농귀촌 앱 서비스워커
   공지/행사 내용을 수정해서 새로 배포할 때마다
   아래 버전 숫자(v1 → v2 → v3 ...)를 하나씩 올려 주세요.
   그래야 회원들 휴대폰에 새 내용이 반영됩니다. */
const CACHE = "goheung-app-v3";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* 네트워크 우선, 실패 시 캐시 (오프라인에서도 마지막 내용 표시) */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
