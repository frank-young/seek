var app = angular.module('app', [
        'ngAnimate',
        'ui.router',
        'mgcrea.ngStrap',
        'ui.bootstrap',
        'angular-loading-bar',
        'navMoudle',
        'homeMoudle',
        'selectMoudle',
        'billMoudle',
        'billlistMoudle',

        ]);  

app.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/index');
    $stateProvider
        .state('web', {
            url: '',
            templateUrl: 'tpls/nav.html'
        })
        .state('web.home', {
            url: '/index',
            templateUrl: 'tpls/home/index.html',
            data:{
                title:"首页"
            }
        })
        .state('web.select', {
            url: '/select',
            templateUrl: 'tpls/select/select.html',
            data:{
                title:"点餐"
            }
        })
        .state('web.bill', {
            url: '/bill',
            templateUrl: 'tpls/bill/bill.html',
            data:{
                title:"点餐"
            }
        })
        .state('web.billlist', {
            url: '/billlist',
            templateUrl: 'tpls/bill/billlist.html',
            data:{
                title:"点餐"
            }
        })
        
});
/* 加载进度条 */
app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.includeSpinner  = false;
}])

