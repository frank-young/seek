/**
 * 左侧 menu 菜单
 */

angular.module('navleftMoudle',[]).controller('NavleftCtrl', ['$scope', '$http','settingData',
	function ($scope, $http,settingData) {
		var menus = [
			{
				icon:'fa fa-file-pdf-o',
				title:'订单管理',
				role:1,
				subs:[
					{
						text:'订单列表',
						link:'web.order'
					},
					{
						text:'月报表',
						link:'web.orderMonth'
					},
					{
						text:'结班报告',
						link:'web.orderDay'
					},
					{
						text:'品项报告',
						link:'web.itemDay'
					}
				]
			},
			{
				icon:'fa fa-diamond',
				title:'菜品管理',
				role:10,
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
					},
					{
						text:'新建套餐',
						link:'web.dishcomboAdd'
					}

				]
			},
			{
				icon:'fa fa-credit-card',
				title:'支付设置',
				role:10,
				subs:[ 
					{
						text:'支付方式',
						link:'web.paytype'
					},
					{
						text:'挂帐人员',
						link:'web.credit'
					}
				]
			},
			{
				icon:'fa fa-users',
				title:'会员管理',
				role:10,
				subs:[ 
					{
						text:'会员卡',
						link:'web.petcard'
					},
					{
						text:'会员卡套餐',
						link:'web.petrule'
					}
				]
			},
			{
				icon:'fa fa-wechat',
				title:'微信端点餐',
				role:10,
				subs:[
					{
						text:'餐桌管理',
						link:'web.table'
					},
					{
						text:'新建餐桌',
						link:'web.tableAdd'
					}
				]
			},
			{
				icon:'fa fa-user',
				title:'成员管理',
				role:10,
				subs:[
					{
						text:'成员列表',
						link:'web.team'
					},
					{
						text:'新建成员',
						link:'web.teamAdd'
					}
				]
			},
			{
				icon:'fa fa-coffee',
				title:'门店设置',
				role:10,
				subs:[
					{
						text:'门店设置',
						link:'web.set'
					}
				]
			}		
		]

		// 权限控制
		settingData.getRbac().then(function(data){
			$scope.role = data.rbac
			$scope.menus = []
			menus.filter(function (menu) {
				if(menu.role <= $scope.role){
					$scope.menus.push(menu)
				}
			 	return $scope.menu
			})
		})
	}
])










