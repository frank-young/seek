var Index = require('../app/controllers/index'),
    User = require('../app/controllers/user'),
    Domain = require('../app/controllers/domain'),
    Setting = require('../app/controllers/setting'),
    Wechat = require('../app/controllers/wechat/wechat'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart()

module.exports = function(app){
	app.use(function(req, res, next) {
    var _user = req.session.user
    app.locals.user = _user
    next()
  })

  //首页
	app.get('/', Index.index)

  // 用户信息
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/signin', User.signinUnRequired, User.showSignin)
  app.get('/register', User.signinUnRequired, User.showSignup)
  app.get('/logout', User.logout)
  app.get('/success', User.signSuccess)
  app.get('/forgot', User.forgot)
  app.post('/forgotsend', User.forgotSend)
  app.get('/successsend', User.successSend)
  app.get('/verify', User.signVerify)
  app.get('/resetpassword/:verify', User.resetpassword)
  app.post('/savepassword', User.savepassword)
  app.get('/successpassword', User.successpassword)
  app.get('/activation/:verify', User.signActivation)
  app.get('/admin/user/list', User.signinRequired,User.adminRequired, User.list)
  
  // 域名信息设置
  app.get('/domain/add',User.signinRequired,Domain.domainRequired, Domain.add )
  app.post('/domain/addctrl',User.signinRequired,Domain.domainRequired, Domain.addctrl )

  //user setting
  app.get('/setting', Setting.data)
  app.post('/setting/update', Setting.update)

  // 微信端接口
  app.get('/wechat/init',Wechat.init)
  app.get('/wechat/token',Wechat.token)
  app.get('/wechat/addmenu',Wechat.addMenu)
  app.get('/wechat/login',Wechat.login)
  app.get('/wechat/userinfo',Wechat.userinfo)
  app.get('/wechat/member_appaly',Wechat.memberAppaly)

}
