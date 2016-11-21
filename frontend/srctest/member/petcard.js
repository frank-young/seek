/********************************************************************************************************************
 *                                                     储值卡信息
 ********************************************************************************************************************/

angular.module("petcardMoudle", []).controller('PetcardCtrl', ['$scope','$rootScope','$window','petcardData',
  	function($scope,$rootScope,$window,petcardData) {

		// 搜索储值卡用户
		$scope.search = ""
		$scope.sexes = ['男','女']
		$scope.petcard={
			sex:'男',
			pettype:'1',
			birthday:null
		}
		$scope.pettypes = [
			{value:'1',label:'充100送20'},
			{value:'2',label:'充200送50'}
		]

		$scope.sureFunc = function(){
			var history = [],
				fee=100,
				bonus=20

			history.unshift({msg:'充值'+fee+'元'})

			$scope.petcard.has_active = true
			$scope.petcard.status = 1
			$scope.petcard.card_grade = 0
			$scope.petcard.int = 0
			$scope.petcard.bonus = bonus
			$scope.petcard.fee = fee
			$scope.petcard.history = history

			console.log($scope.petcard)
			// petcardData.addData(petcard).then(function(){
			// 	$scope.changeAlert("添加成功！")
			// })
		}

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









