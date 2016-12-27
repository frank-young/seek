var Admin = require('../../models/admin/admin')

exports.index = function(req, res) {
    var _admin = req.session.admin
    res.render('admin/index', {
        title: '首页',
        role: _admin.role,
        name: _admin.name
    })
}

exports.account = function(req, res) {
    var _admin = req.session.admin
    Admin.fetch({ "role": { "$lte": 10 } }, function(err, admins) {
        // 查询权限小于10的数据
        res.render('admin/account_list', {
            title: '会计账户管理',
            status: 1,
            admins: admins,
            name: _admin.name
        })

    })

}

exports.accountAdd = function(req, res) {
    var _admin = req.session.admin
    res.render('admin/account_add', {
        title: '添加会计账户',
        name: _admin.name
    })
}

exports.report = function(req, res) {
    var _admin = req.session.admin
    res.render('admin/report', {
        title: '财务报表',
        name: _admin.name
    })
}

exports.item = function(req, res) {
    var _admin = req.session.admin
    res.render('admin/item', {
        title: '品项报表',
        name: _admin.name
    })
}


//注册
exports.ctrlaccountAdd = function(req, res) {

    var _admin = req.body.account
    _admin.role = 10
    var rePhone = /^1[3|5|7|8]\d{9}$/
    var rePassword = /^[\w\@\.\_]+$/

    //验证
    if (_admin.phone == "" || _admin.phone == null) {
        res.json({
            status: 0,
            msg: "手机号不能为空！"
        })
    } else if (rePhone.test(_admin.phone) == false) {
        res.json({
            status: 0,
            msg: "手机号格式不正确！"
        })
    } else if (_admin.password == "" || _admin.password == null) {
        res.json({
            status: 0,
            msg: "密码不能为空！"
        })
    } else if (rePassword.test(_admin.password) == false) {
        res.json({
            status: 0,
            msg: "密码格式不正确，必须为字母、数字、下划线！"
        })
    } else if (_admin.password.length < 6) {
        res.json({
            status: 0,
            msg: "密码长度必须大于6位，小于20位！"
        })
    } else if (_admin.password.length > 20) {
        res.json({
            status: 0,
            msg: "密码长度必须大于6位，小于20位！"
        })
    } else {
        Admin.findOne({ phone: _admin.phone }, function(err, phone) {
            if (phone) {
                res.json({
                    status: 0,
                    msg: "手机号已经使用！"
                })
            } else {

                var admin = new Admin(_admin)

                admin.save(function(err, admindata) {
                    if (err) {
                        res.json({
                            status: 0,
                            msg: "发生未知错误！"
                        })
                    }

                    res.json({
                        status: 1,
                        msg: "添加成功！"
                    })
                })

            }
        })
    }
}

exports.del = function(req, res) {
    var id = req.query.id
    if (id) {
        Admin.remove({ _id: id }, function(err, quotation) {
            if (err) {
                res.json({
                    status: "0",
                    msg: "发生错误!",
                    err: err
                })
            } else {
                res.json({ status: 1, msg: "删除成员成功!" })
            }
        })
    }
}

exports.ctrlaccount = function(req, res) {
    Admin.fetch({ "role": { "$lte": 10 } }, function(err, admins) {
        // 查询权限小于10的数据
        res.json({
            status: "1",
            admins: admins
        })
    })
}


exports.ctrlreport = function(req, res) {
    res.render('admin/report', {
        title: '财务报表'
    })
}
