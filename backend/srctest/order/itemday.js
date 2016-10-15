/********************************************************************************************************************
 *                                                      日报表页面
 ********************************************************************************************************************/

angular.module("itemDayMoudle", []).controller('ItemDayCtrl', 
    ['$scope','$window', '$http', '$state','$alert','itemData',
    function($scope,$window, $http, $state,$alert,itemData) {
    	$window.document.title = "品项报告"
        /*分页*/
        $scope.itemsPerPage = 8
        $scope.currentPage = 1
        /*生成所有报表，并且返回链接*/
        itemData.getItemDayData().then(function(data){
            if(data.items != "undefined"){
                $scope.item=data.items
                $scope.item.forEach(function(value,index){
                    
                    itemData.downloadItemDayData(value).then(function(data){
                        value.link = data.link
                        value.file = data.file
                    })
                })
            }
            

        })

    }
])