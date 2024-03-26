//serviceworker
self.addEventListener("install", function (event) {
    event.waitUntil(preLoad());
});
self.addEventListener("fetch", function (event) {
    event.respondWith(
        checkResponse(event.request).catch(function () {
            console.log("Fetch from cache successful!");
            return returnFromCache(event.request);
        })
    );
    console.log("Fetch successful!");
    event.waitUntil(addToCache(event.requesst));
});
self.addEventListener("sync", (event) => {
    if (event.tag === "syncMessage") {
        console.log("Sync successful!");
    }
});
self.addEventListener("push", function (event) {
    if (event && event.data) {
        try {
            var data = event.data.json();
            if (data && data.method === "pushMessage") {
                console.log("Push notification sent");
                self.registration.showNotification("Ecommerce website", {
                    body: data.message,
                });
            }
        } catch (error) {
            console.error("Error parsing push data:", error);
        }
    }
});
var preLoad = function () {
    return caches.open("offline").then(function (cache) {
        // caching index and important routes
        return cache.addAll([
            "/",
            "/index.html",
            "/about.html",
            "/blog.html",
            "/menu.html",
            "/products.html",
            "/contact.html",
            "/review.html",
            "/style.css",
            "scripts.js",
            "service-worker.js",
            "image\delicious-burger-on-wooden-board-2022-03-04-05-58-25-utc.jpg",
            "image\delicious-tasty-burgers-on-wooden-background-2021-08-26-15-25-13-utc.jpg",
            "image\handmade-burger-on-dark-background-delicious-blac-2021-10-21-02-27-27-utc.jpg",
            "image\pizza-with-salami-italian-food-2022-01-10-22-56-05-utc.jpg",
            "image\pizza-with-turkey-bacon-orange-and-cashew-nuts-2022-03-29-07-33-54-utc.jpg",
            "image\pngegg.png",
            "image\pngwing.com (1).png",
            "image\pngwing.com (2).png",
            "image\pngwing.com (3).png",
            "image\pngwing.com (4).png",
            "image\pngwing.com (5).png",
            "image\pngwing.com (6).png",
            "image\pngwing.com (7).png",
            "image\pngwing.com (8).png",
            "image\pngwing.com (9).png",
            "image\pngwing.com (10).png",
            "image\pngwing.com (11).png",
            "image\pngwing.com (12).png",
            "image\pngwing.com (13).png",
            "image\pngwing.com (14).png"
        ]);
    });
};
var checkResponse = function (request) {
    return new Promise(function (fulfill, reject) {
        fetch(request)
            .then(function (response) {
                if (response.status !== 404) {
                    fulfill(response);
                } else {
                    reject(new Error("Response not found"));
                }
            })
            .catch(function (error) {
                reject(error);
            });
    });
};
var returnFromCache = function (request) {
    return caches.open("offline").then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status == 404) {
                return cache.match("offline.html");
            } else {
                return matching;
            }
        });
    });
};
var addToCache = function (request) {
    return caches.open("offline").then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response.clone()).then(function () {
                return response;
            });
        });
    });
};
