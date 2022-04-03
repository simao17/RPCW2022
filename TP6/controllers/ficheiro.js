const mongoose = require('mongoose')
var Ficheiro = require('../models/ficheiro')


module.exports.list=() =>{
    return Ficheiro
        .find()
        .sort({file:1})
        .exec()
}

module.exports.lookup = ficheiro =>{
    return Ficheiro
        .findOne({file: ficheiro})
        .exec()
}

module.exports.insert = ficheiro =>{
    var newFicheiro = new Ficheiro(ficheiro)
    return newFicheiro.save()
}

module.exports.remove = ficheiro => {
    return Ficheiro
        .deleteOne({file: ficheiro})
        .exec()
}