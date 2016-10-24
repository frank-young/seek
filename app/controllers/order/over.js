var Over = require('../../models/order/over')	//引入模型
var _ = require('underscore'),
	json2csv = require('json2csv'),
	fs = require('fs')
	path = require('path')

	//结班列表页
	exports.list = function(req,res){
		var user = req.session.user
		Over.fetch({"domainlocal":user.domain},function(err,overs){
			res.json({
				status:"1",
				msg:"请求成功",
				overs:overs
			})
		})
	}

	// 今日结班列表
	exports.todaylist = function(req,res){
		var user = req.session.user
		var date = new Date(),
			Y = date.getFullYear(),
	        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
	        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())

		Over.fetch({"domainlocal":user.domain,"year":Y,"month":M,"day":D},function(err,overs){
			res.json({
				status:"1",
				msg:"请求成功",
				overs:overs
			})
		})
	}

	//结班更新、新建
	exports.save = function(req,res){
		var overObj = req.body.over 	//从路由传过来的 over对象
		var user = req.session.user
		overObj.editPeople: user.name
		overObj.userlocal:user.email
		overObj.domainlocal:user.domain
		
		var _over = new Over(overObj)
			_over.save(function(err,over){
				if(err){
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
	}

	//结班更新、新建
	exports.update = function(req,res){
		var id = req.body.over._id
		var overObj = req.body.over 	//从路由传过来的 over对象
		var _over
		if(id !=="undefined"){
			Over.findById(id,function(err,over){
				if(err){
					console.log(err)
				}
				_over = _.extend(over,overObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_over.save(function(err,over){
					if(err){
						console.log(err)
					}

					res.json({msg:"更新成功",status: 1})
				})
			})
		}
		
	}

	//删除结班
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Over.remove({_id: id},function(err,over){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}

	//订单详情页
	exports.detail = function(req,res){
		var id = req.params.id	
		Over.findById(id,function(err,over){
			res.json({
				over:over
			})
		})
	}

	//结班报告列表页
	exports.overdayList = function(req,res){
		var user = req.session.user
		Over.fetch({"domainlocal":user.domain},function(err,overs){
			var arr =[] 
			overs.forEach(function(over){
				arr.push({
					'year':over.year,
					'month':over.month,
					'day':over.day
				})
			})
			
			var month = distinct(arr)

			res.json({
				msg:"请求成功",
				status: 1,
				overs:month
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


	//下载结班报告
	exports.downloadOverDay = function(req,res){
		var year = req.query.year
		var month = req.query.month
		var day = req.query.day

		var user = req.session.user
		var fields = ['名称', '数量','小计']
		var payTypeArr = ['现金支付','微信支付','支付宝支付','会员卡支付']
		var overData = []
		Over.fetch({"domainlocal":user.domain,"year":year,"month":month,"day":day},function(err,overs){

			overs.forEach(function(value,index){

				var overObj = {
					"名称":value.name,
					"数量":value.number,
					"小计":value.total,
				}
				overData.push(overObj)
			})
			var csv = json2csv({ data: overData, fields: fields })
			
			var file = year+'年'+month+'月'+day+'日结班报告.csv'
			var link = '/orderprint/over/'+file

			fs.writeFile('frontend/src'+link, csv, function(err) {
				if(err){
					console.log(err)
				}else{
					res.json({
				  		status:1,
				  		msg:"生成文件成功！",
				  		link:link,
				  		file:file
				  	})
				}
			  	
			})
		})

	}


	