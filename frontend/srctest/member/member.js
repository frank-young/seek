/********************************************************************************************************************
 *                                                     会员信息
 ********************************************************************************************************************/

angular.module("memberMoudle", []).controller('MemberCtrl', ['$scope','$rootScope','$window',
  	function($scope,$rootScope,$window) {

		$window.document.title = "会员信息"
		$scope.memberAll = [
			{
				name:'徐奥林',
				card:'01213',
				phone:'18694039343',
				time:1492837482382

			},
			{
				name:'杨军',
				card:'01213',
				phone:'18608164404',
				time:1492837482382

			},
			{
				name:'刘洋',
				card:'01213',
				phone:'18694033083',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01213',
				phone:'18694039183',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01213',
				phone:'18691239283',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01213',
				phone:'1869445683',
				time:1492837482382

			},
			{
				name:'徐奥林',
				card:'01213',
				phone:'1869384283',
				time:1492837482382

			}

		]
		// 搜索会员用户
		$scope.search = ""
		$scope.member = $scope.memberAll
		$scope.searchMember = function(value){
			$scope.member = $scope.memberAll.filter(function(ele){
				if(ele.phone.indexOf(value)>=0){
					return ele
				}
			})
		}

		// 添加会员
		$scope.addMember = function(){
			// 直接向服务器发送信息，需要考虑微信会员的那块
		}

	}
])









