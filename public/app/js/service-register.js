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
    console.log("header", parseFloat(  window.getComputedStyle( fonter, null ).getPropertyValue( "width") ) )
  
    //if ( parseFloat(  window.getComputedStyle( fonter, null ).getPropertyValue( "width") ) > 22){}
})


/*$(function(){
    
      
})*/
document.addEventListener('DOMContentLoaded',()=>{
    console.log('DOMload')
    
    //var styl = window.getComputedStyle( fonter, null ).getPropertyValue( )
    //console.log("header", parseFloat(  window.getComputedStyle( fonter, null ).getPropertyValue( "width") ) )
    /*if ( parseFloat(  window.getComputedStyle( fonter, null ).getPropertyValue( "width") ) > 22){

                //alert("mat. icons not loaded")
    } else {}//alert('font ok')*/
})
window.addEventListener('load',(ev)=>{
        console.log("||||||||| loaded 2", ev)
        let tester = document.getElementById('fontTester')

        // it tests the envelope icon for width
        if ( parseFloat(  window.getComputedStyle( tester, null ).getPropertyValue( "width") ) > 22){
            
                            console.log("mat. icons not loaded")

                            let icons = document.querySelectorAll('i')
                            //console.log("icons", icons)

                            for (let i=0; i<icons.length;i++){
                                    let icon = icons[i]

                                    let fb = icon.getAttribute('data-fallback')
                                    //console.log("fallback? ", fb)
            
                                    if (fb) icon.innerHTML=fb
            
                                    icon.style.fontSize = "35px"
                                    icon.style.paddingBottom = "15px"
                            }
                            
        } else {
            console.log('icons loaded ok')
                
        }
})


// attempt by detecting loading error
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
}*/
