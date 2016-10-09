var app = angular.module('app', [
        'ngAnimate',
        'ui.router',
        'mgcrea.ngStrap',
        'ui.calendar',
        'ui.bootstrap',
        'angular-loading-bar',
        'angular-simditor',
        'homeMoudle',
        'navleftMoudle',
        'navtopMoudle',
        'serviceData',
        'dishMoudle',
        'dishAddMoudle',
        'dishCateMoudle',
        'dishDetailMoudle'

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
        .state('web.clue', {
            url: '/clue',
            templateUrl: 'tpls/customer/clue.html'
        })
        .state('web.dish', {
            url: '/dish',
            templateUrl: 'tpls/dish/dish.html'
        })
        .state('web.dishCate', {
            url: '/dishCate',
            templateUrl: 'tpls/dish/dishcate.html'
        })
        .state('web.dishAdd', {
            url: '/dishAdd',
            templateUrl: 'tpls/dish/dishadd.html'
        })
        .state('web.dishDetail', {
            url: '/dishDetail/:id',
            templateUrl: 'tpls/dish/dishdetail.html'
        })
        
});
/* 加载进度条 */
app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.includeSpinner  = false;
}])

