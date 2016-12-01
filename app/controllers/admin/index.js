
exports.index = function(req, res) {
    res.render('admin/index', {
        title: '首页'
    })
}

exports.account = function(req, res) {
    res.render('admin/account_list', {
        title: '会计账户管理'
    })
}

exports.accountAdd = function(req, res) {
    res.render('admin/account_add', {
        title: '添加会计账户'
    })
}

exports.accountDetail = function(req, res) {
    res.render('admin/account_detail', {
        title: '编辑会计账户'
    })
}

exports.report = function(req, res) {
    res.render('admin/report', {
        title: '财务报表'
    })
}


