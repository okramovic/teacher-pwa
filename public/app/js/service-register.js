if ('serviceWorker' in navigator){
                
          navigator.serviceWorker
               .register('service-worker.js')
               .then(function(reg){
                    console.log('Service Worker registered', reg);
          })  
} else {
    //alert("storing this app offline isn't going to be possible");
}