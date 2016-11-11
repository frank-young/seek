var mongoose = require('mongoose')
var AlipayorderSchema = new mongoose.Schema({
	buyer_logon_id:String,
	buyer_pay_amount:Number,
	buyer_user_id:String,
	gmt_payment:String,
	invoice_amount:Number,
	open_id:String,
	out_trade_no:String,
	point_amount:Number,
	receipt_amount:Number,
	trade_no:String,
	fund_bill_list:Array,
	device_info:String,
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

AlipayorderSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})


AlipayorderSchema.statics = {
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

module.exports = AlipayorderSchema