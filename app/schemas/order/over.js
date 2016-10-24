var mongoose = require('mongoose')	
var OverSchema = new mongoose.Schema({
	isTop: Boolean,
	checked: Boolean,
	people:Number,	//用餐人数
	stand:Number,	//用餐台数
	total:Number,
	reduce:Number,	//优惠金额
	onceincome:Number,	//次卡
	total:Number,	// 合计--总合计
	totalNeed:Number,	// 应收
	noincome:Number,	// 虚收
	totalReal:Number,   // 实收
	payType:Array, 
	editPeople:String,
	time:Number,
	year:Number,
	month:Number,
	day:Number,
	other:Array,
	memberNum:Number,
	start:Number,
	stop:Number,
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

OverSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})

OverSchema.statics = {
	fetch:function(rule,cb){
		return this
			.find(rule)
			.sort()
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = OverSchema