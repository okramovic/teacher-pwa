window.addEventListener('load', ev =>{

     let tester = document.getElementById('fontTester');
     let wid = parseFloat(  window.getComputedStyle( tester, null ).getPropertyValue( "width") );                           
                          
     // test the envelope icon for width (initial screen) == if width is too big, it shows font was refused (mobile mozilla)
     // => use backup - unicode characters (stored in tags' data-fallback attribute)
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