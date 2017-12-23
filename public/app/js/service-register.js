
if ('serviceWorker' in navigator){
                
        navigator.serviceWorker
            .register('service-worker.js')
            .then(function(reg){
          
                    console.log('sw registered', reg);
        })
  
} else {
    //alert("storing this app offline isn't going to be possible");
}


document.addEventListener('DOMContentLoaded',()=>{
    //console.log('DOMload')
    
    //var styl = window.getComputedStyle( fonter, null ).getPropertyValue( )
    //console.log("header", parseFloat(  window.getComputedStyle( fonter, null ).getPropertyValue( "width") ) )
    /*if ( parseFloat(  window.getComputedStyle( fonter, null ).getPropertyValue( "width") ) > 22){

                //alert("mat. icons not loaded")
    } else alert('font ok')*/
})


window.addEventListener('load',(ev)=>{

        let tester = document.getElementById('fontTester');
        let wid = parseFloat(  window.getComputedStyle( tester, null ).getPropertyValue( "width") );
        //alert("icon wid  " + wid)                             
                             
        // test the envelope icon for width              
        if ( wid > 22){   
            
                            console.log("mat. icons not loaded")

                            let icons = document.querySelectorAll('i')

                            for (let i=0; i<icons.length;i++){
                                    let icon = icons[i]

                                    let fb = icon.getAttribute('data-fallback')
            
                                    if (fb) icon.innerHTML=fb
            
                                    icon.style.fontSize = "35px";
                                    icon.style.paddingBottom = "15px"
                            }
        } else console.log('icons loaded ok')
})
