var mongoose = require('mongoose')
var MemberorderSchema = new mongoose.Schema({
	cardid:String,
	shopid:String,
	openid:String,
	code:Number,
	username:String,
	phone:String,
	status:Number,
	billstatus:Number,	// 付款完成状态为1，避免重复付款
	originalfee:Number,
	transid:String,
	discount:Number,
	fee:Number,
	createtime:Number,
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
	}
})

MemberorderSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})


MemberorderSchema.statics = {
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

module.exports = MemberorderSchema