var Index = require('../app/controllers/index'),
    User = require('../app/controllers/user'),
    Admin = require('../app/controllers/admin/admin'),
    Home = require('../app/controllers/admin/index'),
    Domain = require('../app/controllers/domain'),
    Setting = require('../app/controllers/setting'),
    Dish = require('../app/controllers/dish/dish'),
    Cate = require('../app/controllers/dish/cate'),
    Order = require('../app/controllers/order/order'),
    Item = require('../app/controllers/order/item'),
    Over = require('../app/controllers/order/over'),
    Day = require('../app/controllers/day/day'),
    Credit = require('../app/controllers/credit/credit'),
    Paytype = require('../app/controllers/credit/paytype'),
    Wechat = require('../app/controllers/wechat/wechat'),
    Alipay = require('../app/controllers/alipay/alipay'),
    Memberorder = require('../app/controllers/wechat/memberorder'),
    Member = require('../app/controllers/wechat/member'),
    Petcard = require('../app/controllers/member/petcard'),
    Petrule = require('../app/controllers/member/petrule'),
    Payorder = require('../app/controllers/wechat/payorder'),
    Alipayorder = require('../app/controllers/alipay/alipayorder'),
    Table = require('../app/controllers/table/table'),
    Mobile = require('../app/controllers/mobile/mobile'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    xmlparser = require('express-xml-bodyparser')

module.exports = function(app){
	app.use(function(req, res, next) {
    var _user = req.session.user
    app.locals.user = _user
    next()
  })

  //首页
  app.get('/', Index.index)
	app.get('/admin', Index.admin)

  //管理员登录注册
  app.post('/manager/signin/ctrl', Admin.signin)
  app.get('/manager/signin', Admin.signinUnRequired, Admin.showSignin)
  app.post('/manager/signup/ctrl', Admin.signup)
  app.get('/manager/signup', Admin.signinUnRequired, Admin.showSignup)
  app.get('/manager/logout', Admin.signinRequired, Admin.logout)
  app.get('/manager/setting', Admin.signinRequired, Admin.setting)
  app.post('/manager/ctrl/setting', Admin.signinRequired, Admin.editpass)
  
  // 管理页面
  app.get('/manager/index', Admin.signinRequired, Home.index)
  app.get('/manager/account', Admin.signinRequired,Admin.superRequired, Home.account)
  app.get('/manager/account/add', Admin.signinRequired,Admin.superRequired, Home.accountAdd)
  app.get('/manager/report', Admin.signinRequired, Home.report)
  app.get('/manager/item', Admin.signinRequired, Home.item)
  app.get('/manager/ctrl/account', Admin.signinRequired,Admin.superRequired, Home.ctrlaccount)
  app.post('/manager/ctrl/account/add', Admin.signinRequired,Admin.superRequired, Home.ctrlaccountAdd)
  app.post('/manager/ctrl/report', Admin.signinRequired, Home.ctrlreport)
  app.delete('/manager/ctrl/account/del',Admin.signinRequired,Admin.superRequired, Home.del)
  app.get('/manager/report/list', Admin.signinRequired, Order.monthListManager)
  app.get('/manager/report/create', Admin.signinRequired, Order.downloadMonthManager)
  app.get('/manager/item/create', Admin.signinRequired, Item.downloadItemMonth)

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
  // app.get('/admin/user/list', User.signinRequired,User.adminRequired, User.list)
  app.post('/user/editpass', User.signinRequired, User.editpass)
  app.get('/user/getphone', User.signinRequired, User.getphone)
  
  // 门店信息设置
  app.get('/domain/add',User.signinRequired,Domain.domainRequired, Domain.add )
  app.post('/domain/addctrl',User.signinRequired,Domain.domainRequired, Domain.addctrl )
  app.post('/domain/update', User.signinRequired, Domain.update)
  app.get('/domain/detail', User.signinRequired, Domain.detail)
  app.get('/domain/shopid', User.signinRequired, Domain.shopid)

  // 菜品信息
  app.get('/dish',User.signinRequired, Dish.list)
  app.post('/dish/add',User.signinRequired, User.superRequired, Dish.save)
  app.post('/dish/update', User.signinRequired, User.superRequired, Dish.update)
  app.get('/dish/detail/:id', User.signinRequired, Dish.detail)
  app.delete('/dish/delete',User.signinRequired, User.superRequired, Dish.del)

  //菜品分类
  app.get('/cate',User.signinRequired, Cate.list)
  app.post('/cate/add',User.signinRequired, Cate.save)
  app.post('/cate/update', User.signinRequired, Cate.update)
  app.delete('/cate/delete',User.signinRequired, Cate.del)

  //订单信息
  app.get('/order',User.signinRequired, Order.list)
  app.get('/ordertoday',User.signinRequired, Order.listToday)
  app.get('/ordertoday/pending',User.signinRequired, Order.listPendingToday)
  app.get('/order/month',User.signinRequired, Order.monthList)
  app.get('/order/day',User.signinRequired, Order.dayList)
  app.post('/order/add',User.signinRequired, Order.save )
  app.post('/order/update', User.signinRequired, Order.update)
  app.get('/order/detail/:id', User.signinRequired, Order.detail)
  app.get('/order/query/:id', User.signinRequired, Order.query)
  app.delete('/order/delete',User.signinRequired, User.superRequired, Order.del)
  app.get('/order/download',User.signinRequired, Order.downloadMonth)
  app.get('/order/downloadday',User.signinRequired, Order.downloadDay)
  app.get('/order/grade',User.signinRequired, Order.gradeToday)
  app.get('/order/gradeall',User.signinRequired, Order.gradeAllToday)
  app.get('/order/grade/some/:id',User.signinRequired, Order.gradeAllSomeday)

  app.get('/order/api/:id', Order.api)
  app.get('/order/apiview', Order.apiview)


  //支付方式
  app.get('/credit',User.signinRequired, Credit.list)
  app.post('/credit/add',User.signinRequired, User.superRequired, Credit.save)
  app.post('/credit/update', User.signinRequired, User.superRequired, Credit.update)
  app.delete('/credit/delete',User.signinRequired, User.superRequired, Credit.del)

  //挂帐人员
  app.get('/paytype',User.signinRequired, Paytype.list)
  app.post('/paytype/add',User.signinRequired, Paytype.save)
  app.post('/paytype/update', User.signinRequired, Paytype.update)
  app.delete('/paytype/delete',User.signinRequired, Paytype.del)


  //品项报告
  app.get('/item',User.signinRequired, Item.list)
  app.get('/item/today',User.signinRequired, Item.todaylist)
  app.post('/item/add',User.signinRequired, Item.save)
  app.post('/item/update', User.signinRequired, Item.update)
  app.get('/item/detail/:id', User.signinRequired, Item.detail)
  app.get('/item/itemday',User.signinRequired, Item.itemdayList)
  app.get('/item/download/itemday',User.signinRequired, Item.downloadItemDay)
  app.delete('/item/delsome',User.signinRequired, Item.delSome)

  // 结班报告
  app.get('/over',User.signinRequired, Over.list)
  app.get('/over/today',User.signinRequired, Over.todaylist)
  app.get('/over/some/:id',User.signinRequired, Over.todaylistsome)
  app.post('/over/add',User.signinRequired, Over.save)
  app.get('/over/detail/:id', User.signinRequired, Over.detail)

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
  app.get('/setting/list',User.signinRequired, Setting.placeAdminRequired,Setting.list)
  app.post('/setting/add',User.signinRequired, Setting.placeAdminRequired,Setting.add)
  app.delete('/setting/delete',User.signinRequired, Setting.placeAdminRequired,Setting.del)
  app.get('/setting/detail/:id',User.signinRequired, Setting.placeAdminRequired,Setting.detail)
  app.post('/setting/updatecopy',User.signinRequired, Setting.placeAdminRequired,Setting.updatecopy)
  app.get('/setting/rbac',User.signinRequired, Setting.rbac)

  // 会员付款信息
  app.post('/memberorder', User.signinRequired, Memberorder.getinfo)
  app.get('/memberorder/wxpay/:id', User.signinRequired, Memberorder.todayMemberPay)
  app.get('/member', User.signinRequired, Member.list) 
  app.get('/member/detail/:id', User.signinRequired, Member.detail) 

  // 储值卡信息
  app.get('/petcard',User.signinRequired, Petcard.list)
  app.post('/petcard/add',User.signinRequired, Petcard.save)
  app.post('/petcard/update', User.signinRequired, Petcard.update)
  app.post('/petcard/admin/update', User.signinRequired, Petcard.updateadmin)
  app.post('/petcard/reduce', User.signinRequired, Petcard.reduce)
  app.get('/petcard/detail/:id', User.signinRequired, Petcard.detail)
  app.get('/petcard/today',User.signinRequired, Petcard.petcardtoday)
  app.get('/petcard/some/:id', User.signinRequired, Petcard.petcardsome)
  
  // 储值卡规则信息
  app.get('/petrule',User.signinRequired, Petrule.list)
  app.get('/petrule/active',User.signinRequired, Petrule.activelist)
  app.post('/petrule/add',User.signinRequired, Petrule.save)
  app.post('/petrule/update', User.signinRequired, Petrule.update)
  app.get('/petrule/detail/:id', User.signinRequired, Petrule.detail)
  app.delete('/petrule/delete',User.signinRequired, Petrule.del)

  // 餐桌
  app.get('/table',User.signinRequired, Table.list)
  app.post('/table/add',User.signinRequired, Table.save)
  app.post('/table/update', User.signinRequired, Table.update)
  app.get('/table/detail/:id', User.signinRequired, Table.detail)
  app.get('/table/num/:id', User.signinRequired, Table.num)
  app.delete('/table/delete',User.signinRequired, Table.del)
  app.get('/table/qrcode', Table.qrcode)
  app.get('/table/query/:id',User.signinRequired, Table.query)
  app.get('/table/edit/:id',User.signinRequired, Table.edit)

  //模拟点餐页面
  app.get('/mobile/ordering/:id', Table.ordering)

  // 微信端接口
  app.get('/wechat/init',Wechat.init)
  app.post('/wechat/init',xmlparser({trim: false, explicitArray: false}),Wechat.cardResponse)  //微信推送信息接收url
  app.get('/wechat/token',Wechat.token)
  app.get('/wechat/getmenu',Wechat.getmenu) //查询自定义菜单
  app.get('/wechat/addmenu',Wechat.addmenu) //添加自定义菜单
  app.get('/wechat/login',Wechat.login)
  app.get('/wechat/getcgi',Wechat.getcgi) //获取自动回复规则

  app.get('/wechat/userinfo',Wechat.userinfo)

  app.get('/wechat/member_appaly',Wechat.memberAppaly)
  app.get('/wechat/upload/image',Wechat.uploadImage)

  app.get('/wechat/card/create',Wechat.cardCreate)  //创建会员卡
  app.get('/wechat/card/qrcode',Wechat.cardQrcode)  //生成二维码
  app.get('/wechat/card/testwhitelist',Wechat.cardTestwhitelist)  //白名单测试
  app.get('/wechat/card/delete',Wechat.cardDelete)  //删除会员卡
  app.get('/wechat/card/update',Wechat.cardUpdate)  //更新会员卡
  app.get('/wechat/card/memberinfo',Wechat.cardMemberinfo)  //设置会员开卡字段
  app.get('/wechat/card/getcard',Wechat.cardGetcard)  //拉取会员卡数据
  app.get('/wechat/card/membercard/:code',Wechat.cardMembercard)  //拉取会员信息
  app.get('/wechat/card/membercard/update',Wechat.cardMembercardUpdate)  //更新会员信息
  
  app.get('/wechat/card/getdiscount',Wechat.cardGetDiscount)  //优惠券查询

  app.get('/wechat/card/user/getcardlist',Wechat.cardUserGetcard)  //获取用户已领卡券
  // app.get('/wechat/card/code',Wechat.cardCode)  //查询code
  app.get('/wechat/shop',Wechat.cardGetShop)  //查询店铺
  app.post('/wechat/pay',Wechat.pay)  //刷卡支付
  app.post('/wechat/orderquery',Wechat.orderquery)  //查询支付订单
  app.get('/wechat/pay/payorder/today/:id',Payorder.todayPayorder)  //查询今日订单
  app.get('/wechat/pay/payorder/some/:id/:date',Payorder.somePayorder)  //按日期查询订单

  // 支付宝端接口
  app.post('/alipay/init',xmlparser({trim: false, explicitArray: false}),Wechat.cardResponse,Alipay.init)
  app.post('/alipay/callback',xmlparser({trim: false, explicitArray: false}),Wechat.cardResponse,Alipay.callback)
  app.post('/alipay/pospay',Alipay.pospay)
  app.post('/alipay/orderquery',Alipay.orderquery)
  app.get('/alipay/alipayorder/today/:id',Alipayorder.todayAlipayorder)  //查询今日订单
  app.get('/alipay/alipayorder/today/:id/:date',Alipayorder.someAlipayorder)  //按日期查询订单

  //微信点餐
  app.get('/api/goods',Mobile.goods) 
  app.post('/api/order',Mobile.order) 

}












