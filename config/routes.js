var Index = require('../app/controllers/index'),
    User = require('../app/controllers/user'),
    Domain = require('../app/controllers/domain'),
    Setting = require('../app/controllers/setting'),
    Dish = require('../app/controllers/dish/dish'),
    Cate = require('../app/controllers/dish/cate'),
    Order = require('../app/controllers/order/order'),
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
  
  // 门店信息设置
  app.get('/domain/add',User.signinRequired,Domain.domainRequired, Domain.add )
  app.post('/domain/addctrl',User.signinRequired,Domain.domainRequired, Domain.addctrl )
  app.post('/domain/update', User.signinRequired, Domain.update)
  app.get('/domain/detail', User.signinRequired, Domain.detail)

  // 菜品信息
  app.get('/dish',User.signinRequired, Dish.list)
  app.post('/dish/add',User.signinRequired, Dish.save)
  app.post('/dish/update', User.signinRequired, Dish.update)
  app.get('/dish/detail/:id', User.signinRequired, Dish.detail)
  app.delete('/dish/delete',User.signinRequired, Dish.del)

  //菜品分类
  app.get('/cate',User.signinRequired, Cate.list)
  app.post('/cate/add',User.signinRequired, Cate.save)
  app.post('/cate/update', User.signinRequired, Cate.update)
  app.delete('/cate/delete',User.signinRequired, Cate.del)

  //订单信息
  app.get('/order',User.signinRequired, Order.list)
  app.get('/order/month',User.signinRequired, Order.monthList)
  app.get('/order/day',User.signinRequired, Order.dayList)
  app.get('/order/itemday',User.signinRequired, Order.itemdayList)
  app.post('/order/add',User.signinRequired, Order.save )
  app.post('/order/update', User.signinRequired, Order.update)
  app.get('/order/detail/:id', User.signinRequired, Order.detail)
  app.delete('/order/delete',User.signinRequired, Order.del)
  app.get('/order/download',User.signinRequired, Order.downloadMonth)
  app.get('/order/downloadday',User.signinRequired, Order.downloadDay)
  app.get('/order/download/itemday',User.signinRequired, Order.downloadItemDay)


  //user setting
  app.get('/setting', User.signinRequired, Setting.data)
  app.post('/setting/update', User.signinRequired, Setting.update)
  
  //成员操作
  app.get('/setting/list', Setting.placeAdminRequired,Setting.list)
  app.post('/setting/add', Setting.placeAdminRequired,Setting.add)
  app.delete('/setting/delete', Setting.placeAdminRequired,Setting.del)
  app.get('/setting/detail/:id', Setting.placeAdminRequired,Setting.detail)
  app.post('/setting/updatecopy', Setting.placeAdminRequired,Setting.updatecopy)
  app.get('/setting/rbac', Setting.rbac)

  // 微信端接口
  app.get('/wechat/init',Wechat.init)
  app.get('/wechat/token',Wechat.token)
  app.get('/wechat/addmenu',Wechat.addMenu)
  app.get('/wechat/login',Wechat.login)
  app.get('/wechat/userinfo',Wechat.userinfo)
  app.get('/wechat/member_appaly',Wechat.memberAppaly)

}
