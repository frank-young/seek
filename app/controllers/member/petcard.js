var Petcard = require('../../models/member/petcard'),
    Petcardorder = require('../../models/member/petcardorder'),
    Domain = require('../../models/domain'),
    _ = require('underscore'),
    https = require('https'),
    request = require('request'),
    fs = require('fs')

//储值卡列表页
exports.list = function(req, res) {
        var user = req.session.user
        Petcard.fetch(function(err, petcards) {
            res.json({
                status: "1",
                msg: "操作成功",
                petcards: petcards
            })
        })
    }
    //储值卡更新、新建
exports.save = function(req, res) {
        var petcardObj = req.body.petcard
        var user = req.session.user

        petcardObj.code = '960904691623'
        petcardObj.edit_people = user.name
        petcardObj.domainlocal = user.domain

        var _petcard
        _petcard = new Petcard(petcardObj)
        _petcard.save(function(err, petcard) {
            if (err) {
                console.log(err)
            }
            res.json({ msg: "添加成功", status: 1 })
        })
    }
    //储值卡充值
exports.update = function(req, res) {
    var petcardObj = req.body.petcard,
        user = req.session.user,
        _petcard,
        rePhone = /^1[3|5|4|7|8]\d{9}$/
    var old_petcard = {
        old_fee: req.body.petcard.fee,
        old_bonus: req.body.petcard.bonus,
        old_pay_type: req.body.petcard.pay_type
    }

    petcardObj.edit_people = user.name
    petcardObj.domainlocal = user.domain

    if (petcardObj.phone == "" || petcardObj.phone == null || petcardObj.phone == "undefined") {
        res.json({
            status: 0,
            msg: "手机号不能为空！"
        })
    } else if (petcardObj.balance == "" || petcardObj.balance == null || petcardObj.balance == "undefined") {
        res.json({
            status: 0,
            msg: "充值金额不能为空！"
        })
    } else if (rePhone.test(petcardObj.phone) == false) {
        res.json({
            status: 0,
            msg: "手机号格式不正确！"
        })
    } else {
        Petcard.findOne({ "phone": petcardObj.phone }, function(err, petcard) {
            if (!petcard) {
                res.json({ msg: "手机号不存在", status: 0 })
            } else {
                if (err) {
                    res.json({ msg: "发生错误，请联系管理员！", status: 0 })
                } else {
                    Domain.findOne({ "name": user.domain }, function(err, domain) {
                        record_balance = '充值成功！充值金额：' + Math.round(petcardObj.fee * 100) / 100 + '元,赠送金额：' + Math.round(petcardObj.bonus * 100) / 100 + '元。'
                        petcardObj.position = domain.pname
                        petcardObj.fee = Math.round(petcardObj.fee * 100) / 100 + petcard.fee
                        petcardObj.bonus = Math.round(petcardObj.bonus * 100) / 100 + petcard.bonus
                        petcardObj.balance = Math.round(petcardObj.balance * 100) / 100 + petcard.balance

                        _petcard = _.extend(petcard, petcardObj)
                        _petcard.save(function(err, petcarddata) {
                            if (err) {
                                console.log(err)
                            }
                            //这里需要同步 微信数据，这时再将 fee ，bonus balance *100

                            var formdata = {
                                "code": petcarddata.code,
                                "card_id": petcarddata.cardid,
                                "record_bonus": "",
                                "bonus": petcard.int,
                                "balance": parseInt(petcarddata.balance * 100),
                                "record_balance": record_balance,
                                "notify_optional": {
                                    "is_notify_bonus": true,
                                    "is_notify_balance": true,
                                    "is_notify_custom_field1": true
                                }
                            }
                            updateMember(formdata, old_petcard, petcarddata, user, res) //微信更新会员卡接口
                        })
                    })
                }
            }
        })
    }
}

//储值卡消费
exports.reduce = function(req, res) {
    var petcardObj = req.body.petcard
    var user = req.session.user
    var _petcard
    var recode = /^\d{12}$/
    var old_petcard = null

    petcardObj.edit_people = user.name
    petcardObj.domainlocal = user.domain

    if (petcardObj.code == "" || petcardObj.code == null || petcardObj.code == "undefined") {
        res.json({
            status: 0,
            msg: "卡号不能为空！"
        })
    } else if (petcardObj.total_fee == "" || petcardObj.total_fee == null || petcardObj.total_fee == "undefined") {
        res.json({
            status: 0,
            msg: "消费金额不能为空！"
        })
    } else if (recode.test(petcardObj.code) == false) {
        res.json({
            status: 0,
            msg: "卡号格式不正确！"
        })
    } else {
        Petcard.findOne({ "code": petcardObj.code }, function(err, petcard) {
            if (!petcard) {
                res.json({ msg: "卡号不存在", status: 0 })
            } else {
                if (err) {
                    res.json({ msg: "系统错误，请联系管理员！", status: 0 })
                } else {
                    if (petcardObj.total_fee > petcard.balance) {
                        res.json({
                            status: 0,
                            msg: "余额不足，请充值！"
                        })
                    } else {
                        record_balance = '您的储值会员卡成功在Seek Cafe消费' + Math.round(petcardObj.total_fee * 100) / 100 + '元,欢迎下次光临！'
                        record_bonus = ''

                        petcardObj.balance = petcard.balance - Math.round(petcardObj.total_fee * 100) / 100
                        petcardObj.int = petcard.int + petcardObj.total_fee

                        _petcard = _.extend(petcard, petcardObj)
                        _petcard.save(function(err, petcarddata) {
                            if (err) {
                                console.log(err)
                            }

                            var formdata = {
                                "code": petcarddata.code,
                                "card_id": petcarddata.cardid,
                                "record_bonus": record_bonus,
                                "bonus": parseInt(petcard.int + petcardObj.total_fee),
                                "balance": parseInt(petcarddata.balance * 100),
                                "record_balance": record_balance,
                                "notify_optional": {
                                    "is_notify_bonus": true,
                                    "is_notify_balance": true,
                                    "is_notify_custom_field1": true
                                }
                            }

                            updateMember(formdata, old_petcard, petcarddata, user, res)

                        })
                    }

                }

            }
        })
    }
}

exports.updateadmin = function(req, res) {
    var petcardObj = req.body.petcard
    var user = req.session.user
    var _petcard

    Petcard.findOne({ "phone": petcardObj.phone }, function(err, petcard) {
        if (!petcard) {
            res.json({ msg: "手机号不存在", status: 0 })
        } else {
            if (err) {
                res.json({ msg: "发生错误！", status: 0 })
            } else {
                _petcard = _.extend(petcard, petcardObj)
                _petcard.save(function(err, petcarddata) {
                    if (err) {
                        console.log(err)
                    }
                    res.json({ msg: "更新成功！", status: 1 })
                })
            }
        }
    })
}

//储值卡详情页
exports.detail = function(req, res) {
    var id = req.params.id //拿到id的值
    Petcard.findById(id, function(err, petcard) {
        res.json({
            petcard: petcard
        })
    })
}


function updateMember(formdata, old_petcard, petcarddata, user, res) {
    var access_token = fs.readFileSync('./config/token').toString();
    var url = 'https://api.weixin.qq.com/card/membercard/updateuser?access_token=' + access_token

    var options = {
        url: url,
        form: JSON.stringify(formdata),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            console.log(data)

            tempReplay(old_petcard, petcarddata, user, res)

        }
    })
}

//发送模板消息函数
function tempReplay(old_petcard, petcarddata, user, res) {

    if (old_petcard != null && old_petcard != "" && old_petcard != "undefined") {
        saveOrder(old_petcard, petcarddata, user, res)
    } else {
        res.json({
            msg: "操作成功！",
            status: 1,
            petcard: petcarddata
        })
    }
}

//存入订单信息
function saveOrder(old_petcard, petcarddata, user, res) {

    var date = new Date(),
        order_num = user.domain + date.getTime()

    var Y = createTime().Y,
        M = createTime().M,
        D = createTime().D

    var fee = Math.round(old_petcard.old_fee * 100) / 100,
        bonus = Math.round(old_petcard.old_bonus * 100) / 100,
        cashincome = 0,
        wxincome = 0,
        alipayincome = 0

    if (old_petcard.old_pay_type == 0) {
        cashincome = fee
    } else if (old_petcard.old_pay_type == 1) {
        wxincome = fee
    } else {
        alipayincome = fee
    }
    var _petcardorder = new Petcardorder({
        order_num: order_num,
        username: petcarddata.username,
        phone: petcarddata.phone,
        code: petcarddata.code,
        pay_type: old_petcard.old_pay_type,
        cashincome: cashincome,
        wxincome: wxincome,
        alipayincome: alipayincome,
        fee: fee,
        bonus: bonus,
        balance: petcarddata.balance, //余额
        start: petcarddata.start,
        year: Y,
        month: M,
        day: D,
        edit_people: user.name,
        userlocal: user.email,
        domainlocal: user.domain
    })

    _petcardorder.save(function(err, order) {
        if (err) {
            console.log(err)
        } else {
            res.json({ msg: "充值成功！", status: 1 })
        }
    })

}
// 今日订单
exports.petcardtoday = function(req, res) {
    var user = req.session.user
    var date =createTime(),
        Y = date.Y,
        M = date.M,
        D = date.D

    Petcardorder.fetch({ "domainlocal": user.domain, "year": Y, "month": M, "day": D }, function(err, petcardorders) {
        var fee = 0,
            bonus = 0

        petcardorders.forEach(function(value,index){
            fee += value.fee
            bonus += value.bonus

        })
        res.json({
            msg: "请求成功",
            status: 1,
            fee: fee,
            bonus:bonus
        })
    })
}

exports.petcardsome = function(req, res) {
    var user = req.session.user,
        id = req.params.id
    var Y = id.substr(0,4),
        M = id.substr(4,2),
        D = id.substr(6,2)


    Petcardorder.fetch({ "domainlocal": user.domain, "year": Y, "month": M, "day": D }, function(err, petcardorders) {
        var fee = 0,
            bonus = 0

        petcardorders.forEach(function(value,index){
            fee += value.fee
            bonus += value.bonus

        })
        res.json({
            msg: "请求成功",
            status: 1,
            fee: fee,
            bonus:bonus
        })
    })
}


function createTime() {
    var date = new Date(),
        Y = date.getFullYear(),
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
        D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())

    return {
        Y: Y,
        M: M,
        D: D,
        date: Y + '年' + M + '月' + D + '日'
    }
}
