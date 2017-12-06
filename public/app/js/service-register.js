console.log('serviceWorker registerer');

if ('serviceWorker' in navigator){
  
        //alert('browser has service worker');
        
          
        navigator.serviceWorker
            .register('service-worker.js')
            .then(function(reg){
          
                    console.log('sw registered', reg);
        })
  
} else {
    alert('serviceWorker not available in this browser');
}