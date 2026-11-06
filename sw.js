/* Service worker: makes the app installable and usable offline. */

var SHELL_CACHE = "lid-shell-v1";
// Bump this (here and in app.js) after regenerating clips or images: cached media
// is never revalidated, so installed copies would otherwise keep the old files.
var MEDIA_CACHE = "lid-media-v1";

var SHELL_FILES = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "data.json",
  "glossary.json",
  "manifest.webmanifest",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      // "reload" skips the browser's HTTP cache so a new worker never stores old files.
      return cache.addAll(SHELL_FILES.map(function (f) { return new Request(f, { cache: "reload" }); }));
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key !== SHELL_CACHE && key !== MEDIA_CACHE;
      }).map(function (key) { return caches.delete(key); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  var url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  // The offline download in app.js writes to the cache itself.
  if (request.headers.has("x-lid-media-download")) return;
  if (/\/(audio|img)\/[^/]+$/.test(url.pathname)) {
    event.respondWith(mediaResponse(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// App files: the latest version when online, the cached copy when offline.
// GitHub Pages lets browsers reuse files for 10 minutes. "no-cache" checks with
// the server every time, so a new index.html never runs with an old app.js.
function networkFirst(request) {
  return fetch(request, { cache: "no-cache" }).then(function (response) {
    if (response.ok) {
      var copy = response.clone();
      return caches.open(SHELL_CACHE)
        .then(function (cache) { return cache.put(request, copy); })
        .then(function () { return response; });
    }
    return response;
  }).catch(function () {
    return caches.match(request, { ignoreSearch: true, ignoreVary: true }).then(function (cached) {
      if (cached) return cached;
      if (request.mode === "navigate") return caches.match("index.html");
      return Response.error();
    });
  });
}

// Audio and images: from the cache if present, otherwise fetched whole and kept.
function mediaResponse(request) {
  var key = stripQuery(request.url);
  return caches.open(MEDIA_CACHE).then(function (cache) {
    return cache.match(key, { ignoreVary: true }).then(function (cached) {
      if (cached) return cached;
      // Not the original request: it may carry a Range header, and a partial
      // response cannot be stored.
      return fetch(key).then(function (response) {
        if (!response.ok) return response;
        var copy = response.clone();
        return cache.put(key, copy).then(function () { return response; });
      });
    });
  }).then(function (response) {
    var range = request.headers.get("range");
    return range && response.ok ? rangeResponse(response, range) : response;
  });
}

function stripQuery(url) {
  return url.split("#")[0].split("?")[0];
}

// Safari asks for audio in byte ranges and refuses to play a plain 200 response.
function rangeResponse(response, range) {
  return response.arrayBuffer().then(function (buffer) {
    var match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    var size = buffer.byteLength;
    if (!match || (match[1] === "" && match[2] === "")) {
      return new Response(buffer, { status: 200, headers: mediaHeaders(response, size) });
    }
    var start, end;
    if (match[1] === "") { // "bytes=-500": the last 500 bytes
      start = Math.max(size - Number(match[2]), 0);
      end = size - 1;
    } else {
      start = Number(match[1]);
      end = match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
    }
    if (start >= size || start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + size } });
    }
    var headers = mediaHeaders(response, end - start + 1);
    headers["Content-Range"] = "bytes " + start + "-" + end + "/" + size;
    return new Response(buffer.slice(start, end + 1), { status: 206, headers: headers });
  });
}

function mediaHeaders(response, length) {
  return {
    "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
    "Content-Length": String(length),
    "Accept-Ranges": "bytes"
  };
}
