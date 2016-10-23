/********************************************************************************************************************
 *                                                     会员信息
 ********************************************************************************************************************/

angular.module("memberMoudle", []).controller('MemberCtrl', ['$scope','$rootScope','$window','memberData',
  	function($scope,$rootScope,$window,memberData) {

		$window.document.title = "会员信息"
		// 搜索会员用户
		$scope.search = ""

		memberData.getData().then(function(data){
			$scope.memberAll = data.members
			console.log($scope.memberAll)
			$scope.member = $scope.memberAll
		})
		
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









