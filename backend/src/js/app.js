var app = angular.module('app', [
        'ngAnimate',
        'ui.router',
        'mgcrea.ngStrap',
        'ui.calendar',
        'ui.bootstrap',
        'ngSanitize',
        'angular-loading-bar',
        'angular-simditor',
        'homeMoudle',
        'navleftMoudle',
        'navtopMoudle',
        'serviceData',
        'dishMoudle',
        'dishAddMoudle',
        'dishCateMoudle',
        'dishDetailMoudle',
        'teamMoudle',
        'teamAddMoudle',
        'teamDetailMoudle',
        'orderMoudle',
        'orderAddMoudle',
        'orderDetailMoudle',
        'orderMonthMoudle'

        ]);  

app.run(function($rootScope, $state, $stateParams,$alert) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    /*提示框*/
    $rootScope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:3});
    }
})

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
        .state('web.team', {
            url: '/team',
            templateUrl: 'tpls/team/team.html'
        })
        .state('web.teamAdd', {
            url: '/teamAdd',
            templateUrl: 'tpls/team/teamadd.html'
        })
        .state('web.teamDetail', {
            url: '/teamDetail/:id',
            templateUrl: 'tpls/team/teamdetail.html'
        })
        .state('web.order', {
            url: '/order',
            templateUrl: 'tpls/order/order.html'
        })
        .state('web.orderAdd', {
            url: '/orderAdd',
            templateUrl: 'tpls/order/orderadd.html'
        })
        .state('web.orderDetail', {
            url: '/orderDetail/:id',
            templateUrl: 'tpls/order/orderdetail.html'
        })
        .state('web.orderMonth', {
            url: '/ordermonth',
            templateUrl: 'tpls/order/ordermonth.html'
        })

        
});
/* 加载进度条 */
app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.includeSpinner  = false;
}])

