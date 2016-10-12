var mongoose = require('mongoose')	
var OrderSchema = new mongoose.Schema({
	isTop: Boolean,
	checked: Boolean,
	name:String,
	address:String,
	tel:String,
	orderNum:{
		unique:true,
		type:String
	},
	orderStatus:Number,
	peopleNum: Number,
	dish:Array,
	payType:Number,
	payStatus:Number,
	total:Number,
	reduce:Number,
	reduceAfter:Number,
	realTotal:Number,
	isMember:Boolean,
	memberName:String,
	memberNum:String,
	memberPhone:String,
	editPeople:String,
	other1:String,
	other2:String,
	time:Number,
	year:Number,
	month:Number,
	day:Number,
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

OrderSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})

OrderSchema.statics = {
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

module.exports = OrderSchema