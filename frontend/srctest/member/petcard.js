/********************************************************************************************************************
 *                                                     储值卡信息
 ********************************************************************************************************************/

angular.module("petcardMoudle", []).controller('PetcardCtrl', ['$scope','$rootScope','$window','petcardData',
  	function($scope,$rootScope,$window,petcardData) {

		// 搜索储值卡用户
		$scope.search = ""

		petcardData.getData().then(function(data){
			$scope.petcards = data.petcards

		})
		
		$scope.searchMember = function(value){
			$scope.petcard = $scope.petcards.filter(function(ele){
				if(ele.phone.indexOf(value)>=0){
					return ele
				}
			})
		}

		// 查看储值卡详情
		$scope.memberDetail = function(id){
			petcardData.getIdData(id).then(function(data){
				$scope.petcard = data.petcard
			})
		}
	}
])









