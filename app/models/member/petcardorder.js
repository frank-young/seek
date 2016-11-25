var mongoose = require('mongoose')	
var PetcardorderSchema = require('../../schemas/member/petcardorder')
var Petcardorder = mongoose.model('Petcardorder',PetcardorderSchema)

module.exports = Petcardorder 
