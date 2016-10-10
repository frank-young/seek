var Dish = require('../../models/dish/dish')	//引入模型
var _ = require('underscore')
var fs = require('fs')
var path = require('path')

	//产品列表页
	exports.list = function(req,res){
		var user = req.session.user
		Dish.fetch({"domainlocal":user.domain},function(err,dishs){
			res.json({
				msg:"请求成功",
				status: 1,
				dishs:dishs
			})
		})
	}
	//产品新建
	exports.save = function(req,res){
		var dishObj = req.body.dish, 	//从路由传过来的 dish对象
			user = req.session.user,
			_dish,
			re = /^[A-Za-z0-9]+$/,
			rePrice = /^\+?(?:[1-9]\d*(?:\.\d{1,2})?|0\.(?:\d[1-9]|[1-9]\d))$/ 

		if(dishObj.name==""||dishObj.name==null){
  			res.json({
				status:0,
				msg:"菜品名称不能为空！"
			})
  		}else if(dishObj.price==""||dishObj.price==null){
  			res.json({
				status:0,
				msg:"菜品单价不能为空！"
			})
  		}else if(dishObj.search==""||dishObj.search==null){
  			res.json({
				status:0,
				msg:"菜品拼音缩写不能为空！"
			})
  		}else if(dishObj.cate==""||dishObj.cate==null){
  			res.json({
				status:0,
				msg:"菜品分类不能为空！"
			})
  		}else if(rePrice.test(dishObj.price)==false){
  			res.json({
				status:0,
				msg:"菜品单价格式有问题！"
			})
  		}else if(re.test(dishObj.search)==false){
  			res.json({
				status:0,
				msg:"菜品拼音缩写格式不正确，必须为字母或数字！"
			})
  		}else{
  			Dish.findOne({name:dishObj.name},function(err,dish){
				if(err){
					res.json({
						status:0,
						msg:"发生未知错误！"
					})
				}
				if(dish){
					res.json({
						status:0,
						msg:"菜品已经存在！"
					})	
				}else{
					_dish = new Dish({
						isTop: dishObj.isTop,
						isChecked: dishObj.isChecked,
						name: dishObj.name,
						price: dishObj.price,
						cate: dishObj.cate,
						people: user.name,
						number:  dishObj.number,
						description: dishObj.description,
						search: dishObj.search,
						other1: dishObj.other1,
						other2: dishObj.other2,
						history: dishObj.history,
						userlocal:user.email,
						domainlocal:user.domain
					})
					_dish.save(function(err,dish){
						if(err){
							console.log(err)
						}
						res.json({msg:"添加成功",status: 1})
					})
				}
			})
  		}
			
	}
	//产品更新、新建
	exports.update = function(req,res){
		var id = req.body.dish._id,
			dishObj = req.body.dish, 	//从路由传过来的 dish对象
			user = req.session.user,
			_dish,
			re = /^[A-Za-z0-9]+$/,
			rePrice = /^\+?(?:[1-9]\d*(?:\.\d{1,2})?|0\.(?:\d[1-9]|[1-9]\d))$/ 

		dishObj.people = user.name

		if(dishObj.name==""||dishObj.name==null){
  			res.json({
				status:0,
				msg:"菜品名称不能为空！"
			})
  		}else if(dishObj.price==""||dishObj.price==null){
  			res.json({
				status:0,
				msg:"菜品单价不能为空！"
			})
  		}else if(dishObj.search==""||dishObj.search==null){
  			res.json({
				status:0,
				msg:"菜品拼音缩写不能为空！"
			})
  		}else if(dishObj.cate==""||dishObj.cate==null){
  			res.json({
				status:0,
				msg:"菜品分类不能为空！"
			})
  		}else if(rePrice.test(dishObj.price)==false){
  			res.json({
				status:0,
				msg:"菜品单价格式有问题！"
			})
  		}else if(re.test(dishObj.search)==false){
  			res.json({
				status:0,
				msg:"菜品拼音缩写格式不正确，必须为字母或数字！"
			})
  		}else{
  			if(id !=="undefined"){
				Dish.findById(id,function(err,dish){

					_dish = _.extend(dish,dishObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
					_dish.save(function(err,dish){
						if(err){
							console.log(err)
						}

						res.json({msg:"更新成功",status: 1})
					})
				})
			}
  		}
		
	}
	//产品详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Dish.findById(id,function(err,dish){
			res.json({
				dish:dish
			})
		})
	}
	//删除产品
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			
			// Dish.findById(id,function(err,dish){
			// 	console.log(dish.path)
			// 	if(dish.path.length != 0){
			// 		for(var i =0;i<dish.path.length;i++){
			// 			fs.unlink('./frontend/src'+dish.path[i],function(err){
			// 			})
			// 		}
			// 	}

			// })
			
			Dish.remove({_id: id},function(err,dish){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}

	exports.saveImg = function(req,res,next){
		var imgData = req.files.file[0],
			filePath = imgData.path,
			originalFilename = imgData.originalFilename,
			selfDir = req.session.user.domain

		fs.exists('./frontend/src/upload/'+selfDir, function (exists) {
		  	if(!exists){
		  		fs.mkdirSync('./frontend/src/upload/'+selfDir,0777, function (err) {
					console.log('dir create success')
				});
		  	}
		});
		
		if(originalFilename){
			fs.readFile(filePath, function(err,data){
				var timestamp = Date.now(),
					type = imgData.type.split('/')[1],
					img = timestamp + '.' +type,
					newPath = path.join(__dirname,'../../../','/frontend/src/upload/'+selfDir+'/'+img)
					fs.writeFile(newPath,data,function(err){
						console.log('数据写入成功')
						res.json({
							status:1,
							msg:'图片上传成功',
							path: '/upload/'+selfDir+'/'+img
						})
					})

			})
		}

	}

	exports.deleteImg = function(req,res,next){
		var path = req.query.path
		fs.unlink('./frontend/src'+path,function(err){
		    res.json({
				status:1,
				msg:'删除图片成功'
			})
		})
	}








