var mongoose = require('mongoose')	
var DishSchema = new mongoose.Schema({
	isTop: Boolean,
	isChecked: Boolean,
	name: String,
	model:String,
	cate: String,
	people:String,
	editpeople:String,
	description:String,
	path:Array,
	img:String,
	size:String,
	quantity:String,
	weight:String,
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

DishSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})

DishSchema.statics = {
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

module.exports = DishSchema