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
						text:'储值会员卡',
						link:'web.petcard'
					},
					{
						text:'储值会员卡套餐',
						link:'web.petrule'
					}
				]
			},
			{
				icon:'fa fa-wechat',
				title:'微信端',
				role:10,
				subs:[
					{
						text:'会员卡',
						link:'web.wechat'
					},
					{
						text:'优惠券',
						link:'web.wechat'
					},
					{
						text:'其他',
						link:'web.wechat'
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
 *                                                      产品分类页面
 ********************************************************************************************************************/

angular.module("creditMoudle", ['ng-sortable']).controller('CreditCtrl', 
    ['$scope','$window', '$http', '$alert','$state','creditData',
    function($scope,$window, $http,$alert, $state,creditData) {
	$window.document.title = "菜品分类"
    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        } 
    } 
    /*产品分类*/ 
    creditData.getData().then(function(data){
        $scope.cate=data.credits;
    })
    /* 添加分类信息 */
    $scope.addCate= function(){
        var value = $scope.cate.length
        var msgadd = {
            checked: false,
            isEdit: true,
            value:value,
            label:'姓名'+(value+1)
        }
        creditData.addData(msgadd).then(function(data){
            $scope.changeAlert(data.msg);
        });
        creditData.getData().then(function (data) {
            $scope.cate = data.credits;
        })
    }
    /* 保存单条分类信息 */
    $scope.saveCate= function(value){
        if(value.isEdit == true){
            creditData.updateData(value).then(function (data) {
                $scope.changeAlert(data.msg);
            });
        } 
    }
    /* 删除单条分类信息 */
    $scope.deleteCate= function(value){
        var deleteConfirm = confirm('您确定要删除这个人吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.cate);
            $scope.cate.splice(index,1);   //删除
            creditData.deleteData(value).then(function(data){
                $scope.changeAlert(data.msg);
            })
            /* 更新数据value索引值 */
            $scope.cate.forEach( function(element, index) {
                element.value = index;
                creditData.updateData(element);
            });
        }
    }

}]);;/********************************************************************************************************************
 *                                                      产品分类页面
 ********************************************************************************************************************/

angular.module("paytypeMoudle", ['ng-sortable']).controller('PaytypeCtrl', 
    ['$scope','$window', '$http', '$alert','$state','paytypeData',
    function($scope,$window, $http,$alert, $state,paytypeData) {
	$window.document.title = "菜品分类"
    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            } 
        } 
    } 
    /*产品分类*/
    paytypeData.getData().then(function(data){
        $scope.cate=data.paytypes;
    })
    /* 添加分类信息 */
    $scope.addCate= function(){
        var value = $scope.cate.length
        var msgadd = {
            checked: false,
            isEdit: true,
            value:value,
            label:'支付'+(value+1)
        }
        paytypeData.addData(msgadd).then(function(data){
            paytypeData.getData().then(function (datain) {
                $scope.cate = datain.paytypes;
            })
            $scope.changeAlert(data.msg);
            
        });
        
    }
    /* 保存单条分类信息 */
    $scope.saveCate= function(value){
        if(value.isEdit == true){
            paytypeData.updateData(value).then(function (data) {
                $scope.changeAlert(data.msg);
            });
        } 
    }
    /* 删除单条分类信息 */
    $scope.deleteCate= function(value){
        var deleteConfirm = confirm('您确定要删除这个支付方式吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.cate);
            $scope.cate.splice(index,1);   //删除
            paytypeData.deleteData(value).then(function(data){
                $scope.changeAlert(data.msg);
            })
            /* 更新数据value索引值 */
            $scope.cate.forEach( function(element, index) {
                element.value = index;
                paytypeData.updateData(element);
            });
        }
    }

}]);;    /********************************************************************************************************************
 *                                                      全部菜品页面
 ********************************************************************************************************************/

angular.module("dishMoudle", []).controller('DishCtrl', 
    ['$scope','$window', '$http', '$state','$alert','dishData','cateData',
    function($scope,$window, $http, $state,$alert,dishData,cateData) {
	$window.document.title = "菜品列表"
    /* 顶部固定按钮 */
    $scope.pinShow = false
    $scope.comboShow = false
    /* 栏目按钮显示隐藏 */
	$scope.allShow = false
	$scope.pinShowFunc = function(){
        $scope.pinShow = !$scope.pinShow
    }
    $scope.comboShowFunc = function(){
        $scope.comboShow = !$scope.comboShow
    }
	/* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        }  
    }    
	/*分页*/
    $scope.itemsPerPage = 8;
    // $scope.totalItems = 6;
    $scope.currentPage = 1;
    /*菜品*/
    dishData.getData().then(function(data){
        $scope.dish=data.dishs;
    })
    /*菜品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })
    /* 固定/取消固定 位置  ----栏目位置*/
    $scope.pinItem = function(value){
        value.isTop = !value.isTop;
        dishData.updateData(value);
        
    }
    /* 选择查看固定位置 */
    $scope.pinSortFunc = function(value){
        $scope.pinSort = value;
    }

    /***************************** 以下是顶部导航栏批量操作 **************************************/
    /* 多选框选择 */
    $scope.checkArr = [];
    $scope.isChecked = function(value){
        if(value.isChecked){        //通过判断是否选中
            $scope.checkArr.push(value);
        }else{
            var index = findIndex(value,$scope.checkArr);
            // var index = $scope.checkArr.indexOf(value);
            if(index != -1){
                $scope.checkArr.splice(index,1);
            }
        }
    }
    /* 删除单件菜品 */
    $scope.deleteDish = function(value){
        var deleteConfirm = confirm('您确定要删除这件菜品吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.dish);
            $scope.dish.splice(index,1);   //删除
            dishData.deleteData(value);
        }
    }
    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.dish){
            $scope.dish[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.dish){
                $scope.checkArr.push($scope.dish[i]);
                $scope.dish[i].isChecked = true;
            }
    }
    /* 固定 ----批量操作*/
    $scope.surePin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.dish);
            $scope.dish[index].isTop = true;      //固定
            $scope.dish[index].isChecked = false;  //去掉标记位，也就是去掉勾
            dishData.updateData(value[i]);
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 取消固定 ----批量操作*/
    $scope.cancelPin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.dish);
            $scope.dish[index].isTop = false;      //取消固定
            $scope.dish[index].isChecked = false;  //去掉标记位，也就是去掉勾
            dishData.updateData(value[i]);
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 删除栏目 ----批量操作 */
    $scope.deleteDishMore = function(value){
        var deleteConfirm = confirm('您确定要删除这些菜品吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.dish);
                $scope.dish[index].isChecked = false;  //去掉标记位
                $scope.dish.splice(index,1);   //删除
                dishData.deleteData(value[i]);
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        }
    }
}]);/********************************************************************************************************************
 *                                                      新建菜品页面
 ********************************************************************************************************************/

angular.module("dishAddMoudle", []).controller('DishAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','dishData','cateData',
    function($scope,$window, $http, $state,$alert,dishData,cateData) {
	$window.document.title = "添加菜品"
    /*菜品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })

    $scope.isSale = [
        {value:0,label:"是"},
        {value:1,label:"否"}
    ]

    if(localStorage.dish){
        $scope.dish = JSON.parse(localStorage.dish)
    }else{
        $scope.dish ={   
            "isTop":false,
            "checked":false,
            "isChecked":false,
            "number":0,
            // "memberPrice": 0,
            "reducePrice": null,
            // "comboPrice": 0,
            // "otherPrice": 0,
            "name":"",
            "price":null,
            "cate":"0",
            "search":"",
            "ishost":0,
            "other1":2, 
            "other2":"", 
            "description":"",
            "history":'添加菜品'
        }
    }

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.dish= JSON.stringify($scope.dish);
    }, 6000);

    $scope.saveDish = function(value){
        dishData.addData(value).then(function(data){
            if(data.status==1){
                $scope.changeAlert(data.msg)
                window.history.go(-1)
                localStorage.removeItem("dish") 
                clearInterval(time)
            }else{
                $scope.changeAlert(data.msg)
            }
            
        })
    }

    /* 添加分類 */
    $scope.saveCate = function(value){
        var val = $scope.cate.length;
        var msgadd = {
            "value":val,
            "label":value,
            "isEdit":true,
            "checked":false
        }
        cateData.addData(msgadd).then(function(data){
            cateData.getData().then(function (datain) {
                $scope.cate = datain.cates
            })
            $scope.changeAlert(data.msg)
        })
        
    }
}]);/********************************************************************************************************************
 *                                                      产品分类页面
 ********************************************************************************************************************/

angular.module("dishCateMoudle", ['ng-sortable']).controller('DishCateCtrl', 
    ['$scope','$window', '$http', '$alert','$state','cateData',
    function($scope,$window, $http,$alert, $state,cateData) {
	$window.document.title = "菜品分类"
    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        } 
    } 
    /*产品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })
    /* 添加分类信息 */
    $scope.addCate= function(){
        var value = $scope.cate.length
        var msgadd = {
            checked: false,
            isEdit: true,
            value:value,
            label:'新添分类'+(value+1)
        }
        cateData.addData(msgadd).then(function(data){
            cateData.getData().then(function (datain) {
                $scope.cate = datain.cates;
            })
            $scope.changeAlert(data.msg);
        });
        
    }
    /* 保存单条分类信息 */
    $scope.saveCate= function(value){
        if(value.isEdit == true){
            cateData.updateData(value).then(function (data) {
                $scope.changeAlert(data.msg);
            });
        } 
    }
    /* 删除单条分类信息 */
    $scope.deleteCate= function(value){
        var deleteConfirm = confirm('您确定要删除这个分类吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.cate);
            $scope.cate.splice(index,1);   //删除
            cateData.deleteData(value).then(function(data){
                $scope.changeAlert(data.msg);
            })
            /* 更新数据value索引值 */
            $scope.cate.forEach( function(element, index) {
                element.value = index;
                cateData.updateData(element);
            });
        }
    }

}]);;/********************************************************************************************************************
 *                                                      新建套餐页面
 ********************************************************************************************************************/

angular.module("dishcomboAddMoudle", []).controller('DishcomboAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','$filter','dishData','cateData',
    function($scope,$window, $http, $state,$alert,$filter,dishData,cateData) {
	$window.document.title = "添加套餐"
    /*套餐分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates
    })

    // 所有菜品
    $scope.dishAll = []
    dishData.getData().then(function(data){

        data.dishs.forEach(function(ele,index){
            if(ele.other1 != 1){
               
                var d = {
                    value:ele.name,
                    label:ele.name + ' （原价：' +  $filter('currency')(ele.price,'￥') +'）',
                    price:ele.price
                }
                $scope.dishAll.push(d)
            }
           
        })
    })

    if(localStorage.dishcombo){
        $scope.dish = JSON.parse(localStorage.dishcombo)
    }else{
        $scope.dish ={   
            "isTop":false,
            "checked":false,
            "isChecked":false,
            "number":0,
            "reducePrice": null,
            "name":"",
            "cate":0,
            "price":0,
            "dishArr":[],
            "search":"",
            "ishost":"2",
            "other1":1,     //标记是否是套餐
            "other2":"", 
            "description":"",
            "history":'添加套餐'
        }
    }

    $scope.dish.dishArr = [{dishSelect:"",dishPrice:null}]
    
    // 添加新菜品
    $scope.addDish = function(){
        $scope.dish.dishArr.push({dishSelect:"",dishPrice:0})
    }

    // 监听价格，更新套餐总价
    $scope.$watch('dish.dishArr', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var sum = 0 
            $scope.dish.dishArr.forEach(function(ele){
                sum += parseFloat(ele.dishPrice)
            })
            $scope.dish.price = angular.copy(sum)
        }
       
    },true)

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.dishcombo= JSON.stringify($scope.dish)
    }, 6000)

    $scope.saveDish = function(value){
        dishData.addData(value).then(function(data){
            if(data.status==1){
                $scope.changeAlert(data.msg)
                window.history.go(-1)
                localStorage.removeItem("dishcombo") 
                clearInterval(time)
            }else{
                $scope.changeAlert(data.msg)
            }
            
        })
    }

    /* 添加分類 */
    $scope.saveCate = function(value){
        var val = $scope.cate.length;
        var msgadd = {
            "value":val,
            "label":value,
            "isEdit":true,
            "checked":false
        }
        cateData.addData(msgadd).then(function(data){
            cateData.getData().then(function (datain) {
                $scope.cate = datain.cates
            })
            $scope.changeAlert(data.msg);
        })
        
    }
}]);/********************************************************************************************************************
 *                                                      菜品详情页面
 ********************************************************************************************************************/

angular.module("dishcomboDetailMoudle", []).controller('DishcomboDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','$filter','dishData','cateData',
    function($scope,$window, $http, $stateParams,$alert,$filter,dishData,cateData) {
	$window.document.title = "菜品详情";
    /* 是否可编辑 */
	$scope.isEdit = true;
	/*菜品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    }) 

    var date = new Date()
    /* 菜品详情请求 */
    dishData.getIdData($stateParams.id).then(function (data) {
       $scope.dish=data.dish

    })
    // 所有菜品
    $scope.dishAll = []
    dishData.getData().then(function(data){

        data.dishs.forEach(function(ele,index){
            if(ele.other1 != 1){
               
                var d = {
                    value:ele.name,
                    label:ele.name + ' （原价：' +  $filter('currency')(ele.price,'￥') +'）',
                    price:ele.price
                }
                $scope.dishAll.push(d)
            }
           
        })

    })
   
    // 监听价格，更新套餐总价
    $scope.$watch('dish.dishArr', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var sum = 0 
            $scope.dish.dishArr.forEach(function(ele){
                sum += parseFloat(ele.dishPrice)
            })
            $scope.dish.price = angular.copy(sum)
        }
       
    },true)

    $scope.saveDish = function(value){
        dishData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        })
    }
   
    /* 添加分類 */
    $scope.saveCate = function(value){
         
        var val = $scope.cate.length;
        var msgadd = {
            "value":val,
            "label":value,
            "isEdit":true,
            "checked":false
        }

        cateData.addData(msgadd).then(function(data){
            cateData.getData().then(function (datain) {
                $scope.cate = datain.cates;

            });
            $scope.changeAlert(data.msg);
        });
        
    }

    $scope.cloneCombo = function(){
        localStorage.dishcombo= JSON.stringify($scope.dish);

    }

}]);;/********************************************************************************************************************
 *                                                      菜品详情页面
 ********************************************************************************************************************/

angular.module("dishDetailMoudle", []).controller('DishDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','$filter','dishData','cateData',
    function($scope,$window, $http, $stateParams,$alert,$filter,dishData,cateData) {
	$window.document.title = "菜品详情";
    /* 是否可编辑 */
	$scope.isEdit = true;
	/*菜品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    }) 
    $scope.isSale = [
        {value:"0",label:"是"},
        {value:"1",label:"否"}
    ]

    var date = new Date()
    /* 菜品详情请求 */
    dishData.getIdData($stateParams.id).then(function (data) {
       $scope.dish=data.dish

    })

    $scope.saveDish = function(value){
        dishData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        })
    }
   
    /* 添加分類 */
    $scope.saveCate = function(value){
         
        var val = $scope.cate.length;
        var msgadd = {
            "value":val,
            "label":value,
            "isEdit":true,
            "checked":false
        }

        cateData.addData(msgadd).then(function(data){
            cateData.getData().then(function (datain) {
                $scope.cate = datain.cates;

            });
            $scope.changeAlert(data.msg);
        });
        
    }

    $scope.clone = function(){
        localStorage.dish= JSON.stringify($scope.dish);
    }


}]);;/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', 
  ['$scope','$window','orderData','settingData','petcardData',
  	function($scope,$window,orderData,settingData,petcardData) {

	  	$window.document.title = "seek cafe";
	  	var date = new Date()
	  	$scope.year = date.getFullYear()
	  	$scope.month = date.getMonth()+1
	  	var value = {
	  		"year": $scope.year,
	  		"month": $scope.month
	  	}
	  	orderData.downloadData(value).then(function(data){
	  		$scope.link = data.link
	  		$scope.file = data.file
	  	})

	  	// $scope.memberNum
	  	//总业绩查询
	  	orderData.getGradeTodayData().then(function(data){
	  		$scope.data = data
	  	})
	  	// 权限控制
		settingData.getRbac().then(function(data){
			$scope.role = data.rbac
		})

		petcardData.getTodayOrderData().then(function(data){
	  		$scope.fee = data.fee
	  		$scope.bonus = data.bonus

	  	})

	}
])



;/********************************************************************************************************************
 *                                                      储值卡套餐列表页面
 ********************************************************************************************************************/

angular.module("teamMoudle", []).controller('TeamCtrl', 
    ['$scope','$window', '$http', '$state','$alert','settingData',
    function($scope,$window, $http, $state,$alert,settingData) {
        $window.document.title = "储值卡套餐管理";

    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){ 
            if (obj[i] == current) {
                return i;
            }
        }
    }

    

    /*分页*/
    $scope.itemsPerPage = 8;

    $scope.currentPage = 1;


    /***************************** 以下是顶部导航栏批量操作 **************************************/
    /* 多选框选择 */
    $scope.checkArr = [];
    $scope.isChecked = function(value){
        if(value.isChecked){        //通过判断是否选中
            $scope.checkArr.push(value);
        }else{
            var index = findIndex(value,$scope.checkArr);
            // var index = $scope.checkArr.indexOf(value);
            if(index != -1){
                $scope.checkArr.splice(index,1);
            }
        }
        
    }
    /* 删除储值卡套餐 */
    $scope.deleteTeam = function(value){
        var deleteConfirm = confirm('您确定要删除这个储值卡套餐吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.user);
            $scope.user.splice(index,1);   //删除
            settingData.deleteData(value);
        }
    }
    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.user){
            $scope.user[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.user){
                $scope.checkArr.push($scope.user[i]);
                $scope.user[i].isChecked = true;
                
            }
    } 
    /* 删除栏目 ----批量操作 */
    $scope.deleteTeamAll = function(value){
        var deleteConfirm = confirm('您确定要删除这个储值卡套餐吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.user);
                $scope.user[index].isChecked = false;  //去掉标记位
                $scope.user.splice(index,1);   //删除
                settingData.deleteData(value[i]);
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        } 
    } 

}])


;/********************************************************************************************************************
 *                                                      储值卡列表页面
 ********************************************************************************************************************/

angular.module("petcardMoudle", []).controller('PetcardCtrl', 
    ['$scope','$window', '$http', '$state','$alert','petcardData',
    function($scope,$window, $http, $state,$alert,petcardData) {
        $window.document.title = "储值卡管理";

    petcardData.getData().then(function(data){
    	$scope.petcards = data.petcards

    })

    /*分页*/
    $scope.itemsPerPage = 8;
    $scope.currentPage = 1;


}])


;/********************************************************************************************************************
 *                                                      储值卡详情页面
 ********************************************************************************************************************/

angular.module("petcardDetailMoudle", []).controller('PetcardDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','petcardData',
    function($scope,$window, $http, $stateParams,$alert,petcardData) {
    $window.document.title = "储值卡详情";
    $scope.isEdit = true
    $scope.sexs = [
        {"value":"0","label":"男"}, 
        {"value":"1","label":"女"}
    ]
    $scope.uses = [
        {"value":1,"label":"启用"},
        {"value":0,"label":"禁用"},
        {"value":2,"label":"挂失"}
    ]
    petcardData.getIdData($stateParams.id).then(function (data) {
       $scope.petcard=data.petcard
    })

    $scope.savePetcard = function(value){
        petcardData.updateData($scope.petcard).then(function(data){
            $scope.changeAlert(data.msg)
            if(data.status==1){
                window.history.go(-1)
            }
        })
    }

}]) 
 

;/********************************************************************************************************************
 *                                                      储值卡套餐列表页面
 ********************************************************************************************************************/

angular.module("petruleMoudle", []).controller('PetruleCtrl', 
    ['$scope','$window', '$http', '$state','$alert','petruleData',
    function($scope,$window, $http, $state,$alert,petruleData) {
        $window.document.title = "储值卡套餐管理";

    petruleData.getData().then(function(data){
    	$scope.petrules = data.petrules

    })

    /*分页*/
    $scope.itemsPerPage = 8;
    $scope.currentPage = 1;


}])


;/********************************************************************************************************************
 *                                                      添加储值卡套餐页面
 ********************************************************************************************************************/

angular.module("petruleAddMoudle", []).controller('PetruleAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','petruleData',
    function($scope,$window, $http, $state,$alert,petruleData) {
    $window.document.title = "添加储值卡套餐";
    $scope.sexs = [
        {"value":"0","label":"男"}, 
        {"value":"1","label":"女"}
    ]
    $scope.uses = [
        {"value":0,"label":"启用"},
        {"value":1,"label":"禁止"}
    ]
    $scope.petrule = {
                    fee:100,
                    bonus:20,
                    consume:1,
                    int:1,
                    status:0
                }
    $scope.savePetrule = function(value){
        $scope.petrule.name = '充值'+$scope.petrule.fee+'元，赠送'+$scope.petrule.bonus+'元'
        petruleData.addData($scope.petrule).then(function(data){
            $scope.changeAlert(data.msg)
            if(data.status==1){
                window.history.go(-1)
            }
        })
    }
}])


;/********************************************************************************************************************
 *                                                      储值卡套餐详情页面
 ********************************************************************************************************************/

angular.module("petruleDetailMoudle", []).controller('PetruleDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','petruleData',
    function($scope,$window, $http, $stateParams,$alert,petruleData) {
    $window.document.title = "储值卡套餐详情";
    $scope.isEdit = true
    $scope.sexs = [
        {"value":"0","label":"男"}, 
        {"value":"1","label":"女"}
    ]
    $scope.uses = [
        {"value":0,"label":"启用"},
        {"value":1,"label":"禁用"}
    ]
    petruleData.getIdData($stateParams.id).then(function (data) {
       $scope.petrule=data.petrule
    });

    $scope.savePetrule = function(value){
        $scope.petrule.name = '充值'+$scope.petrule.fee+'元，赠送'+$scope.petrule.bonus+'元'
        petruleData.updateData($scope.petrule).then(function(data){
            $scope.changeAlert(data.msg)
            if(data.status==1){
                window.history.go(-1)
            }
        })
    }

    $scope.deletePetrule = function(){
        var deleteConfirm = confirm('您确定要删除这个套餐吗？');
        if(deleteConfirm){
            petruleData.deleteData($stateParams.id).then(function(data){
                $scope.changeAlert(data.msg)
                if(data.status==1){
                    window.history.go(-1)
                }
            })
        }
    }

}]) 
 

;/********************************************************************************************************************
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
]);/********************************************************************************************************************
 *                                                      品项报告详情页面
 ********************************************************************************************************************/

angular.module("itemDetailMoudle", []).controller('ItemDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','orderData','itemData',
    function($scope,$window, $http, $stateParams,$alert,orderData,itemData) {
	$window.document.title = "品项报告详情"

    itemData.getIdData($stateParams.id).then(function(data){
        $scope.items = data.items
        $scope.total_fee = 0
        $scope.items.forEach(function(value){
            $scope.total_fee += value.total
        })
    })
    
    $scope.nowtime = new Date().getTime()
    $scope.printOrder = function(){
        $scope.nowtime = new Date().getTime()
        console.log($scope.nowtime)
        printFunc('print-item')
    }



    function printFunc(id){
        var ele = document.getElementById(id)
        var content = document.getElementById('print-content')
        
        var newObj=ele.cloneNode(true)
        content.innerHTML = ""
        content.appendChild(newObj)
        window.print()
        content.innerHTML = ""

    } 

}]);    /********************************************************************************************************************
 *                                                      全部订单页面
 ********************************************************************************************************************/

angular.module("orderMoudle", []).controller('OrderCtrl', 
    ['$scope','$window', '$http', '$state','$alert','orderData','paytypeData',
    function($scope,$window, $http, $state,$alert,orderData,paytypeData) {
	$window.document.title = "日报表"
    /* 顶部固定按钮 */
    $scope.pinShow = false;
    /* 栏目按钮显示隐藏 */
	$scope.allShow = false;
    
	$scope.pinShowFunc = function(){
        $scope.pinShow = !$scope.pinShow
    }

    //获取支付方式
    paytypeData.getData().then(function(data){
        $scope.payTypeArr = data.paytypes.map(function(value){
            return value.label
        })
    })
    
	/* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i; 
            }
        }  
    }    
	/*分页*/
    $scope.itemsPerPage = 8;
    $scope.currentPage = 1;
    /*订单*/
    orderData.getData().then(function(data){
        $scope.order=data.orders;
    })
    /* 固定/取消固定 位置  ----栏目位置*/
    $scope.pinItem = function(value){
        value.isTop = !value.isTop;
        orderData.updateData(value)
        
    }
    /* 选择查看固定位置 */
    $scope.pinSortFunc = function(value){
        $scope.pinSort = value;
    }

    /***************************** 以下是顶部导航栏批量操作 **************************************/
    /* 多选框选择 */
    $scope.checkArr = [];
    $scope.isChecked = function(value){
        if(value.isChecked){        //通过判断是否选中
            $scope.checkArr.push(value);
        }else{
            var index = findIndex(value,$scope.checkArr);
            // var index = $scope.checkArr.indexOf(value);
            if(index != -1){
                $scope.checkArr.splice(index,1);
            }
        }
    }
    /* 删除单件订单 */
    $scope.deleteOrder = function(value){
        var deleteConfirm = confirm('您确定要删除这件订单吗？');
        if(deleteConfirm){
            console.log('12212')
            var index = findIndex(value,$scope.order);
            $scope.order.splice(index,1);   //删除
            orderData.deleteData(value);
        }
    }
    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.order){
            $scope.order[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.order){
                $scope.checkArr.push($scope.order[i]);
                $scope.order[i].isChecked = true;
            }
    }
    /* 固定 ----批量操作*/
    $scope.surePin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.order);
            $scope.order[index].isTop = true;      //固定
            $scope.order[index].isChecked = false;  //去掉标记位，也就是去掉勾
            orderData.updateData(value[i]);
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 取消固定 ----批量操作*/
    $scope.cancelPin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.order);
            $scope.order[index].isTop = false;      //取消固定
            $scope.order[index].isChecked = false;  //去掉标记位，也就是去掉勾
            orderData.updateData(value[i]);
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 删除栏目 ----批量操作 */
    $scope.deleteOrderMore = function(value){
        var deleteConfirm = confirm('您确定要删除这些订单吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.order);
                $scope.order[index].isChecked = false;  //去掉标记位
                $scope.order.splice(index,1);   //删除
                orderData.deleteData(value[i]);
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        }
    }
}]);/********************************************************************************************************************
 *                                                      新建订单页面
 ********************************************************************************************************************/

angular.module("orderAddMoudle", []).controller('OrderAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','orderData',
    function($scope,$window, $http, $state,$alert,orderData) {
	$window.document.title = "添加订单"

    if(localStorage.order){
        $scope.order = JSON.parse(localStorage.order)
    }else{
        $scope.order ={   
            "isTop":false,
            "checked":false,
            "isChecked":false,
            "number":0,
            "name":"",
            "price":null,
            "search":"",
            "ishost":false,
            "other1":"", 
            "other2":"", 
            "description":"", 
            "history":'添加订单'
        }
    }

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.order= JSON.stringify($scope.order);
    }, 6000);

    $scope.saveOrder = function(value){
        orderData.addData(value).then(function(data){
            if(data.status==1){
                $scope.changeAlert(data.msg)
                window.history.go(-1)
                localStorage.removeItem("order") 
                clearInterval(time)
            }else{
                $scope.changeAlert(data.msg)
            }
            
        })
    }

}]);/********************************************************************************************************************
 *                                                      日报表页面
 ********************************************************************************************************************/

angular.module("orderDayMoudle", []).controller('OrderDayCtrl', 
    ['$scope','$window', '$http', '$state','$alert','orderData',
    function($scope,$window, $http, $state,$alert,orderData) {
    	$window.document.title = "订单列表"
        /*分页*/
        $scope.itemsPerPage = 8
        $scope.currentPage = 1
        /*生成所有报表，并且返回链接*/
        orderData.getDayData().then(function(data){
            $scope.order=data.orders
            $scope.order.forEach(function(value,index){
                
                orderData.downloadDayData(value).then(function(data){
                    value.link = data.link
                    value.file = data.file
                })
            })

        })

    }
]);/********************************************************************************************************************
 *                                                      订单详情页面
 ********************************************************************************************************************/

angular.module("orderDetailMoudle", []).controller('OrderDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','orderData','paytypeData',
    function($scope,$window, $http, $stateParams,$alert,orderData,paytypeData) {
	$window.document.title = "订单详情";
    /* 是否可编辑 */
	$scope.isEdit = true;

    var date = new Date();
    //获取支付方式
    paytypeData.getData().then(function(data){
        $scope.payTypeArr = data.paytypes.map(function(value){
            return value.label
        })
    })
    
    /* 订单详情请求 */
    orderData.getIdData($stateParams.id).then(function (data) {
       $scope.order=data.order; 

    })

    $scope.saveOrder = function(value){
        orderData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        })
    }
   
    $scope.clone = function(){
        localStorage.order= JSON.stringify($scope.order);
        localStorage.showImages= JSON.stringify($scope.order.path);
    }

    $scope.printOrder = function(){
        $scope.nowtime = new Date().getTime()
        console.log($scope.nowtime)
        printFunc('print')
    }

        function printFunc(id){
            var ele = document.getElementById(id)
            var content = document.getElementById('print-content')
            
            var newObj=ele.cloneNode(true)
            content.innerHTML = ""
            content.appendChild(newObj)
            window.print()
            content.innerHTML = ""

        } 

}]);;/********************************************************************************************************************
 *                                                      月报表页面
 ********************************************************************************************************************/

angular.module("orderMonthMoudle", []).controller('OrderMonthCtrl', 
    ['$scope','$window', '$http', '$state','$alert','orderData',
    function($scope,$window, $http, $state,$alert,orderData) {
    	$window.document.title = "月报表"
        /*分页*/
        $scope.itemsPerPage = 5;
        $scope.currentPage = 1;
        /*生成所有报表，并且返回链接*/
        orderData.getMonthData().then(function(data){
            $scope.order=data.orders;
            $scope.order.forEach(function(value,index){
                
                orderData.downloadData(value).then(function(data){
                    value.link = data.link
                    value.file = data.file
                })
            })

        })


    }
]);/********************************************************************************************************************
 *                                                      品项报告详情页面
 ********************************************************************************************************************/

angular.module("overDetailMoudle", []).controller('OverDetailCtrl', ['$scope', '$window', '$http', '$stateParams', '$alert', 'orderData', 'itemData', 'overData', 'domainData', 'payorderData', 'petcardData',
    function($scope, $window, $http, $stateParams, $alert, orderData, itemData, overData, domainData, payorderData, petcardData) {
        $window.document.title = "结班报告详情"

        orderData.getGradeAllData($stateParams.id).then(function(data) {
            $scope.overAll = data
        })

        // 获取所有人的结班报告
        overData.getTodayData($stateParams.id).then(function(odata) {
            $scope.overs = odata.overs
            console.log(odata.overs)
        })

        //获取微信支付金额
        domainData.getShopidData().then(function(data) {
            payorderData.getData(data.shopid, $stateParams.id).then(function(wxdata) {
                $scope.wxpospay = wxdata.wxpospay
            })
        })

        //获取支付宝支付金额
        domainData.getShopidData().then(function(data) {
            payorderData.getAlipayData(data.shopid, $stateParams.id).then(function(alipaydata) {
                $scope.alipospay = alipaydata.alipospay
            })
        })

        petcardData.getTodayData($stateParams.id).then(function(data) {
            $scope.fee = data.fee
            $scope.bonus = data.bonus
            $scope.cash = data.cashincome
            $scope.wx = data.wxincome
            $scope.alipay = data.alipayincome
        })

        $scope.nowtime = new Date().getTime()
        $scope.printOver = function() {
            $scope.nowtime = new Date().getTime()
            console.log($scope.nowtime)
            printFunc('print-over')
        }

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
;/********************************************************************************************************************
 *                                                      账号设置
 ********************************************************************************************************************/

angular.module("selfsetMoudle", []).controller('SelfetCtrl', 
    ['$scope','$window', '$http','$alert','domainData','settingData',
    function($scope,$window, $http,$alert, domainData,settingData) {
    $window.document.title = "账号设置";

    $scope.setting={
        password:"",
        newpassword:"",
        surepassword:""
    }

    settingData.getPhone().then(function(data){
        $scope.setting.phone = data.phone
        $scope.setting.name = data.name
    })

    $scope.saveSetting = function(value){
        settingData.selfsetData(value).then(function(data){
            $scope.changeAlert(data.msg)
            if(data.status==1){
                setTimeout(function(){
                    $window.location.href="/logout"
                },2000)
            }
        })
    }

}]) 
 

 ;/********************************************************************************************************************
 *                                                      门店设置
 ********************************************************************************************************************/

angular.module("setMoudle", []).controller('SetCtrl', 
    ['$scope','$window', '$http','$alert','domainData',
    function($scope,$window, $http,$alert, domainData) {
    $window.document.title = "门店设置";
    $scope.isEdit = true
    
    domainData.getData().then(function(data){
        $scope.domain = data.domain
    })

    $scope.saveDomain = function(value){
        domainData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg)
        })
    }
    
}]) 
 

 ;/********************************************************************************************************************
 *                                                      成员列表页面
 ********************************************************************************************************************/

angular.module("teamMoudle", []).controller('TeamCtrl', 
    ['$scope','$window', '$http', '$state','$alert','settingData',
    function($scope,$window, $http, $state,$alert,settingData) {
        $window.document.title = "收银员管理";
    $scope.roles = [
        {"value":0,"label":"收银员"},
        {"value":1,"label":"财务"},
        {"value":2,"label":"其他"}
    ]
    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){ 
            if (obj[i] == current) {
                return i;
            }
        }
    }

    settingData.getListData().then(function(data){
    	$scope.user = data.users
        // $scope.changeAlert(data.msg);
        $scope.user.forEach(function(ele){
            ele.isChecked=false
        })
    })

    /*分页*/
    $scope.itemsPerPage = 8;

    $scope.currentPage = 1;

    /***************************** 以下是顶部导航栏批量操作 **************************************/
    /* 多选框选择 */
    $scope.checkArr = [];
    $scope.isChecked = function(value){
        if(value.isChecked){        //通过判断是否选中
            $scope.checkArr.push(value);
        }else{
            var index = findIndex(value,$scope.checkArr);
            // var index = $scope.checkArr.indexOf(value);
            if(index != -1){
                $scope.checkArr.splice(index,1);
            }
        }
        
    }
    /* 删除成员 */
    $scope.deleteTeam = function(value){
        var deleteConfirm = confirm('您确定要删除这位成员吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.user);
            $scope.user.splice(index,1);   //删除
            settingData.deleteData(value);
        }
    }
    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.user){
            $scope.user[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.user){
                $scope.checkArr.push($scope.user[i]);
                $scope.user[i].isChecked = true;
                
            }
    } 
    /* 删除栏目 ----批量操作 */
    $scope.deleteTeamAll = function(value){
        var deleteConfirm = confirm('您确定要删除这位成员吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.user);
                $scope.user[index].isChecked = false;  //去掉标记位
                $scope.user.splice(index,1);   //删除
                settingData.deleteData(value[i]);
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        } 
    } 

}])


;/********************************************************************************************************************
 *                                                      添加成员页面
 ********************************************************************************************************************/

angular.module("teamAddMoudle", []).controller('TeamAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','settingData',
    function($scope,$window, $http, $state,$alert,settingData) {
    $window.document.title = "添加收银员";
    $scope.sexs = [
        {"value":"0","label":"男"}, 
        {"value":"1","label":"女"}
    ]
    $scope.roles = [
        {"value":0,"label":"收银员"},
        {"value":1,"label":"财务"},
        {"value":2,"label":"其他"}
    ]
    $scope.user = {
					name:"",
					email:"",
					password:"",
					section:"",
					role:0,
					tel:"",
					phone:"",
					fax:"",
					sex:"0",
					class:"0",
                    domain:"",
                    birthday:0
				}
    $scope.saveUser = function(value){
    	settingData.addData(value).then(function(data){
                $scope.changeAlert(data.msg)
                if(data.status == 1){
                    window.history.go(-1);
                }
        });
    }


}])


;/********************************************************************************************************************
 *                                                      成员详情页面
 ********************************************************************************************************************/

angular.module("teamDetailMoudle", []).controller('TeamDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','settingData',
    function($scope,$window, $http, $stateParams,$alert,settingData) {
    $window.document.title = "收银员详情";
    $scope.isEdit = true;
    $scope.sexs = [
        {"value":"0","label":"男"},
        {"value":"1","label":"女"}
    ]
    $scope.roles = [
        {"value":0,"label":"收银员"},
        {"value":1,"label":"财务"},
        {"value":2,"label":"其他"}
    ]
    settingData.getIdData($stateParams.id).then(function (data) {
       $scope.user=data.user
    });

    $scope.saveUser = function(value){
    	settingData.updatecopyData(value).then(function(data){
			$scope.changeAlert(data.msg)
        })
    } 

}]) 
 

;/********************************************************************************************************************
 *                                                      成员列表页面
 ********************************************************************************************************************/

angular.module("wechatMoudle", []).controller('WechatCtrl', 
    ['$scope','$window', '$http', '$state','$alert',
    function($scope,$window, $http, $state,$alert) {
        $window.document.title = "微信端管理";

        $scope.saveWechat = function(){

        }  
}])


