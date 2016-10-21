var mongoose = require('mongoose')	
var MemberorderSchema = require('../../schemas/wechat/memberorder')
var Memberorder = mongoose.model('Memberorder',MemberorderSchema)

module.exports = Memberorder 
