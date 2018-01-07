const shellName = "teacher_v1.1.2",
     origin = "https://theteacher.herokuapp.com",
     shellFiles = [
  "/index.html",

  "/app/css/animations.css",
  "/app/css/elements.css",
  "/app/css/classes.css",
  "/app/css/material-icons.css",
  "/app/css/material-icons.woff",
  "/app/css/mediaQuerries.css",
  "/app/css/Frank_Ruhl_Libre/FrankRuhlLibre-Medium.ttf",

  "/app/libs/jquery-3.1.1.min.js",
  "/app/libs/angular.1.5.5.min.js",
  "/app/libs/materialize.0.98.1.min.js",
  "/app/libs/materialize.0.98.1.min.css",  
  "/app/libs/angular-materialize.0.2.2.min.js",
  "/app/libs/angular-animate.1.5.5.min.js",
  
  "/app/js/service-register.js",
  "/app/js/font-check.js",
  "/app/js/controllers.js",
  "/app/js/directives.js",
  "/app/js/services.js",
  "/app/js/teacherApp.js",
]

self.addEventListener('install', e =>{
     console.log('[ServiceWorker] Install');

     e.waitUntil(
               caches.open(shellName)
               .then(cache => {
                    console.log('[ServiceWorker] installation: Caching app shell', cache);

                    return cache.addAll(shellFiles);
               })
               .then(()=>{
                    console.log('[install] All required resources have been cached');
                    return self.skipWaiting();
               })
     );
});



self.addEventListener('activate', e =>{

     console.log('[SW activate]');
     console.log('Cache newest version:', shellName);

     // deleting old caches
     e.waitUntil(
          caches.keys().then( cacheNames =>{
               return Promise.all(
                    cacheNames.map( cacheName => {
                              console.log("activate: cache filtering:", cacheName);
                         
                              if (cacheName !== shellName) {
                                   console.log('deleting cache:', cacheName)
                                   return caches.delete(cacheName);
                              }
                    })
               );
          })
     );
})


self.addEventListener('fetch', e =>{

     e.respondWith(
               fromNetwork(e.request.url, 2000)
               .catch(() => fromCache(e.request))
     );
  
  
     function fromNetwork(request, timeout) {
          return new Promise((resolve, reject)=>{

               const timeoutId = setTimeout(reject, timeout);
                
               fetch(request)
               .then(response => {
                    clearTimeout(timeoutId);
                    resolve(response);
               }, reject);
          });
     }
  
     function fromCache(request) {
          return caches.open(shellName)
               .then( cache =>{
                    return cache.match(request)
                              .then(matching => {
                                   return matching || Promise.reject('no-match');
                              });
          });
     }     
});