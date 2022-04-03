var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'uploads'})
var File = require('../controllers/ficheiro');

/* GET home page. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0,16)
  File.list().then(data => {
      res.render('index', { 
          date: d,
          files: data
      });
  })
});

router.get('/inserir', (req,res) => {
  res.render('inserir', {})
})

router.post('/ficheiros',upload.single('file'),(req,res) => {
  let oldPath = __dirname + '/../' + req.file.path
  let newPath = __dirname + '/../fileStorage/' + req.file.originalname

  fs.rename(oldPath, newPath, err => {if(err) {throw err}})

  var d = new Date().toISOString().substring(0,16)
  
  var file = {
      date: d,
      file: req.file.originalname,
      size: req.file.size,
      descricao: req.body.descricao,
      type: req.file.mimetype
  }
  
  File.insert(file)
      .then(_ => res.redirect('/'))
      .catch(err => console.log(err))
})

router.post('/delete/:file',(req,res) => {
  File.remove(req.params.file)
      .then(_ => {
          let filePath = __dirname + '/../fileStorage/' + req.params.file
          fs.unlink(filePath, err => {if(err) {throw err}})
          res.redirect('/')
      })
      .catch(err => {
          console.log(err)
      })
})

router.post('/download/:file',(req,res)=>{
  var filePath = __dirname + '/../fileStorage/'+ req.params.file
  res.download(filePath,function (err) {
    if (!err) return; // file sent
    if (err.status !== 404) return next(err); // non-404 error
    // file for download not found
    res.statusCode = 404;
    res.send('Cant find that file, sorry!');
  });
})

module.exports = router;
