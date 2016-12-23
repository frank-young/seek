/********************************************************************************************************************
 *                                                     订单列表
 ********************************************************************************************************************/

angular.module("billlistMoudle", []).controller('BilllistCtrl', ['$scope', '$window', 'orderData', 'dishData', 'settingData', 'paytypeData', 'itemData', 'domainData',
    function($scope, $window, orderData, dishData, settingData, paytypeData, itemData, domainData) {

  //       var wxordering = JSON.parse(localStorage.getItem('wxordering'))

		// wxordering.forEach(function(v,i){
		// 	console.log(v.order_num)
		// })

        orderData.getData().then(function(data) {
            $scope.orders = data.orders
        })


        $scope.payTypeArr = []
            //获取支付方式
        paytypeData.getData().then(function(data) {
            $scope.payTypeArr = data.paytypes.map(function(value) {
                return value.label
            })
        })

        $scope.cookAll = []
        dishData.getData().then(function(data) {
                $scope.cookAll = data.dishs
            })
            // 权限控制
        settingData.getRbac().then(function(data) {
            $scope.role = data.rbac
        })

        // 业绩查询
        orderData.getGradeData().then(function(data) {
            $scope.grade = data.grade
            $scope.username = data.username
            $scope.noincome = data.noincome

        })

        $scope.lookAll = function(id) {
            orderData.getIdData(id).then(function(data) {
                $scope.order = data.order
            })
        }

        // 反位结算，删除本单，重新下单
        $scope.againAccount = function(value) {
            localStorage.cook = JSON.stringify(value.dish)
            localStorage.peopleNumber = value.peopleNum
            value.dish.forEach(function(v1, i1) {
                $scope.cookAll.forEach(function(v2, i2) {
                    if (v1.name == v2.name) {
                        v2.checked = true
                        v2.number = 1
                    }
                })
            })
            localStorage.cookAll = JSON.stringify($scope.cookAll)

            orderData.deleteData(value).then(function(data) {
                $scope.changeAlert("反位结算成功！")
            })
            itemData.deletesomeData(value.orderNum).then(function(data) {

            })

        }
        $scope.nowtime = new Date().getTime()
        $scope.printRec = function(value) {
            $scope.nowtime = new Date().getTime()
            printFunc(value)
        }

        domainData.getShopidData().then(function(data) {
            $scope.shopid = data.shopid
        })

        // 打印函数
        function printFunc(id) {
            var ele = document.getElementById(id)
            var content = document.getElementById('print-content')

            var newObj = ele.cloneNode(true)
            content.innerHTML = ""
            content.appendChild(newObj)
            window.print()
            content.innerHTML = ""

        }

    }
])
