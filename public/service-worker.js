var shellName = "teacher_v02";
var origin = "https://theteacher.herokuapp.com"
//"/",
var shellFiles = [
  "/index.html",
  "/app/css/animations.css",
  "/app/css/general.css",
  "/app/css/mainScreen.css",
  "/app/css/material-icons.css",
  "/app/css/material-icons.woff",
  "/app/css/mediaQuerries.css",
  "/app/css/testDiv.css",
  "/app/css/Frank_Ruhl_Libre/FrankRuhlLibre-Medium.ttf",
  
  "/app/js/service-register.js",
  "/app/js/controllers.js",
  "/app/js/directives.js",
  "/app/js/services.js",
  "/app/js/teacherApp.js",

  "/app/libs/angular-animate.1.5.5.min.js",
  "/app/libs/angular-materialize.0.2.2.min.js",
  "/app/libs/jquery-3.1.1.min.js",
  "/app/libs/materialize.0.98.1.min.css",
  "/app/libs/angular.1.5.5.min.js"/*,*/
]

self.addEventListener('install', function(e) {
      console.log('[ServiceWorker] Install');

      // delete old caches
      //function delete(cb){
          /*caches.keys().then(ckeys=>{
              console.log("cacheKeys all")
              console.log(ckeys)

              var oldkeys = ckeys.filter(key=>{ return key !== shellName})
              var deletePromises = oldkeys.map(oldkey=>{ caches.delete(oldkey)})
              return Promise.all(deletePromises)
          })*/

      //}
      //delete(function(){
        e.waitUntil(
              caches.open(shellName)
                .then(function(cache) {

                    console.log('[ServiceWorker] installation: Caching app shell', cache);

                    return cache.addAll(shellFiles);
                })
                .then(function() {
                  console.log('[install] All required resources have been cached');
                  return self.skipWaiting();
                })
        );
      //});
});



self.addEventListener('activate', function(e) {
      
      console.log('sw activated');
  
      e.waitUntil(
          caches.keys().then(function(cacheNames) {
            return Promise.all(
              cacheNames.map(function(cacheName) {
                console.log("activate: cache key filtering", cacheName);
                
                if (cacheName !== shellName) {
                  return caches.delete(cacheName);
                }
              })
            );
          })
      );
      //alert('activate event');
})


// offline serving
self.addEventListener('fetch', function(e) {

      //console.log('[ServiceWorker] Fetch for ', e.request.url,"\n",e.request)

      e.respondWith(fromNetwork(e.request.url, 400).catch(function () {
          return fromCache(e.request);
      }));
  
  
      function fromNetwork(request, timeout) {
            return new Promise(function (resolve, reject) {

                var timeoutId = setTimeout(reject, timeout);
                
                fetch(request).then(function (response) {
                    clearTimeout(timeoutId);
                    resolve(response);
                }, reject);
            });
      }
  
      function fromCache(request) {
        return caches.open(shellName).then(function (cache) {
          return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
          });
        });
      }
      function useCache(e){

            return  e.respondWith(
          
                    caches.match(e.request).then(function(response) {
                              console.log(response)
                        return fetch(e.request) || response
                    })
              );
      }       
      
      


  function isShellFile(){
    
    return shellFiles.some(function(fileURL){

                return e.request.url.includes(fileURL)
           })
    // if req url contains any of itmes in "files" arr
  }
});
