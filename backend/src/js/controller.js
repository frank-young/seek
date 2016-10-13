/**
 * 左侧 menu 菜单
 */

angular.module('navleftMoudle',[]).controller('NavleftCtrl', ['$scope', '$http',
	function ($scope, $http) {
		$scope.menus = [
		{
			icon:'fa fa-file-pdf-o',
			title:'订单管理',
			role:0,
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
					text:'日报表',
					link:'web.orderDay'
				},
				{
					text:'日品项报告',
					link:'web.itemDay'
				}
			]
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
					text:'其他',
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
]);    /********************************************************************************************************************
 *                                                      全部菜品页面
 ********************************************************************************************************************/

angular.module("dishMoudle", []).controller('DishCtrl', 
    ['$scope','$window', '$http', '$state','$alert','dishData','cateData',
    function($scope,$window, $http, $state,$alert,dishData,cateData) {
	$window.document.title = "菜品列表"
    /* 顶部固定按钮 */
    $scope.pinShow = false;
    /* 栏目按钮显示隐藏 */
	$scope.allShow = false;
	$scope.pinShowFunc = function(){
        $scope.pinShow = !$scope.pinShow
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

    if(localStorage.dish){
        $scope.dish = JSON.parse(localStorage.dish)
    }else{
        $scope.dish ={   
            "isTop":false,
            "checked":false,
            "isChecked":false,
            "number":0,
            "name":"",
            "price":null,
            "cate":"0",
            "search":"",
            "ishost":false,
            "other1":"", 
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
            $scope.changeAlert(data.msg);
        })
        cateData.getData().then(function (data) {
            $scope.cate = data.cates
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
            label:'默认分类'+(value+1)
        }
        cateData.addData(msgadd).then(function(data){
            $scope.changeAlert(data.msg);
        });
        cateData.getData().then(function (data) {
            $scope.cate = data.cates;
        })
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
 *                                                      菜品详情页面
 ********************************************************************************************************************/

angular.module("dishDetailMoudle", []).controller('DishDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','dishData','cateData',
    function($scope,$window, $http, $stateParams,$alert,dishData,cateData) {
	$window.document.title = "菜品详情";
    /* 是否可编辑 */
	$scope.isEdit = true;
	/*菜品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    }) 
    var date = new Date();
    /* 菜品详情请求 */
    dishData.getIdData($stateParams.id).then(function (data) {
       $scope.dish=data.dish; 

    })

    $scope.saveDish = function(value){
        dishData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        })
    }
   
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
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
            $scope.changeAlert(data.msg);
        });
        cateData.getData().then(function (data) {
            $scope.cate = data.cates;

        });
    }

    $scope.clone = function(){
        localStorage.dish= JSON.stringify($scope.dish);
        localStorage.showImages= JSON.stringify($scope.dish.path);
    }

}]);;/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', 
  ['$scope','$window','orderData',
  	function($scope,$window,orderData) {

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
	  	

	}
])



;/********************************************************************************************************************
 *                                                      日报表页面
 ********************************************************************************************************************/

angular.module("itemDayMoudle", []).controller('ItemDayCtrl', 
    ['$scope','$window', '$http', '$state','$alert','orderData',
    function($scope,$window, $http, $state,$alert,orderData) {
    	$window.document.title = "品项报告"
        /*分页*/
        $scope.itemsPerPage = 8
        $scope.currentPage = 1
        /*生成所有报表，并且返回链接*/
        orderData.getItemDayData().then(function(data){
            $scope.order=data.orders
            $scope.order.forEach(function(value,index){
                
                orderData.downloadItemDayData(value).then(function(data){
                    value.link = data.link
                    value.file = data.file
                })
            })

        })

    }
]);    /********************************************************************************************************************
 *                                                      全部订单页面
 ********************************************************************************************************************/

angular.module("orderMoudle", []).controller('OrderCtrl', 
    ['$scope','$window', '$http', '$state','$alert','orderData',
    function($scope,$window, $http, $state,$alert,orderData) {
	$window.document.title = "日报表"
    /* 顶部固定按钮 */
    $scope.pinShow = false;
    /* 栏目按钮显示隐藏 */
	$scope.allShow = false;
    $scope.payTypeArr = ['现金','微信','支付宝','会员卡','次卡']
	$scope.pinShowFunc = function(){
        $scope.pinShow = !$scope.pinShow
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
    ['$scope','$window', '$http', '$stateParams','$alert','orderData',
    function($scope,$window, $http, $stateParams,$alert,orderData) {
	$window.document.title = "订单详情";
    /* 是否可编辑 */
	$scope.isEdit = true;

    var date = new Date();
    $scope.payTypeArr = ['现金支付','微信支付','支付宝支付','会员卡支付']
    
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
 *                                                      成员列表页面
 ********************************************************************************************************************/

angular.module("teamMoudle", []).controller('TeamCtrl', 
    ['$scope','$window', '$http', '$state','$alert','settingData',
    function($scope,$window, $http, $state,$alert,settingData) {
        $window.document.title = "收银员管理";
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
            var index = findIndex(value,$scope.team);
            $scope.team.splice(index,1);   //删除
            customerData.updateData(value);
        }
    }
    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.team){
            $scope.team[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.team){
                $scope.checkArr.push($scope.team[i]);
                $scope.team[i].isChecked = true;
                
            }
    } 
    /* 删除栏目 ----批量操作 */
    $scope.deleteTeam = function(value){
        var deleteConfirm = confirm('您确定要删除这位成员吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.team);
                $scope.team[index].isChecked = false;  //去掉标记位
                $scope.team.splice(index,1);   //删除
                customerData.updateData(value[i]);
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        } 
    } 
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
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
    ];
    $scope.user = {
					name:"",
					email:"",
					password:"",
					section:"",
					position:"",
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
                window.history.go(-1);
        });
    }

    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:3});
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
    ];
    settingData.getIdData($stateParams.id).then(function (data) {
       $scope.user=data.user; 
    });

    $scope.saveUser = function(value){
    	settingData.updatecopyData(value).then(function(data){
			$scope.changeAlert(data.msg)
        });
    } 
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}]) 
 

