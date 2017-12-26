var app = angular.module('teacherApp',['ngAnimate','ui.materialize'])

// ? to e able to download copy of words as file (non-iOS devices)
app.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
}]);

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