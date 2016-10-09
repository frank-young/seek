/**
 * 左侧 menu 菜单
 */

angular.module('navleftMoudle',[]).controller('NavleftCtrl', ['$scope', '$http',
	function ($scope, $http) {
		$scope.menus = [
		{
			icon:'fa fa-file-pdf-o',
			title:'报表',
			role:0,
			subs:[
				{
					text:'月报表',
					link:'web.quotation'
				},
				{
					text:'日报表',
					link:'web.quotationAdd'
				}			]
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
					text:'报价单设置',
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
    $scope.itemsPerPage = 5;
    // $scope.totalItems = 6;
    $scope.currentPage = 1;
    /*产品*/
    dishData.getData().then(function(data){
        $scope.dish=data.dish;
    })
    /*产品分类*/
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
    /* 删除单件产品 */
    $scope.deletedish = function(value){
        var deleteConfirm = confirm('您确定要删除这件产品吗？');
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
    $scope.deletedish = function(value){
        var deleteConfirm = confirm('您确定要删除这件产品吗？');
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
 *                                                      新建产品页面
 ********************************************************************************************************************/

angular.module("dishAddMoudle", ['ngFileUpload']).controller('DishAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','dishData','cateData','Upload',
    function($scope,$window, $http, $state,$alert,dishData,cateData,Upload) {
	$window.document.title = "添加菜品"
    /*产品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })
    var date = new Date();
    if(localStorage.dish){
        $scope.dish = JSON.parse(localStorage.dish)
    }else{
        $scope.dish ={   
            "isTop":false,
            "name":"",
            "model":"",
            "cate":"",
            "people":"", 
            "editpeople":"",
            "description":"",
            "size":"",
            "quantity":"",
            "weight":"",
            "path":[],
            "img":""
        }
    }
    $scope.dish.path = [];
    $scope.mulImages = [];
    if(localStorage.showImages){
        $scope.dish.path = JSON.parse(localStorage.showImages)
    }

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.dish= JSON.stringify($scope.dish);
    }, 6000);

    $scope.$watch('files', function () {
        $scope.selectImage($scope.files);
    });
    //根据选择的图片来判断 是否为一下子选择了多张
    //一下子选择多张的数据格式为一个数组中有多个对象，而一次只选择一张的数据格式为一个数组中有一个对象
    $scope.selectImage = function (files) {
        if (!files || !files.length) {
            return;
        }
        if (files.length > 1) {
            angular.forEach(files, function (item) {
                var image = [];
                image.push(item);
                $scope.mulImages.push(image);
            })
        } else {
            $scope.mulImages.push(files);
        }
    };
    $scope.deteleImage = function(value){
        var delconfirm = confirm('是否要删除这张图片？');
        if(delconfirm){
            var index = $scope.mulImages.indexOf(value);
            $scope.mulImages.splice(index,1);
        }

    }
    $scope.deteleShowImage = function(value){
        var delconfirm = confirm('是否要删除这张图片？');
        if(delconfirm){
            var index = $scope.dish.path.indexOf(value);
            dishData.deleteImgData(value).then(function(data){
                $scope.changeAlert(data.msg);
                $scope.dish.path.splice(index,1);
                localStorage.showImages = JSON.stringify($scope.dish.path)
            })
        }

    } 

    $scope.upload = function () {
        if (!$scope.mulImages.length) {
            return; 
        }

        var files = $scope.mulImages;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
                Upload.upload({
                url: '/dish/upload',   
                // fields: {'username': $scope.username},
                file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    $scope.mulImages = [];
                    $scope.changeAlert(data.msg);
                    $scope.dish.path.push(data.path)
                    localStorage.showImages = JSON.stringify($scope.dish.path)
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
            })
        }
    }

    $scope.saveDish = function(value){
        if(value.path!=[]){
            value.img = value.path[0]
        }
        dishData.addData(value).then(function(data){
            $scope.changeAlert(data.msg);
            window.history.go(-1);
            localStorage.removeItem("dish");
            clearInterval(time);
            localStorage.removeItem('showImages')
        });
    }

    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:3});
    }

    /* 添加分類 */
    $scope.saveCate = function(value){
        var val = $scope.cate.length;
        var msgadd = {
            "value":val,
            "label":value,
            "isEdit":true
        }

        cateData.addData(msgadd).then(function(data){
            $scope.changeAlert(data.msg);
        });
        cateData.getData().then(function (data) {
            $scope.cate = data.cates;
        });
    }
}]);;/********************************************************************************************************************
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
        var value = $scope.cate.length;
        cateData.addData({"value":value,"isEdit":true,"label":'默认分类'+(value+1)}).then(function(data){
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
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
    /* 监听items ，发送数据 */
    // $scope.$watch('cate', function(newVal, oldVal) {
    //     if (newVal !== oldVal) {
    //        //向服务器发请求，顺序已改变
    //        console.log(newVal)
    //     }
    // }, true);
}]);;/********************************************************************************************************************
 *                                                      产品详情页面
 ********************************************************************************************************************/

angular.module("dishDetailMoudle", []).controller('DishDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','dishData','cateData','Upload',
    function($scope,$window, $http, $stateParams,$alert,dishData,cateData, Upload) {
	$window.document.title = "菜品详情";
    /* 是否可编辑 */
	$scope.isEdit = true;
	/*产品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    }) 
    var date = new Date();
    /* 产品详情请求 */
    dishData.getIdData($stateParams.id).then(function (data) {
       $scope.dish=data.dish; 

    });
    $scope.mulImages = [];
    $scope.$watch('files', function () {
        $scope.selectImage($scope.files);
    });

    $scope.saveDish = function(value){
        dishData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        })
    }

    //根据选择的图片来判断 是否为一下子选择了多张
    //一下子选择多张的数据格式为一个数组中有多个对象，而一次只选择一张的数据格式为一个数组中有一个对象
    $scope.selectImage = function (files) {
        if (!files || !files.length) {
            return;
        }
        if (files.length > 1) {
            angular.forEach(files, function (item) {
                var image = [];
                image.push(item);
                $scope.mulImages.push(image);
            })
        } else {
            $scope.mulImages.push(files);
        }
    };
    $scope.deteleImage = function(value){
        var delconfirm = confirm('是否要删除这张图片？');
        if(delconfirm){
            var index = $scope.mulImages.indexOf(value);
            $scope.mulImages.splice(index,1);

        } 

    }
    $scope.deteleShowImage = function(value){
        var delconfirm = confirm('是否要删除这张图片？');
        if(delconfirm){
            var index = $scope.dish.path.indexOf(value);

            dishData.deleteImgData(value).then(function(data){
                $scope.dish.path.splice(index,1);
            })
        }

    } 
    $scope.upload = function () {
        if (!$scope.mulImages.length) {
            return; 
        }

        var files = $scope.mulImages;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
                Upload.upload({
                url: '/dish/upload',   
                file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    $scope.mulImages = [];
                    $scope.changeAlert(data.msg);
                    $scope.dish.path.push(data.path)
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
            })
        }
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
            "isEdit":true
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
  ['$scope','$window',
  function($scope,$window) {

	  $window.document.title = "seek cafe";

}])



