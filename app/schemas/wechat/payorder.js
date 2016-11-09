var mongoose = require('mongoose')
var PayorderSchema = new mongoose.Schema({
	openid:String,
	is_subscribe:String,
	bank_type:String,
	total_fee:Number,
	transaction_id:String,
	out_trade_no:String,
	attach:String,
	time_end:String,
	cash_fee:Number,
	year:Number,
	month:Number,
	day:Number,
	meta:{
		createAt:{
			type:Number,
			default:Date.now()
		},
		updateAt:{
			type:Number,	
			default:Date.now()
		}
	}
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
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = PayorderSchema