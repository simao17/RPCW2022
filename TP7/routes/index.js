var express = require('express');
var router = express.Router();
var fs = require('fs');

const axios = require('axios');
const apiKey = fs.readFileSync('./key.txt',{encoding:'utf-8', flag:'r'})

router.get('/', function(req, res, next) {
  axios.get('http://clav-api.di.uminho.pt/v2/classes?&nivel=1&apikey=' + apiKey)
    .then(response => {
      var data = response.data
      res.render('index', {items: data});
    })
    .catch(function(error){
      res.render('error', {error: error});
    });
});

router.get('/classes/:codigo', function(req, res, next) {
  axios.get('http://clav-api.di.uminho.pt/v2/classes/c'+ req.params.codigo +'?apikey=' + apiKey)
    .then(response => {
      var objeto = response.data
        res.render('classe', {classe: objeto});
    })
    .catch(function(error){
      res.render('error', {error: error});
    });
});

module.exports = router;