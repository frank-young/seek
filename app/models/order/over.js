var mongoose = require('mongoose')	
var OverSchema = require('../../schemas/order/over')
var Over = mongoose.model('Over',OverSchema)

module.exports = Over 
