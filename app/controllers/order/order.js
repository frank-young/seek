var Order = require('../../models/order/order'),	//引入模型
	_ = require('underscore'),
	json2csv = require('json2csv'),
	fs = require('fs'),
	path = require('path')

	//订单列表页
	exports.list = function(req,res){
		var user = req.session.user
		Order.fetch({"domainlocal":user.domain},function(err,orders){
			res.json({
				msg:"请求成功",
				status: 1,
				orders:orders
			})
		})
	}
	//订单新建
	exports.save = function(req,res){
		var orderObj = req.body.order, 	//从路由传过来的 order对象
			user = req.session.user,
			_order,
			rePrice = /^\+?(?:[1-9]\d*(?:\.\d{1,2})?|0\.(?:\d[1-9]|[1-9]\d))$/ 

		if(orderObj.total==""||orderObj.total==null){
  			res.json({
				status:0,
				msg:"总价不能为空！"
			})
  		}else{
  			Order.findOne({orderNum:orderObj.orderNum},function(err,order){
				if(err){
					res.json({
						status:0,
						msg:"发生未知错误！"
					})
				}
				if(order){
					res.json({
						status:0,
						msg:"订单已经存在！"
					})	
				}else{
					_order = new Order({
						isTop: orderObj.isTop,
						isChecked: orderObj.isChecked,
						name: orderObj.name,
						address: orderObj.address,
						tel: orderObj.tel,
						orderNum: orderObj.orderNum,
						orderStatus: orderObj.orderStatus,
						peopleNum: orderObj.peopleNum,
						dish: orderObj.dish,
						payType: orderObj.payType,
						payStatus: orderObj.payStatus,
						total: orderObj.total,
						reduce: orderObj.reduce,
						reduceAfter:orderObj.reduceAfter,
						realTotal:orderObj.realTotal,
						isMember: orderObj.isMember,
						memberName: orderObj.memberName,
						memberNum: orderObj.memberNum,
						memberPhone: orderObj.memberPhone,
						time: orderObj.time,
						year: orderObj.year,
						month: orderObj.month,
						day: orderObj.day,
						editPeople: user.name,
						userlocal:user.email,
						domainlocal:user.domain
					})

					_order.save(function(err,order){
						if(err){
							console.log(err)
						}else{
							res.json({msg:"添加成功",status: 1})
						}
					})
				}
			})
  		}
			
	}
	//订单更新、新建
	exports.update = function(req,res){
		var id = req.body.Order._id,
			orderObj = req.body.order, 	//从路由传过来的 order对象
			user = req.session.user,
			_order,
			rePrice = /^\+?(?:[1-9]\d*(?:\.\d{1,2})?|0\.(?:\d[1-9]|[1-9]\d))$/ 

		orderObj.people = user.name

		if(orderObj.total==""||orderObj.total==null){
  			res.json({
				status:0,
				msg:"总价格有问题！"
			})
  		}else if(rePrice.test(orderObj.total)==false){
  			res.json({
				status:0,
				msg:"总价格式不正确！"
			})
  		}else{
  			if(id !=="undefined"){
				Order.findById(id,function(err,order){

					_order = _.extend(order,orderObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
					Order.save(function(err,order){
						if(err){
							console.log(err)
						}

						res.json({msg:"更新成功",status: 1})
					})
				})
			}
  		}
		
	}
	//订单详情页
	exports.detail = function(req,res){
		var id = req.params.id	
		Order.findById(id,function(err,order){
			res.json({
				order:order
			})
		})
	}
	//删除订单
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			
			Order.remove({_id: id},function(err,order){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}

	//下载月报表
	exports.downloadMonth = function(req,res){
		// var id = req.query.id
		var user = req.session.user
		var fields = ['订单编号', '支付类型','操作人', '总价','减免金额','实付款']
		var payTypeArr = ['现金支付','微信支付','支付宝支付','会员卡支付']
		var orderData = []
		Order.fetch({"domainlocal":user.domain,"year":2016,"month":10},function(err,orders){

			orders.forEach(function(value,index){

				var orderObj = {
					"订单编号":value.orderNum,
					"支付类型":payTypeArr[value.payType],
					"操作人":value.editPeople,
					"总价":value.total,
					"减免金额":value.reduce,
					"实付款":value.realTotal
				}
				orderData.push(orderObj)
			})
			var csv = json2csv({ data: orderData, fields: fields })

			fs.writeFile('file.csv', csv, function(err) {
			  	console.log('file saved')
			})
		})

	}









