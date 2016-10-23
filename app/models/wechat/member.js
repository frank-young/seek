var mongoose = require('mongoose')	
var MemberSchema = require('../../schemas/wechat/member')
var Member = mongoose.model('Member',MemberSchema)

module.exports = Member 
