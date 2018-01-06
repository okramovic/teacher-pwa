var app = angular.module('teacherApp',['ngAnimate','ui.materialize'])

// to be able to download copy of words as file (non-iOS devices)
app.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
}]);