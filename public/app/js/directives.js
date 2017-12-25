app/*.directive('checkB',function(){
    return {
            restrict: 'AE',
            replace: true,
            scope:{
                    ch: '&'
            },
            template: '<input type="checkbox" ng-change="change(111)">',
            link: function(scope, el, att){
                    

            }
    }
    
}])*/.directive('vocabulary',function($timeout){
    return {
            restrict: 'EA',
            replace: true,
            //controller: 'teacherCtr',
            /*scope:{
                    wo: '=',
                    ch: '&',
                    ascen: '=',
                    al:'=',
                    slct: '=',
                    len: '=',
                    max: '='
            },*/  // | orderBy:w.lev:ascen    track by $index 
            scope: {
                words: '='
                //,change: '&'
                ,ch: '&'
            },                          //| orderBy: reverse:true
                                        //  https://stackoverflow.com/questions/15266671/angular-ng-repeat-in-reverse
                                        //  using custom filters  https://stackoverflow.com/questions/25115282/angularjs-orderby-array-index
            template: '<div id="" ng-repeat="w in words " >'+

                                '<div  ng-if="lastGroup($index) === false && $index % 10 === 0" '+
                                        '>'+
                                        '</br class="size5">' +

                                        //'<p class="size3">{{$index+1}}.-{{$index+10}}.</p>'+
                                        '<label class="size3" style="color: black;"> {{$index+1}}.-{{$index+10}}.'+
                                        '<input  type="checkbox" class="browser-default" ng-model="idk"      ' +
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
                                        ' &quot;picked&quot;: picked($index)}"'+
                                                '>' +
                                        '{{w[0]}} {{w[1]}} {{w[2]}}'+
                                '</div>'+
                        '</div>' ,
            
            link: function(scope, el, att){
               
                scope.wx = true
                scope.idk = 1
                scope.al = true
                $timeout(function(){
                    scope.max = 9
                })
                
                scope.$watch('slct', function(sl){

                })
                scope.$watch('words', function(w){

                })

                scope.$watch('len', function(wo){
                        //console.log("wo", wo)
                        //scope.len = 
                        $timeout(function(){
                                scope.max = wo//.length
                        })
                        //scope.$apply(function(){
                                scope.max = wo
                        //})
                        
                })
                /*scope.$watch('max', function(fck){
                                console.log('pipi', fck,"<")
                                console.log("words",scope.wo,"<<")
                                console.log("scope.max", scope.max)
                                console.log("scope", scope)
                                
                })*/

                scope.$watch( 'ascen'
                                //'wAscen'
                                , function(ascen){
                        //scope.rev = ascen
                        //scope.
                        //timeout(function(){
                               /* console.log('ascen ' +ascen + " : " + 
                                                scope.al 
                                                 +' 222')*/
                        //},0)
                        
                        
                })
                scope.$watch('slct', function(ddw){
                        //alert('slct ' + ddw + " --")
                })
                scope.$on('slct', function(){
                        //console.log('slct')
                })

                scope.$watch('al', function(){
                        //alert('al' + scope.al + ' .')
                        //console.log('al')      
                })
            }
    }
})
/*.directive('testLength', function(){
        return {
                restrict: 'E',
                replace: true,
                scope: {
                        lengths: '=',
                        action: '&'
                },
                template: '<p></p>'/*'<select ng-model="lengthSel" '+
                                'ng-options="l + \' rounds\' for l in lengths" '+
                                ' ng-change="lengthSelect(3)">' +
                                '</select>'       
                        //'<option>{{l}} rounds</option>' +
                        
                        
        }
  //       
  //    ng-change="lengthSelect()"
 
})*/ 
.directive('inpFocus', ['$timeout', function($timeout){
        return{
                restrict: 'A',
                //scope:{
                        //blr: '='
                //},
                link: function(scope, el, attr){
                        scope.blur = false
                        
                        scope.$watch('blur', function(idk){
                                
                                if (scope.blur){
                                        console.log('focus')
                                        $timeout(function(){
                                                el[0].focus()
                                        },500)
                                }
                                else if (!scope.blur) {
                                        console.log('blur')
                                        $timeout(function(){
                                                el[0].blur()
                                        })
                                }
                                else alert('directive inpFocus else')
                        },true)

                        scope.$on('blurit', function(){
                                console.log('wwwwwwww   blurit wwww')
                        })
                }
        }
}])
// file reader
.directive('fileSelect', ['$window',function($window){
        return{
                restrict: 'A',
                //require: 'ngModel',
                //controller: 'teacherCtr',
                /*scope:{
                        //onSelect: '&',
                        //fileSelect: '@',
                        data: '@',
                },*/
                link: function(scope, el, attr){
                        "use strict"

                        el.bind("change", function(e){
                               //console.log("file change")

                               if (e.target.files[0].type !== 'text/plain'){
                                        alert("only .txt files accepted\n" + 
                                              "if you can't change this, try option to copy + paste"+
                                              " the text of the file itself")
                                        return null
                               }
                               var r = new FileReader()

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
                                       alert("error reading file")
                               }
                               r.readAsText(e.target.files[0])
                        })
                }
        }
}])
.directive('downloadFile',[function(){
        return{

                restrict: "E",
                scope:{
                        action: '&'
                },
                template: '<a href="#" download-file ' + 
                                ' action="downloadDict(userNotes)"' +
                                ' ng-clickzz="downloadDict(userNotes)" ' + 
                                //'ng-href="{{ }}"'+
                                ' >get the file</a>'
                ,
                replace: true,
                link: function(scope, elem, attrs){
                        console.log("scope", scope);
                        console.log("attrs", attrs);
                        console.log("elem", elem[0]);

                        console.log("scope notes", scope.$parent.userNotes);
                        //console.log(
                        //elem[0].attrs("href") )
                        // set href attr to new value
                        let data = [[scope.$parent.lang1, scope.$parent.lang2],
                                     ...scope.$parent.words].map(function(word){
                                             return word.join(". ")
                                     })
                        //let data = 'testik', blob = new Blob([data], {type: 'text/plain'})

                        //let func = /*elem[0].*/attrs.$get('action') //elem[0].
                        //let func = /*elem[0].*/attrs['action'] //elem[0].
                        let func = scope.$parent.downloadDict
                        //func(scope.)
                        //func.call('ulo')
                        console.log(func)
                        //scope.$parent.downloadDict('test test')
                        //console.log(data);
                        

                        let href = 'data:application/octet-stream,' + 
                                       encodeURIComponent('babuska')//comments + "\n" + 
                        //                lang1 + "," + lang2 + "\n");
                        //attrs.$set("href", href);
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