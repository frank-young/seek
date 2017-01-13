var mongoose = require('mongoose')	
var OrderSchema = new mongoose.Schema({
	isTop: Boolean,
	checked: Boolean,
	name:String,
	pname:String,
	address:String,
	tel:String,
	orderNum:{
		unique:true,
		type:String
	},
	orderStatus:Number,
	peopleNum: Number,
	dish:Array,
	payType:Array,
	payStatus:Number,
	total:Number,
	reduce:Number,
	reduceAfter:Number,
	realTotal:Number,
	erase:Number,
	isMember:Boolean,
	isPetcard:Boolean,
	memberName:String,
	memberNum:String,
	memberPhone:String,
	memberBalance:String,
	editPeople:String,
	dishNum:String,
	eatType:String,
	noincome:Number,
	onceincome:Number,
	cashincome:Number,
	wxincome:Number,
	alipayincome:Number,
	schoolincome:Number,
	otherincome:Number,
	memberincome:Number,
	memberBalance:Number,
	petcardincome:Number,
	cardincome:Number,
	credit:Number,
	creditPeople:String,
	other1:String,
	other2:String,
	time:Number,
	year:String,
	month:String,
	day:String,
	acceptStatus: Boolean,
	wx: Boolean,
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
			.sort({'meta.createAt':-1})
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = OrderSchema