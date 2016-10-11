var app = angular.module('app', [
        'ngAnimate',
        'ui.router',
        'mgcrea.ngStrap',
        'ui.bootstrap',
        'angular-loading-bar',
        'ngSanitize',
        'navMoudle',
        'homeMoudle',
        'serviceData',
        'selectMoudle',
        'billMoudle',
        'billlistMoudle',
        'memberMoudle'

        ]);  

app.run(function($rootScope, $state, $stateParams,$alert) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:3});
    }
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
                title:"订单"
            }
        })
        .state('web.billlist', {
            url: '/billlist',
            templateUrl: 'tpls/bill/billlist.html',
            data:{
                title:"订单列表"
            }
        })
        .state('web.member', {
            url: '/member',
            templateUrl: 'tpls/member/member.html',
            data:{
                title:"会员信息"
            }
        })
        
});
/* 加载进度条 */
app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.includeSpinner  = false;
}])

