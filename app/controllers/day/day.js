var Day = require('../../models/day/dayother')	//引入模型
var _ = require('underscore')
	
	//开班列表页
	exports.list = function(req,res){
		var user = req.session.user
		Day.fetch({"domainlocal":user.domain},function(err,days){
			res.json({
				status:"1",
				msg:"请求成功",
				days:days
			})
		})
	}

	//开班更新、新建
	exports.save = function(req,res){
		var dayObj = req.body.day 	//从路由传过来的 day对象
		var user = req.session.user
		var _day
		Day.findOne({date:dayObj.date,domainlocal:user.domain},function(err,day){
			if(err){
				res.json({
					status:0,
					msg:"发生未知错误！"
				})
			}
			if(day){
				res.json({
					status:0,
					msg:"今日未结束！",
					id:day._id
				})	

			}else{
				_day = new Day({
					date: dayObj.date,
					year: dayObj.year,
					month: dayObj.month,
					day:dayObj.day,
					start:dayObj.start,
					stop:dayObj.stop,
					exchange:dayObj.exchange,
					status:dayObj.status,
					serial:dayObj.serial,
					editPeople:user.name,
					userlocal:user.email,
					domainlocal:user.domain
				})
				_day.save(function(err,value){
					if(err){
						console.log(err)
					}
					else{
						res.json(
						{
							msg:"开班成功！",
							status: 1,
							id:value._id
						})
					}
				})
			}
		})
			
	}
	//开班更新、新建
	exports.update = function(req,res){
		var id = req.body.day._id
		var dayObj = req.body.day
		var _day
		if(id != "undefined"){
			Day.findById(id,function(err,day){
				if(err){
					console.log(err)
				}
				_day = _.extend(day,dayObj)	
				_day.save(function(err,day){
					if(err){
						console.log(err)
					}

					res.json({msg:"操作成功！",status: 1})
				})
			})
		}
		
	}

	//详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Day.findById(id,function(err,day){
			res.json({
				day:day
			})
		})
	}

	//删除
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Day.remove({_id: id},function(err,day){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}


