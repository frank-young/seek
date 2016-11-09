var mongoose = require('mongoose')	
var ItemSchema = new mongoose.Schema({
	isTop: Boolean,
	checked: Boolean,
	name:String,
	cate:String,
	price:Number,
	comboPrice:Number,
	number:Number,
	total:Number,
	time:Number,
	year:Number,
	month:Number,
	day:Number,
	orderNum:String,
	other:String,
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

ItemSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})

ItemSchema.statics = {
	fetch:function(rule,cb){
		return this
			.find(rule)
			.sort({'name':1})
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = ItemSchema