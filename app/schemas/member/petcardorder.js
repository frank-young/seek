var mongoose = require('mongoose')
var PetcardorderSchema = new mongoose.Schema({
	order_num:String,
	username:String,
	phone:String,
	code:String,
	bonus:Number,
	fee:Number,
	balance:Number,
	cashincome:Number,
	wxincome:Number,
	alipayincome:Number,
	position:String,
	edit_people:String,
	pay_type:Number,
	start:Number,
	year:String,
	month:String,
	day:String,
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

PetcardorderSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})


PetcardorderSchema.statics = {
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

module.exports = PetcardorderSchema