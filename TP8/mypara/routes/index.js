var express = require('express');
var router = express.Router();
var Para = require('../controllers/para')

/* GET home page. */
router.get('/paras', function(req, res) {
  Para.listar()
    .then(dados => {
      res.status(200).jsonp(dados)
    })
    .catch(e => {
      res.status(500).jsonp({erro: e})
    })
});

router.post('/paras', function(req, res) {
  Para.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(err => res.status(501).jsonp(err))
})

router.put('/paras/editar/:id', function(req, res) {
  Para.editar(req.params.id,req.body)
    .then(dados =>{
      res.status(200).jsonp(dados)
    })
    .catch(err =>{
      res.status(502).jsonp({erro: err})
    })
});

router.delete('/paras/remover/:id', function(req, res) {
  Para.remover(req.params.id)
    .then(dados =>{
      res.status(200).jsonp(dados)
    })
    .catch(err =>{
      res.status(503).jsonp({erro: err})
    })
});


module.exports = router;