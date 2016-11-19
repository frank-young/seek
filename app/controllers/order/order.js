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

	// 今日订单
	exports.listToday = function(req,res){
		var user = req.session.user
		var date = new Date(),
			Y = date.getFullYear(),	
	        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
	        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())

		Order.fetch({"domainlocal":user.domain,"year":Y,"month":M,"day":D},function(err,orders){
			res.json({
				msg:"请求成功",
				status: 1,
				orders:orders
			})
		})
	}

	//月报列表页
	exports.monthList = function(req,res){
		var user = req.session.user
		Order.fetch({"domainlocal":user.domain},function(err,orders){
			var arr =[] 
			orders.forEach(function(order){
				arr.push({
					'year':order.year,
					'month':order.month
				})
			})
			
			var month = distinct(arr)

			res.json({
				msg:"请求成功",
				status: 1,
				orders:month
			})
		})

		// 去除重复元素
		function distinct(arr) {
		    var ret = [],
		        length = arr.length;
		    for(var i = 0;i < length; i++){
		        for(j = i+1; j<length;j++){
		            if(arr[i].year === arr[j].year && arr[i].month === arr[j].month){
		                j = ++i;
		            }
		        }
		        ret.push(arr[i]);
		    }
		    return ret;
		}

	}

	//日报列表页
	exports.dayList = function(req,res){
		var user = req.session.user
		Order.fetch({"domainlocal":user.domain},function(err,orders){
			var arr =[] 
			orders.forEach(function(order){
				arr.push({
					'year':order.year,
					'month':order.month,
					'day':order.day
				})
			})
			
			var month = distinct(arr)

			res.json({
				msg:"请求成功",
				status: 1,
				orders:month
			})
		})

		// 去除重复元素
		function distinct(arr) {
		    var ret = [],
		        length = arr.length;
		    for(var i = 0;i < length; i++){
		        for(j = i+1; j<length;j++){
		            if(arr[i].year === arr[j].year && arr[i].month === arr[j].month  && arr[i].day === arr[j].day){
		                j = ++i;
		            }
		        }
		        ret.push(arr[i]);
		    }
		    return ret;
		}

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
						msg:"发生未知错误！",
						err:err
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
						pname: orderObj.pname,
						address: orderObj.address,
						tel: orderObj.tel,
						orderNum: orderObj.orderNum,
						orderStatus: orderObj.orderStatus,
						peopleNum: orderObj.peopleNum,
						dish: orderObj.dish,
						dishNum: orderObj.dishNum,
						payType: orderObj.payType,
						payStatus: orderObj.payStatus,
						total: orderObj.total,
						reduce: Math.round(orderObj.reduce*100)/100,
						reduceAfter:Math.round(orderObj.reduceAfter*100)/100,
						realTotal:Math.round(orderObj.realTotal*100)/100,
						noincome:Math.round(orderObj.noincome*100)/100,
						onceincome:Math.round(orderObj.onceincome*100)/100,
						cashincome:Math.round(orderObj.cashincome*100)/100,
						wxincome:Math.round(orderObj.wxincome*100)/100,
						alipayincome:Math.round(orderObj.alipayincome*100)/100,
						schoolincome:Math.round(orderObj.schoolincome*100)/100,
						otherincome:Math.round(orderObj.otherincome*100)/100,
						credit:Math.round(orderObj.credit*100)/100,
						erase:orderObj.erase,
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
		var id = req.body.order._id,
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
					_order.save(function(err,order){
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
		var year = req.query.year
		var month = req.query.month

		var user = req.session.user
		var fields = ['时间','订单编号', '总价','优惠','次卡','挂帐金额','现金','微信','支付宝','校园卡','应收','抹零','实收']

		var orderData = []
		Order.fetch({"domainlocal":user.domain,"year":year,"month":month},function(err,orders){

			orders.forEach(function(value,index){
				var orderObj = {
					"时间":value.year+'-'+value.month+'-'+value.day,
					"订单编号":value.orderNum,
					"总价":value.total,
					"优惠":value.reduce,
					"次卡":value.onceincome,
					'挂帐金额':value.noincome,
					'现金':value.cashincome,
					'微信':value.wxincome,
					'支付宝':value.alipayincome,
					'校园卡':value.schoolincome,
					"应收":value.reduceAfter,
					"抹零":value.erase,
					"实收":value.realTotal

				}
				orderData.push(orderObj)
			})
			var csv = json2csv({ data: orderData, fields: fields })
			
			var file = year+'年'+month+'月度报表.csv'
			var link = '/orderprint/'+file

			fs.writeFile('frontend/src'+link, csv, function(err) {
				if(err) throw err
			  	res.json({
			  		status:1,
			  		msg:"生成文件成功！",
			  		link:link,
			  		file:file
			  	})
			})
		})

	}

	//下载日报表
	exports.downloadDay = function(req,res){
		var year = req.query.year
		var month = req.query.month
		var day = req.query.day

		var user = req.session.user
		var fields = ['订单编号', '支付类型','操作人', '总价','减免金额','实付款']
		var payTypeArr = ['现金','微信','支付宝','会员卡','次卡','校园卡','优惠券']
		var orderData = []
		Order.fetch({"domainlocal":user.domain,"year":year,"month":month,"day":day},function(err,orders){

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
			
			var file = year+'年'+month+'月'+day+'日报表.csv'
			var link = '/orderprint/'+file

			fs.writeFile('frontend/src'+link, csv, function(err) {
			  	res.json({
			  		status:1,
			  		msg:"生成文件成功！",
			  		link:link,
			  		file:file
			  	})
			})
		})

	}

	// 今日个人业绩
	exports.gradeToday = function(req,res){
		var user = req.session.user,
			loginTime = req.session.loginTime

		var date = new Date(),
			Y = date.getFullYear(),	
	        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
	        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())

		Order.fetch({"userlocal":user.email,"year":Y,"month":M,"day":D},function(err,orders){
			var grade = 0,
				noincome = 0,
				people = 0,
				stand = 0,
				reduce = 0,
				onceincome = 0,
				cashincome = 0,
				wxincome = 0,
				alipayincome = 0,
				schoolincome = 0,
				otherincome = 0,
				total = 0,
				totalNeed = 0,
				reduceAfter = 0,
				erase = 0

			orders.forEach(function(ele){
				grade += ele.realTotal
				noincome += ele.noincome
				people += ele.peopleNum
				reduce += ele.reduce
				onceincome += ele.onceincome
				cashincome += ele.cashincome
				wxincome += ele.wxincome
				alipayincome += ele.alipayincome
				schoolincome += ele.schoolincome
				otherincome += ele.otherincome
				total += ele.total
				reduceAfter += ele.reduceAfter
				erase += ele.erase
			})

			stand = orders.length
			totalNeed += noincome+total

 			res.json({
				msg:"请求成功",
				status: 1,
				orders:orders,
				grade:grade,
				username:user.name,
				noincome:noincome,
				people: people,
				reduce: reduce,
				onceincome: onceincome,
				cashincome:cashincome,
				wxincome:wxincome,
				alipayincome:alipayincome,
				schoolincome:schoolincome,
				otherincome:otherincome,
				total: total,
				stand: stand,
				start:loginTime,
				totalNeed: totalNeed,
				reduceAfter:reduceAfter,
				erase:erase,
				year:Y,
				month:M,
				day:D
			})
		})
	}

	// 今日总业绩
	exports.gradeAllToday = function(req,res){
		var user = req.session.user,
			loginTime = req.session.loginTime

		var date = new Date(),
			Y = date.getFullYear(),	
	        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
	        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())

		Order.fetch({"domainlocal":user.domain,"year":Y,"month":M,"day":D},function(err,orders){
			var grade = 0,
				noincome = 0,
				people = 0,
				stand = 0,
				reduce = 0,
				onceincome = 0,
				cashincome = 0,
				wxincome = 0,
				alipayincome = 0,
				schoolincome = 0,
				otherincome = 0,
				total = 0,
				totalNeed = 0,
				reduceAfter = 0,
				erase = 0
				
			orders.forEach(function(ele){
				grade += ele.realTotal
				noincome += ele.noincome
				people += ele.peopleNum
				reduce += ele.reduce
				onceincome += ele.onceincome
				cashincome += ele.cashincome
				wxincome += ele.wxincome
				alipayincome += ele.alipayincome
				schoolincome += ele.schoolincome
				otherincome += ele.otherincome
				total += ele.total
				reduceAfter += ele.reduceAfter
				erase += ele.erase
			})

			stand = orders.length
			totalNeed += noincome+total
			
 			res.json({
				msg:"请求成功",
				status: 1,
				grade:grade,
				noincome:noincome,
				people: people,
				reduce: reduce,
				onceincome: onceincome,
				cashincome:cashincome,
				wxincome:wxincome,
				alipayincome:alipayincome,
				schoolincome:schoolincome,
				otherincome:otherincome,
				total: total,
				stand: stand,
				start:loginTime,
				totalNeed: totalNeed,
				reduceAfter:reduceAfter,
				erase:erase,
				year:Y,
				month:M,
				day:D
			})
		})
	}

	// 时实数据
	exports.api = function(req,res){
		var domain = req.params.id

		var date = new Date(),
			Y = date.getFullYear(),	
	        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
	        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())

			Order.fetch({"domainlocal":domain,"year":Y,"month":M,"day":D},function(err,orders){
				var realTotal = 0,
					noincome = 0
					
				orders.forEach(function(ele){
					realTotal += ele.realTotal
					noincome += ele.noincome
				})

				res.json({
					msg:"请求成功",
					status: 1,
					realTotal:realTotal,
					noincome:noincome
				})

			})
	}
	exports.apiview = function(req,res){
		res.render('apiview',{
			title:'实时数据'
		})

	}

	//代码的未重构，导致代码量增多，遗憾遗憾！！
	// 今日总业绩
	exports.gradeAllSomeday = function(req,res){
		var user = req.session.user,
			loginTime = req.session.loginTime,
			id = req.params.id
		var Y = id.substr(0,4),
			M = id.substr(4,2),
			D = id.substr(6,2)


		Order.fetch({"domainlocal":user.domain,"year":Y,"month":M,"day":D},function(err,orders){
			var grade = 0,
				noincome = 0,
				people = 0,
				stand = 0,
				reduce = 0,
				onceincome = 0,
				cashincome = 0,
				wxincome = 0,
				alipayincome = 0,
				schoolincome = 0,
				otherincome = 0,
				total = 0,
				totalNeed = 0,
				reduceAfter = 0,
				erase = 0
				
			orders.forEach(function(ele){
				grade += ele.realTotal
				noincome += ele.noincome
				people += ele.peopleNum
				reduce += ele.reduce
				onceincome += ele.onceincome
				cashincome += ele.cashincome
				wxincome += ele.wxincome
				alipayincome += ele.alipayincome
				schoolincome += ele.schoolincome
				otherincome += ele.otherincome
				total += ele.total
				reduceAfter += ele.reduceAfter
				erase += ele.erase
			})

			stand = orders.length
			totalNeed += noincome+total
			
 			res.json({
				msg:"请求成功",
				status: 1,
				grade:grade,
				noincome:noincome,
				people: people,
				reduce: reduce,
				onceincome: onceincome,
				cashincome:cashincome,
				wxincome:wxincome,
				alipayincome:alipayincome,
				schoolincome:schoolincome,
				otherincome:otherincome,
				total: total,
				stand: stand,
				start:loginTime,
				totalNeed: totalNeed,
				reduceAfter:reduceAfter,
				erase:erase,
				year:Y,
				month:M,
				day:D
			})
		})
	}






