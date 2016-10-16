var mongoose = require('mongoose')	
var PaytypeSchema = require('../../schemas/credit/paytype')
var Paytype = mongoose.model('Paytype',PaytypeSchema)

module.exports = Paytype 
