var mongoose = require('mongoose')	
var ItemSchema = require('../../schemas/order/item')
var Item = mongoose.model('Item',ItemSchema)

module.exports = Item 
