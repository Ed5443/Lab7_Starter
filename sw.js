// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';

// Once the service worker has been installed, feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  /**
   * TODO - Part 2 Step 2
   * Create a function as outlined above
   */
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache){
      console.log('Opened Cache');
      return cache.addAll(['https://ed5443.github.io/','/','assets/scripts/main.js','assets/styles/main.css', 'assets/scripts/router.js',
      'assets/components/RecipeCard.js', 'assets/components/RecipeExpand.js','https://introweb.tech/assets/json/ghostCookies.json',
      'https://introweb.tech/assets/json/birthdayCake.json',
      'https://introweb.tech/assets/json/chocolateChip.json',
      'https://introweb.tech/assets/json/stuffing.json',
      'https://introweb.tech/assets/json/turkey.json',
      'https://introweb.tech/assets/json/pumpkinPie.json']);
    })
  );
});

/**
 * Once the service worker 'activates', this makes it so clients loaded
 * in the same scope do not need to be reloaded before their fetches will
 * go through this service worker
 */
self.addEventListener('activate', function (event) {
  /**
   * TODO - Part 2 Step 3
   * Create a function as outlined above, it should be one line
   */
  event.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.map(function(cacheName){
          if(cacheName != CACHE_NAME){
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercept fetch requests and store them in the cache
self.addEventListener('fetch', function (event) {
  /**
   * TODO - Part 2 Step 4
   * Create a function as outlined above
   */
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if(response){
        return response;
      }
      return fetch(event.request).then(
        function(response) {
          if(!response || response.status !== 200 || response.type !== 'basic'){
            return response;
          }

          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
          .then(function(cache){
            cache.put(event.request, responseToCache);
          });
          return response;
        }
      );
    })
  );
});