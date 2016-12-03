var mongoose = require('mongoose')
var PetcardSchema = new mongoose.Schema({
	code:String,
	cardid:String,
	openid:String,
	username:String,
	nickname:String,
	type:String,
	sex:String,
	phone:String,
	password:String,
	birthday:String,
	location:String,
	has_active:Boolean,
	edit_people:String,
	status:Number,		//状态		0:未激活 1：激活  2:挂失
	card_grade:Number,	//会员卡等级
	discount:Number,	// 折扣
	bonus:Number,		//赠送金额
	fee:Number,			//前一次或第一次充值总金额
	balance:Number,		//余额
	int:Number,			//积分
	position:String,	//开卡门店
	createtime:Number,
	pay_type:Number,
	start:{
			type:Number,
			default:Date.now()
		},			//开卡时间
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