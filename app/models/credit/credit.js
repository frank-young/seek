var mongoose = require('mongoose')	
var CreditSchema = require('../../schemas/credit/credit')
var Credit = mongoose.model('Credit',CreditSchema)

module.exports = Credit 
