var mongoose = require('mongoose')

var ficheiroSchema = new mongoose.Schema({
    date: Date,
    file: String,
    size: Number,
    descricao: String,
    type: String
})

module.exports = mongoose.model('ficheiro',ficheiroSchema)