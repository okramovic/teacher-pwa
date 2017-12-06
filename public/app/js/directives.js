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
            },
            template: '<div id="vocab" ng-repeat="w in words " class="">'+

                                '<div  ng-if="lastGroup($index) === false && $index % 10 === 0" '+
                                        '>'+
                                        '</br class="size5">' +

                                        '{{$index+1}}.-{{$index+10}}.   '+
                                        '<label >'+
                                        '<input  type="checkbox" class="browser-default" ng-model="idk"      ' +
                                        //'ng-checked="allchecked({{$index}}) == true"             ' +
                                        'ng-change="change({{$index}},1)  ">' +
                                        '</label>'  +

                                '</div>' + 

                                '<div ng-if="lastGroup($index) === true && $index % 10 === 0"'+
                                        'ng-model="www"> '+
                                        '</br class="size5">'+

                                        '{{$index+1}}.-{{words.length}}.'+

                                        '<label >'+
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
            /*'<div  ng-model="wx"  '+
                                'ng-class="{0: &quot;zero&quot;, 1: &quot;one&quot;,'+
                                        ' 2: &quot;two&quot; , 3: &quot;three&quot;,'+
                                        ' 4: &quot;four&quot;, 5: &quot;five&quot;,'+
                                        ' 6: &quot;six&quot;}[w[2]]"'+
                                                '>' +
                                        '{{w[0]}} {{w[1]}} {{w[2]}}'+

                                               // '<br> max {{words.length}} - {{max}}..'   +*/
            /* 
                        '<input  type="checkbox"  smt="{{$index}}" ' +
                                ' ng-checked="slct.indexOf({{$index}}) > -1"    ' +        
                                'ng-model="smt"   ng-change="change({{$index}})"  >'+
            */
            link: function(scope, el, att){
                //console.log("att", att)
                //console.log("change",scope.change)
                //scope.w[2] = scope.wo[2]
                scope.wx = true//scope.wo[2][2]
                scope.idk = 1
                scope.al = true
                $timeout(function(){
                scope.max = 9
                })
                //scope.len = 9
                //console.log("len",scope.len,"<<")
                //scope.change = change
                /*function(){
                        console.log('change');
                }*/
                /*scope.picked = picked
                function picked(x){
                        console.log('hi colors')
                        if (x % 2 === 0) return true
                        else return false
                }*/
                scope.$watch('slct', function(sl){
                        //alert('al' + scope.al + ' .')
                        //console.log('*****  sl\n',sl)
                })
                scope.$watch('words', function(w){
                        //alert('al' + scope.al + ' .')
                        //console.log('w\n\n',w)
                })

                //scope.rev = false;
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
                scope.$watch('max', function(fck){
                                /*console.log('pipi', fck,"<")
                                console.log("words",scope.wo,"<<")
                                console.log("scope.max", scope.max)
                                console.log("scope", scope)
                                */
                })

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
                //console.log(scope.wo[7][2])
                //console.log(att)
                //console.log($scope)
            }
    }
})
.directive('testLength', function(){
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
                                '</select>' */        
                        //'<option>{{l}} rounds</option>' +
                        
                        
        }
  //       
  //    ng-change="lengthSelect()"
})
.directive('inpFocus', ['$timeout', function($timeout){
        return{
                restrict: 'A',
                //controller: 'testCtrl',
                //scope:{
                        //blr: '='
                //},
                link: function(scope, el, attr){
                        //console.log('directive el', el)
                        //console.log(scope)

                        scope.blur = false
                        
                        scope.$watch('blur', function(idk){
                                //alert('halo')

                                
                                if (scope.blur){
                                        //console.log("-- blur 111 ",scope.blur)
                                        console.log('focus')
                                        $timeout(function(){
                                                el[0].focus()
                                        },500)
                                }
                                else if (!scope.blur) {
                                        console.log('blur')
                                        $timeout(function(){
                                                //console.log("-- blur 222 ",scope.blur)
        
                                                el[0].blur()
                                        })
                                }
                                else alert('else')
                        },true)

                        scope.$on('blurit', function(){
                                console.log('wwwwwwww   blurit wwww')

                                //el[0].focus() //blur()
                        })
                        
                }
        }


}])
// file reader
.directive('fileSelect', ['$window',function($window){
        return{
                restrict: 'A',
                //require: 'ngModel',
                //controller: 'teacherCtr',       // ng-change="upFile(file)"
                /*scope:{
                        //onSelect: '&',
                        //fileSelect: '@',
                        data: '@',
                },*/
                //template:'<input type="file" ng-model="file" >',
                link: function(scope, el, attr){
                        "use strict"
                        //console.log(scope)
                        //console.log(el)
                        //console.log(attr)

                        el.bind("change", function(e){
                               //, e.target.files[0])
                               console.log("file change")

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

                                /*$timeout(function(){
                                })*/
                                        //let noNotes = clearNotes(e.target.result)
                                        //console.log("file content\n", noNotes)
                                        //scope.words = noNotes
                                        

                                        //scope.upload( clearNotes(e.target.result) )
                                        console.log('load end  -->  broadcast')
                                        scope./*$parent.*/$emit('newDict', 
                                                {
                                                        filename: filename, 
                                                        words: parseText( clearNotes(e.target.result) ),
                                                        langs: getLangs ( clearNotes(e.target.result) )
                                                }
                                        )
                                        //scope.words= parseText( clearNotes(e.target.result) )
                                        //console.log("words loaded\n", parseText( clearNotes(e.target.result)  ) )
                                        
                               }
                               r.onerror = function(e){
                                       alert("error reading file")
                               }
                               r.readAsText(e.target.files[0])

                               //console.log('event', e.target.files[0].name)
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
function clearNotes(text){

        text = text.slice(

                text.indexOf("- - - (do not remove this line) - - -") + 
                "- - - (do not remove this line) - - -".length
        )
        return text

}