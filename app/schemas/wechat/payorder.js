var mongoose = require('mongoose')
var PayorderSchema = new mongoose.Schema({
	openid:String,
	device_info:String,
	is_subscribe:String,
	bank_type:String,
	total_fee:String,
	transaction_id:String,
	out_trade_no:String,
	attach:String,
	time_end:String,
	cash_fee:String,
	year:String,
	month:String,
	day:String,
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
	username:String,
	userlocal:String,
	domainlocal:String
})

PayorderSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})


PayorderSchema.statics = {
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

module.exports = PayorderSchema