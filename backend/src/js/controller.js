/**
 * 左侧 menu 菜单
 */

angular.module('navleftMoudle',[]).controller('NavleftCtrl', ['$scope', '$http',
	function ($scope, $http) {
		$scope.menus = [
		{
			icon:'fa fa-file-pdf-o',
			title:'报表',
			role:0,
			subs:[
				{
					text:'月报表',
					link:'web.quotation'
				},
				{
					text:'日报表',
					link:'web.quotationAdd'
				}			]
		},
		{
			icon:'fa fa-diamond',
			title:'菜品管理',
			role:0,
			subs:[
				{
					text:'全部菜品',
					link:'web.dish'
				},
				{
					text:'菜品分类',
					link:'web.dishCate'
				},
				{
					text:'新建菜品',
					link:'web.dishAdd'
				}

			]
		},
		{
			icon:'fa fa-users',
			title:'会员管理',
			role:0,
			subs:[ 
				{
					text:'会员列表',
					link:'web.clue'
				},
				{
					text:'添加会员',
					link:'web.customer'
				}
			]
		},
		
		{
			icon:'fa fa-wechat',
			title:'微信端',
			role:0,
			subs:[
				{
					text:'会员卡',
					link:'web.quotation'
				},
				{
					text:'优惠券',
					link:'web.quotationAdd'
				},
				{
					text:'报价单设置',
					link:'web.quotationSetting'
				}
			]
		},
		{
			icon:'fa fa-user',
			title:'收银员管理',
			role:10,
			subs:[
				{
					text:'收银列表',
					link:'web.team'
				},
				{
					text:'新建收银',
					link:'web.teamAdd'
				}
			]
		}
	]
	// settingData.getRbac().then(function(data){
	// 	$scope.role = data.rbac
	// 	$scope.menus = [];
	// 	menus.map(function (menu) {
	// 		if(menu.role <= $scope.role){
	// 			$scope.menus.push(menu)
	// 		}
	// 	 	return $scope.menu; 
	// 	});
	// })
}
])










;/**
 * 顶部导航
 * 
 */

angular.module('navtopMoudle',[]).controller('NavtopCtrl', ['$scope',
	function ($scope) {
		$scope.content = ""
		$scope.myaside = false

	}
]);/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', 
  ['$scope','$window',
  function($scope,$window) {

	  $window.document.title = "seek cafe";

}])



