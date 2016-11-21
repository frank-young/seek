var mongoose = require('mongoose')	
var PetcardSchema = require('../../schemas/member/petcard')
var Petcard = mongoose.model('Petcard',PetcardSchema)

module.exports = Petcard 
