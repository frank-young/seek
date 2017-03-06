/********************************************************************************************************************
 *                                                     会员信息
 ********************************************************************************************************************/

angular.module("memberMoudle", []).controller('MemberCtrl', ['$scope','$rootScope','$window','memberData',
  	function($scope,$rootScope,$window,memberData) {

		// 搜索会员用户
		$scope.search = ""

		memberData.getData().then(function(data){
			$scope.memberAll = data.members
			$scope.member = $scope.memberAll
		})

		$scope.searchMember = function(value){
			$scope.member = $scope.memberAll.filter(function(ele){
        if (ele.phone) {
          if(ele.phone.indexOf(value)>=0){
  					return ele
  				}
        }
			})
		}

		// 查看会员详情
		$scope.memberDetail = function(id){
			memberData.getIdData(id).then(function(data){

				$scope.memberItem = data.member

			})
		}
	}
])
