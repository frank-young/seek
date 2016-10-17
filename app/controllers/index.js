//前台首页
exports.index = function(req, res) {
    var user = req.session.user,             //session信息			
        domain = req.subdomains

    if(!user){                              // 未登录状态
      	return res.redirect('/signin')
    }else if(user.status !=1){
        return res.redirect('/verify')
    }else if(user.role == 1){                  // 登录权限管理  1：财务
        return res.redirect('../#/admin')
    }else if(!user.domain && user.status == 1){                 //未添加域名状态
      	return res.redirect('/domain/add')
    }else{                                  //程序主入口
	    /* 需要判断用户输入的二级域名和用户保存的二级域名是否一致*/
	    // if(domain == user.domain){
	        res.sendfile('frontend/src/app.html')
	    // }else{
	    //     console.log('账户信息不匹配,域名是'+domain)
	    //     return res.redirect('http://'+user.domain+'.nananb.com:3000')
	    // }
    }
}

//后台首页
exports.admin = function(req, res) {
    var user = req.session.user             //session信息            
    if(!user){                              // 未登录状态
        return res.redirect('../signin')
    }
    else if(user.role == 0){                  // 登录权限管理  0：收银员
        return res.redirect('../#/index')
    }
    else{
        res.sendfile('backend/src/app.html')
    }

}