var mongoose = require('mongoose')	
var CookSchema = new mongoose.Schema({
	isTop: Boolean,
	checked: Boolean,
	name:String,
	price:Number,
	memberPrice:Number,
	reducePrice:Number,
	comboPrice:Number,
	otherPrice:Number,
	payType:Number,
	number:Number,
	cate: String,
	search:String,
	ishost:String,
	other1:Number,
	other2:String,
	description:String,
	people:String,
	history:String,
	dishArr:Array,
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
	domainlocal:String
})

CookSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})

CookSchema.statics = {
	fetch:function(rule,cb){	
		return this
			.find(rule)
			.sort('meta.createAt')
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = CookSchema