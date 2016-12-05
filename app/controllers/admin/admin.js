var Admin = require('../../models/admin/admin') 


exports.showSignin = function(req, res) {
    res.render('admin/signin', {
        title: '登录页面'
    })
}

exports.showSignup = function(req, res) {
    res.render('admin/signup', {
        title: '注册页面'
    })
}

exports.setting = function(req, res) {
    var admin = req.session.admin

    res.render('admin/setting', {
        title: '修改密码',
        name: admin.name,
        phone: admin.phone

    })
}


//修改密码
exports.editpass = function(req, res) {
    var _admin = req.session.admin,
        password = req.body.admin.password,
        newpassword = req.body.admin.newpassword,
        surepassword = req.body.admin.surepassword,
        phone = req.body.admin.phone,
        name = req.body.admin.name

    var rePhone = /^1[3|5|7|8]\d{9}$/
    var rePassword = /^[\w\@\.\_]+$/

    if (password == "" || password == null) {
        res.json({
            status: 0,
            msg: "密码不能为空！"
        })
    } else if (name == "" || name == null) {
        res.json({
            status: 0,
            msg: "姓名不能为空！"
        })
    } else if (phone == "" || phone == null) {
        res.json({
            status: 0,
            msg: "手机号不能为空！"
        })
    } else if (rePhone.test(phone) == false) {
        res.json({
            status: 0,
            msg: "手机号格式不正确！"
        })
    } else if (rePassword.test(password) == false) {
        res.json({
            status: 0,
            msg: "密码格式不正确，必须为字母、数字、下划线！"
        })
    } else if (password.length < 6) {
        res.json({
            status: 0,
            msg: "密码长度必须大于6位，小于20位！"
        })
    } else if (password.length > 20) {
        res.json({
            status: 0,
            msg: "密码长度必须大于6位，小于20位！"
        })
    } else if (newpassword == "") {
        res.json({
            status: 0,
            msg: "新密码不能为空！"
        })
    } else if (newpassword !== surepassword) {
        res.json({
            status: 0,
            msg: "两次密码输入不一致！"
        })
    } else if (rePassword.test(newpassword) == false) {
        res.json({
            status: 0,
            msg: "新密码格式不正确，必须为字母、数字、下划线！"
        })
    } else if (newpassword.length < 6) {
        res.json({
            status: 0,
            msg: "新密码长度必须大于6位，小于20位！"
        })
    } else if (newpassword.length > 20) {
        res.json({
            status: 0,
            msg: "新密码长度必须大于6位，小于20位！"
        })
    } else {
        Admin.findOne({ "phone": _admin.phone }, function(err, admin) {
            if (err) {
                res.json({
                    status: 0,
                    msg: "发生未知错误！"
                })
            }
            if (!admin) {
                res.json({
                    status: 0,
                    msg: "用户不存在！"
                })
            } else {
                Admin.findOne({ "phone": phone }, function(err, phonedate) {
                    if (err) {
                        res.json({
                            status: 0,
                            msg: "发生未知错误！"
                        })
                    }
                    if (phonedate && phone != _admin.phone) {
                        res.json({
                            status: 0,
                            msg: "手机号已经存在，请重新输入！"
                        })
                    } else {
                        admin.comparePassword(password, function(err, isMatch) {
                            if (err) {
                                res.json({
                                    status: 0,
                                    msg: "发生未知错误！"
                                })
                            }
                            if (isMatch) {

                                Admin.findOne({ "phone": _admin.phone }, function(err, admin) {
                                    admin.password = newpassword
                                    admin.phone = phone
                                    admin.name = name
                                    admin.save(function(err, admin) {
                                        if (err) {
                                            res.json({
                                                status: 0,
                                                msg: " 发生未知错误！"
                                            })
                                        }
                                        res.json({
                                            status: 1,
                                            msg: "修改密码成功！"
                                        })

                                    })
                                })

                            } else {
                                res.json({
                                    status: 0,
                                    msg: "旧密码错误！"
                                })
                            }
                        })
                    }
                })


            }
        })
    }

}

//登录
exports.signin = function(req, res) {
    var _admin = req.body.admin,
        phone = _admin.phone,
        password = _admin.password

    var rePhone = /^1[3|5|7|8]\d{9}$/
    var rePassword = /^[\w\@\.\_]+$/

    if (_admin.phone == "" || _admin.phone == null) {
        res.json({
            status: 0,
            msg: "手机号不能为空！"
        })
    } else if (rePhone.test(phone) == false) {
        res.json({
            status: 0,
            msg: "手机号格式不正确！"
        })
    } else if (password == "" || _admin.password == null) {
        res.json({
            status: 0,
            msg: "密码不能为空！"
        })
    } else if (rePassword.test(password) == false) {
        res.json({
            status: 0,
            msg: "密码格式不正确，必须为字母、数字、下划线！"
        })
    } else if (password.length < 6) {
        res.json({
            status: 0,
            msg: "密码长度必须大于6位，小于20位！"
        })
    } else if (password.length > 20) {
        res.json({
            status: 0,
            msg: "密码长度必须大于6位，小于20位！"
        })
    } else {
        Admin.findOne({ phone: phone }, function(err, admin) {
            if (err) {
                res.json({
                    status: 0,
                    msg: "发生未知错误！"
                })
            }
            if (!admin) {
                res.json({
                    status: 0,
                    msg: "用户不存在！"
                })
            } else {
                admin.comparePassword(password, function(err, isMatch) {
                    if (err) {
                        res.json({
                            status: 0,
                            msg: "发生未知错误！"
                        })
                    }
                    if (isMatch) {
                        req.session.admin = admin
                        res.json({
                            status: 1,
                            msg: "登录成功！",
                            role: admin.role
                        })
                    } else {
                        res.json({
                            status: 0,
                            msg: "账号或密码错误！"
                        })
                    }
                })
            }
        })
    }

}

//注册
exports.signup = function(req, res) {

    var _admin = req.body.admin
    _admin.role = 20
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
                    msg: "手机号已经被注册！"
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
                        msg: "注册成功！"
                    })
                })

            }
        })

    }


}

//登出
exports.logout = function(req, res) {
    delete req.session.admin
    delete req.session.loginTime
    res.redirect('/manager/signin')
}

//登录权限
exports.signinRequired = function(req, res, next) {
        var admin = req.session.admin
        if (!admin) {
            return res.redirect('/manager/signin')
        }
        next()
    }
    //未登录登录权限 （登录注册页）
exports.signinUnRequired = function(req, res, next) {
    var admin = req.session.admin
    if (admin) {
        return res.redirect('/manager/index')
    }
    next()
}

//管理员权限
exports.adminRequired = function(req, res, next) {
    var admin = req.session.admin
    if (admin.role <= 10) {
        return res.redirect('/manager/signin')
    }
    next()
}

//超级管理员权限
exports.superRequired = function(req, res, next) {
    var admin = req.session.admin
    if (admin.role <= 10) {
        return res.json({ status: 1, msg: "你没有操作权限！" })
    } else {
        next()
    }

}
