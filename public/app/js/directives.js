app

// to display current Dictionary
.directive('vocabulary',function($timeout){
     return {
          restrict: 'E',
          replace: true,
          scope: {
               words: '=',
               ch: '&'
          },
          template: '<div id="" ng-repeat="w in words " >'+

                                '<div  ng-if="lastGroup($index) === false && $index % 10 === 0" '+
                                        '>'+
                                        '</br class="size5">' +

                                        //'<p class="size3">{{$index+1}}.-{{$index+10}}.</p>'+
                                        '<label class="size3" style="color: black;"> {{$index+1}}.-{{$index+10}}.'+
                                        '<input  type="checkbox" class="browser-default" ng-model="groupCheck" ' +
                                        //'ng-checked="allchecked({{$index}}) == true"             ' +
                                        'ng-change="change({{$index}},1)  ">' +
                                        '</label>'  +

                                '</div>' + 

                                '<div ng-if="lastGroup($index) === true && $index % 10 === 0"'+
                                        'ng-model="www"> '+
                                        '</br class="size5">'+

                                        //'<p class="size3">{{$index+1}}.-{{words.length}}.</p>'+

                                        '<label class="size3" style="color: black;"> {{$index+1}}.-{{words.length}}.'+
                                        '<input  type="checkbox" class="browser-default" ng-model="www"      ' +
                                        //'ng-checked="allchecked({{$index}}) == true"             ' +
                                        'ng-change="change({{$index}},1)  ">' +
                                        '</label>'  +
                                '</div>' +

                                '<div class="word" ng-model="w[2]"  '  +
                                     'ng-class="{&quot;zero&quot;: w[2]==0, '  +

                                        ' &quot;one&quot;   : w[2] == 1, '+
                                        ' &quot;two&quot;   : w[2] == 2, '+
                                        ' &quot;three&quot; : w[2] == 3, '+
                                        ' &quot;four&quot;  : w[2] == 4, '+
                                        ' &quot;five&quot;  : w[2] == 5, '+
                                        ' &quot;six&quot;   : w[2] == 6, '+
                                        ' &quot;picked&quot;: picked($index),'+
                                        ' &quot;notpicked&quot;: !picked($index)}"'+
                                                '>' +
                                        '{{w[0]}} {{w[1]}} {{w[2]}}'+
                                '</div>'+
                        '</div>' ,
            
          link: function(scope, el, att){

               scope.groupCheck = 1
          }
     }
})

// during test this auto-focuses input
.directive('inpFocus', ['$timeout', function($timeout){
        return{
                restrict: 'A',
                link: function(scope, el, attr){
                        scope.blur = false
                        
                        scope.$watch('blur', function(o, n){
                                let time
                                if (scope.round>0) time = 500
                                else time = 1000

                                //console.log('round',scope.round,'\n$watch - scope.blur - vals old, new', o, n)
                                if (scope.blur){
                                        //console.log('focus')
                                        $timeout(()=>{
                                                el[0].focus()
                                        },time)

                                } else if (!scope.blur){
                                        //console.log('blur')
                                        $timeout(()=>{
                                                el[0].blur()
                                        })
                                }
                        },true)
                }
        }
}])

// file reader - to input new Dictionary
.directive('fileSelect', ['$window',function($window){
     return{
               restrict: 'A',
               link: function(scope, el, attr){
                        "use strict"

                        el.bind("change", function(e){

                              if (e.target.files[0].type !== 'text/plain'){
                                        alert("only .txt files accepted\n" + 
                                              "if you can't change this, try option to copy + paste"+
                                              " the text of the file itself")
                                        return null
                              }
                              const r = new FileReader()

                              let filename = e.target.files[0].name
                              console.log(e.target.files[0])

                              r.onloadend = function(e){

                                        let withoutNotes = clearNotes(e.target.result)

                                        scope.$emit('newDict', 
                                                      {
                                                       filename: filename, 
                                                       words: parseText( withoutNotes ),
                                                       langs: getLangs ( withoutNotes )
                                                      }
                                        )
                               }
                              r.onerror = function(e){
                                       alert("error while reading file")
                              }
                              r.readAsText(e.target.files[0])
                        })
               }
     }
}])


// this is for locally stored dictionary names on initial screen
.filter('replace_',function(){
        return function(name){
                return name.replace(/_/g," ")
        }
})

function clearNotes(text){

        text = text.slice(

                text.indexOf("- - - (do not remove this line) - - -") + 
                "- - - (do not remove this line) - - -".length )
        return text
}