/********************************************************************************************************************
 *                                                     储值卡信息
 ********************************************************************************************************************/

angular.module("petcardMoudle", []).controller('PetcardCtrl', ['$scope', '$rootScope', '$window', 'petcardData', 'petruleData', 'domainData', 'pospayData',
    function($scope, $rootScope, $window, petcardData, petruleData, domainData, pospayData) {

        // 搜索储值卡用户
        $scope.search = ""
        $scope.petcardNum = null
        $scope.sexes = ['男', '女']
        $scope.payTypeArr = ['现金', '微信', '支付宝']
        $scope.petcard = {
                phone: null
            }
            //初始化执行流程
        updateCombo()
        getData()

        //会员卡套餐
        function updateCombo() {
            petruleData.getData().then(function(data) {
                $scope.petrules = data.petrules
                $scope.petcard.petrule = data.petrules[0]._id
                $scope.petcard.fee = data.petrules[0].fee
                $scope.petcard.bonus = data.petrules[0].bonus
                $scope.petcard.balance = data.petrules[0].fee + data.petrules[0].bonus

            })
        }

        // 充值
        $scope.saveFunc = function() {
            $scope.petcard.pay_type = 0
            petcardData.updateData($scope.petcard).then(function(data) {
                $scope.changeAlert(data.msg)
                if (data.status == 1) {
                    $scope.petcard = {
                        phone: null
                    }
                    updateCombo()
                    getData()
                }
            })

        }

        //左侧会员列表
        function getData() {
            petcardData.getData().then(function(data) {
                $scope.petcardall = data.petcards
                $scope.petcards = $scope.petcardall
            })
        }

        //搜索
        $scope.searchPetcard = function(value) {
            $scope.petcards = $scope.petcardall.filter(function(ele) {
              if (ele.phone) {
                if(ele.phone.indexOf(value)>=0){
                  return ele
                }
              }
            })
        }
        //变化监测
        $scope.change = function(value) {

            $scope.petcard.fee = value.fee
            $scope.petcard.bonus = value.bonus
            $scope.petcard.balance = value.fee + value.bonus

        }

        $scope.selectOne = function(value) {
            $scope.petcard.phone = value

        }

        // 查看储值卡详情
        $scope.petcardDetail = function(id) {
            petcardData.getIdData(id).then(function(data) {
                $scope.petcard = data.petcard
            })
        }

        // 添加会员卡 ->  领卡错误时候，通过手动添加  * 2017-03-02 frankyoung  bug repair
        $scope.addPetcard = function(value) {
            petcardData.addPetcard(value).then(function(data) {
                $scope.changeAlert(data.msg)
                if (data.status == 1) {
                    updateCombo()
                    getData()
                }
            })

        }

        $scope.outwrap = false
        $scope.wechatHide = true
        $scope.cashboxHide = true
        $scope.selectType = function(value, index) {
            $scope.auth_code = ""
            $scope.alipay_auth_code = ""
            if (value == "现金") {
                $scope.outwrap = false
                $scope.wechatHide = false
                $scope.cashboxHide = false
            } else if (value == "微信") {
                $scope.outwrap = true
                $scope.wxshow = true
                $scope.alipayshow = false
                $scope.changeAlert("已选择微信刷卡支付，请用扫码枪扫描卡号！")

                //禁止手动结账
                $scope.wechatHide = true
                    //聚焦使用扫码枪
                document.getElementById("pet-wechat").focus()
            } else if (value == "支付宝") {
                $scope.outwrap = true
                $scope.alipayshow = true
                $scope.wxshow = false
                $scope.changeAlert("已选择支付宝刷卡支付，请用扫码枪扫描卡号！")

                $scope.wechatHide = true
                document.getElementById("pet-alipay").focus()
            }
        }

        //存入本地店id
        domainData.getShopidData().then(function(data) {
            var shopid = data.shopid
            localStorage.shopid = shopid
        })

        //微信刷卡支付
        $scope.wechatPosPay = function(code) {
            $scope.petcard.pay_type = 1
            petcardData.updateData($scope.petcard).then(function(data) {

                if (data.status == 1) {
                    var shopid = localStorage.shopid
                    var time = new Date().getTime()
                    var value = {
                        total_fee: $scope.petcard.fee,
                        auth_code: code,
                        device_info: shopid,
                        out_trade_no: shopid + time + ""
                    }

                    pospayData.setData(value).then(function(data) {
                        $scope.changeAlert(data.msg)
                        if (data.status === 1) {
                            $scope.wechatHide = false
                            $scope.petcard = {
                                phone: null
                            }
                            updateCombo()
                            getData()
                            $scope.outwrap = false
                            $scope.wechatHide = true
                        } else if (data.status === 2) { //需要输入密码，这时去查询订单的状态
                            var interval = setInterval(function() {
                                pospayData.orderData(value).then(function(orderdata) {
                                    $scope.changeAlert(orderdata.msg)
                                    if (orderdata.status === 1) {
                                        clearInterval(interval)
                                        $scope.wechatHide = false
                                        $scope.petcard = {
                                            phone: null
                                        }
                                        updateCombo()
                                        getData()
                                        $scope.outwrap = false
                                        $scope.wechatHide = true
                                    }
                                })
                            }, 5000)
                        }
                    })

                } else {
                    $scope.changeAlert(data.msg)
                }
            })

        }

        //支付宝刷卡支付
        $scope.alipayPosPay = function(code) {
            $scope.petcard.pay_type = 2
            petcardData.updateData($scope.petcard).then(function(data) {

                if (data.status == 1) {
                    var shopid = localStorage.shopid
                    var time = new Date().getTime()
                    var value = {
                        total_fee: $scope.petcard.fee,
                        auth_code: code,
                        device_info: shopid,
                        out_trade_no: shopid + time + ""
                    }

                    pospayData.setalipayData(value).then(function(data) {
                        $scope.changeAlert(data.msg)
                        if (data.status === 1) {
                            $scope.wechatHide = false
                            $scope.petcard = {
                                phone: null
                            }
                            updateCombo()
                            getData()
                            $scope.outwrap = false
                            $scope.wechatHide = true
                        } else if (data.status === 2) { //需要输入密码，这时去查询订单的状态
                            var interval = setInterval(function() {
                                pospayData.alipayOrderData(value).then(function(orderdata) {
                                    $scope.changeAlert(orderdata.msg)
                                    if (orderdata.status === 1) {
                                        clearInterval(interval)
                                        $scope.wechatHide = false
                                        $scope.petcard = {
                                            phone: null
                                        }
                                        updateCombo()
                                        getData()
                                        $scope.outwrap = false
                                        $scope.wechatHide = true
                                    }
                                })
                            }, 5000)
                        }
                    })

                } else {
                    $scope.changeAlert(data.msg)
                }
            })

        }

    }
])
