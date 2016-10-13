var Day = require('../../models/day/day')	//引入模型
var _ = require('underscore')
	
	//分类列表页
	exports.list = function(req,res){
		var user = req.session.user
		Day.fetch({"userlocal":user.email},function(err,days){
			res.json({
				status:"1",
				msg:"请求成功",
				days:days
			})
		})
	}

	//分类更新、新建
	exports.save = function(req,res){
		var dayObj = req.body.day 	//从路由传过来的 day对象
		var user = req.session.user
		var _day
			_day = new Day({
				date: dayObj.date,
				year: dayObj.year,
				month: dayObj.month,
				day:dayObj.day,
				start:dayObj.start,
				stop:dayObj.stop,
				userlocal:user.email,
				domainlocal:user.domain
			})
			_day.save(function(err,day){
				if(err){
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
	}
	//分类更新、新建
	exports.update = function(req,res){
		var id = req.body.day._id
		var dayObj = req.body.day 	//从路由传过来的 day对象
		var _day
		if(id !=="undefined"){
			Day.findById(id,function(err,day){
				if(err){
					console.log(err)
				}
				_day = _.extend(day,dayObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_day.save(function(err,day){
					if(err){
						console.log(err)
					}

					res.json({msg:"更新成功",status: 1})
				})
			})
		}
		
	}

	//删除分类
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


