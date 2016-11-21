var mongoose = require('mongoose')
var PetcardSchema = new mongoose.Schema({
	code:String,
	username:String,
	sex:String,
	phone:String,
	password:String,
	birthday:String,
	has_active:Boolean,
	edit_people:String,
	status:Number,		//状态
	card_grade:String,	//会员卡等级
	discount:Number,
	bonus:Number,		//赠送金额
	fee:Number,			//总金额
	balance:Number,		//余额
	int:Number,		//积分
	start:Number,	//开卡时间
	stop:Number,	//到期时间
	history:Array,		//消费记录
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
	domainlocal:String,
})

PetcardSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})


PetcardSchema.statics = {
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

module.exports = PetcardSchema