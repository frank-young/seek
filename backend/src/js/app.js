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
        'dishcomboAddMoudle',
        'dishCateMoudle',
        'dishDetailMoudle',
        'dishcomboDetailMoudle',
        'teamMoudle',
        'teamAddMoudle',
        'teamDetailMoudle',
        'overDetailMoudle',
        'orderMoudle',
        'orderAddMoudle',
        'orderDetailMoudle',
        'orderMonthMoudle',
        'orderDayMoudle',
        'itemDayMoudle',
        'itemDetailMoudle',
        'creditMoudle',
        'paytypeMoudle',
        'setMoudle',
        'wechatMoudle'

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
        .state('web.dishcomboAdd', {
            url: '/dishcomboAdd',
            templateUrl: 'tpls/dish/dishcomboadd.html'
        })
        .state('web.dishDetail', {
            url: '/dishDetail/:id',
            templateUrl: 'tpls/dish/dishdetail.html'
        })
        .state('web.dishcomboDetail', {
            url: '/dishcomboDetail/:id',
            templateUrl: 'tpls/dish/dishcombodetail.html'
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
        .state('web.orderDay', {
            url: '/orderday',
            templateUrl: 'tpls/order/orderday.html'
        })
        .state('web.itemDay', {
            url: '/itemday',
            templateUrl: 'tpls/order/itemday.html'
        })
        .state('web.itemDetail', {
            url: '/itemdetail/:id',
            templateUrl: 'tpls/order/itemdetail.html'
        })
        .state('web.overDetail', {
            url: '/overdetail/:id',
            templateUrl: 'tpls/order/overdetail.html'
        })
        .state('web.credit', {
            url: '/credit',
            templateUrl: 'tpls/credit/credit.html'
        })
        .state('web.paytype', {
            url: '/paytype',
            templateUrl: 'tpls/credit/paytype.html'
        })
        .state('web.set', {
            url: '/set',
            templateUrl: 'tpls/set/set.html'
        })
        .state('web.wechat', {
            url: '/wechat',
            templateUrl: 'tpls/wechat/wechat.html'
        })


        
});
/* 加载进度条 */
app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.includeSpinner  = false;
}])

