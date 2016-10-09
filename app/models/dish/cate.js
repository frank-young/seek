var mongoose = require('mongoose')	
var CateSchema = require('../../schemas/dish/cate')
var Cate = mongoose.model('Cate',CateSchema)

module.exports = Cate 
