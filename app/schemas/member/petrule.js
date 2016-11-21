var mongoose = require('mongoose')
var PetruleSchema = new mongoose.Schema({
	bonus:Number,		//赠送金额
	fee:Number,			//充值总金额
	consume:Number,		//每消费consume
	int:Number,			//积int分
	start:Number,		//开始时间
	stop:Number,		//到期时间
	status:Number,		//0:规则不可用  1:规则可用
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
	userlocal:String,
	domainlocal:String,
})

PetruleSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})


PetruleSchema.statics = {
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

module.exports = PetruleSchema