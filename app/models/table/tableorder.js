var mongoose = require('mongoose')	
var TableorderSchema = require('../../schemas/table/tableorder')
var Tableorder = mongoose.model('Tableorder',TableorderSchema)

module.exports = Tableorder 
