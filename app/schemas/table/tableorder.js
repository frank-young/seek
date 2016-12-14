var mongoose = require('mongoose')
var TableorderSchema = new mongoose.Schema({
	order_num:String,
	username:String,
	phone:String,
	status:Number,		// 1: 支付成功（未查看） 2：支付成功（已查看） 
	year:String,
	month:String,
	day:String,
	shopid:String,
	meta:{
		createAt:{
			type:Number,
			default:Date.now()
		},
		updateAt:{
			type:Number,	
			default:Date.now()
		}
	},
	domainlocal:String
})

TableorderSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})


TableorderSchema.statics = {
	fetch:function(rule,cb){
		return this
			.find(rule)
			.sort({'meta.createAt':-1})
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = TableorderSchema