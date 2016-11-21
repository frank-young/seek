var mongoose = require('mongoose')	
var PetruleSchema = require('../../schemas/member/petrule')
var Petrule = mongoose.model('Petrule',PetruleSchema)

module.exports = Petrule 
