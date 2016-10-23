var mongoose = require('mongoose')
var memberSchema = new mongoose.Schema({
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

memberSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})


memberSchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = memberSchema