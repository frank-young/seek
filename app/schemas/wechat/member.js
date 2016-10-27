var mongoose = require('mongoose')
var MemberSchema = new mongoose.Schema({
	cardid:String,
	openid:String,
	title:String,
	code:Number,
	username:String,
	nickname:String,
	sex:String,
	phone:String,
	birthday:String,
	location:String,
	user_card_status:String,
	has_active:Boolean,
	discount:Number,
	bonus:Number,
	fee:Number,
	balance:Number,
	createtime:Number,
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

MemberSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})


MemberSchema.statics = {
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

module.exports = MemberSchema