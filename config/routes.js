var Index = require('../app/controllers/index'),
    User = require('../app/controllers/user'),
    Domain = require('../app/controllers/domain'),
    Setting = require('../app/controllers/setting'),
    Dish = require('../app/controllers/dish/dish'),
    Cate = require('../app/controllers/dish/cate'),
    Order = require('../app/controllers/order/order'),
    Item = require('../app/controllers/order/item'),
    Day = require('../app/controllers/day/day'),
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
  app.get('/ordertoday',User.signinRequired, Order.listToday)
  app.get('/order/month',User.signinRequired, Order.monthList)
  app.get('/order/day',User.signinRequired, Order.dayList)
  app.post('/order/add',User.signinRequired, Order.save )
  app.post('/order/update', User.signinRequired, Order.update)
  app.get('/order/detail/:id', User.signinRequired, Order.detail)
  app.delete('/order/delete',User.signinRequired, Order.del)
  app.get('/order/download',User.signinRequired, Order.downloadMonth)
  app.get('/order/downloadday',User.signinRequired, Order.downloadDay)

  //品项报告
  app.get('/item',User.signinRequired, Item.list)
  app.post('/item/add',User.signinRequired, Item.save)
  app.post('/item/update', User.signinRequired, Item.update)
  app.get('/item/detail/:id', User.signinRequired, Item.detail)
  app.get('/item/itemday',User.signinRequired, Item.itemdayList)
  app.get('/item/download/itemday',User.signinRequired, Item.downloadItemDay)

  //开班、结班信息
  app.get('/day',User.signinRequired, Day.list)
  app.post('/day/add',User.signinRequired, Day.save)
  app.post('/day/update', User.signinRequired, Day.update)
  app.get('/day/detail/:id', User.signinRequired, Day.detail)
  // app.delete('/day/delete',User.signinRequired, Day.del)

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
