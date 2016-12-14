var Table = require('../../models/table/table')
var Tableorder = require('../../models/table/tableorder')
var _ = require('underscore')
var qr = require('qr-image')
	
	//储值卡规则列表页
	exports.list = function(req,res){
		var user = req.session.user
		Table.fetch({"domainlocal":user.domain},function(err,tables){
			res.json({
				status:"1",
				msg:"操作成功",
				tables:tables
			})
		})
	}

	exports.save = function(req,res){
		var tableObj = req.body.table 
		var user = req.session.user

		tableObj.userlocal = user.email
		tableObj.domainlocal = user.domain

		var _table
			_table = new Table(tableObj)
			_table.save(function(err,table){
				if(err){
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
	}

	exports.update = function(req,res){
		var id = req.body.table._id
		var tableObj = req.body.table 
		var _table
		if(id !=="undefined"){
			Table.findById(id,function(err,table){
				if(err){
					console.log(err)
				}
				_table = _.extend(table,tableObj)	
				_table.save(function(err,table){
					if(err){
						console.log(err)
					}

					res.json({msg:"更新成功",status: 1})
				})
			})
		}
		
	}

	exports.detail = function(req,res){
		var id = req.params.id
		Table.findById(id,function(err,table){
			res.json({
				table:table
			})
		})
	}

	//获取点餐桌号
	exports.num = function(req,res){
		var id = req.params.id
		Table.findById(id,function(err,table){
			res.json({
				status:1,
				num:table.num
			})
		})
	}

	//创建二维码
	exports.qrcode = function(req,res){
		var text = req.query.text;
	    try {
	        var img = qr.image(text,{size :20});
	        res.writeHead(200, {'Content-Type': 'image/png'});
	        img.pipe(res);
	    } catch (e) {
	        res.writeHead(414, {'Content-Type': 'text/html'});
	        res.end('<h1>发生错误...</h1>');
	    }
	}

	//模拟点餐首页
	exports.ordering = function(req,res){
		var id = req.params.id
		Table.findById(id,function(err,table){
			if(table){
				res.json({
					status:1,
					num:table.num,
					domain:table.domainlocal
				})
			}else{
				res.json({
					status:0,
					msg:'扫描失败，请重新扫描二维码！'
				})
			}
		})
	}

	//查询是否有新订单
	exports.query = function(req,res){
		var domain = req.params.id
		Tableorder.fetch({'domainlocal':domain,'status':1},function(err,orders){
			res.json({
				status:1,
				orders:orders
			})
		})
	}

	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Table.remove({_id: id},function(err,table){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}


