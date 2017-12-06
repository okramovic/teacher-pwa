var app = angular.module('teacherApp',['ngAnimate','ui.materialize'])

app.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
}]);

    /*.directive('checkB',function(){
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
        
    }])*/
    /*.directive('teacherDir',function(){
        return {
                restrict: 'EA',
                replace: true,
                scope:{
                        wo: '=',
                        ch: '&'
                },
                template: '<div ng-repeat="w in wo track by $index">'+
                                '<div>{{w[0]}} {{w[1]}} {{$index}}'+
                                        //'<check-b   data-i="{{$index}}"  ng-model="{{$index}}" ch="change(222)"></check-b> </div>' +
                                        '<input smt="{{$index}}"  ng-model="smt"  type="checkbox" ng-change="change({{$index}})">'+
                          '</div>'        
                ,
                link: function(scope, el, att){

                }
        }

    })*/
    
    //  '<p>{{wo}}</p>' 





    //  getting selected checkboxes
    //  https://stackoverflow.com/questions/42533332/angularjs-ng-repeat-array-index
    //  http://jsfiddle.net/g1aurav/026mc5c6/1/
