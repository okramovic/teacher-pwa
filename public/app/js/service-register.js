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

$(function(){
  
    var fonter = document.getElementById('fontTester')
    //var styl = window.getComputedStyle( fonter, null ).getPropertyValue( )
    //console.log("header", styl )  //document.querySelector('body'))
    if ( parseFloat(  window.getComputedStyle( fonter, null ).getPropertyValue( "width") ) > 22){

                alert("mat. icons not loaded")
    } else alert('font ok')
})
/*getfont().then(res=>{
            console.log("result",res, "\n",res.ok, res.status)
            alert("font loaded?  " + res.status + " " + res.ok)
}).catch(er=>{
    alert("rejected\n", er)
})
function getfont(){

    return new Promise((res,rej)=>{
        var font = fetch("../app/css/material-icons.css")
        res(font)
        rej("nope")
    })

//console.log(fetch("../app/css/material-icons.woff"))
}*/
