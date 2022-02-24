var http = require('http')
var fs = require('fs')
var url = require('url')

http.createServer(function(req,res){ 
    var myurl = url.parse(req.url).pathname
    if(myurl== '/filmes' || myurl == '/' || myurl=='/filmes/'){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        var rs = fs.createReadStream('index.html').pipe(res)
    }
    else if(fs.existsSync('.' + myurl + '.html')){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        var rs = fs.createReadStream('.' + myurl + '.html').pipe(res)
    }
    else{
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
        res.write("<p>Erro, ficheiro não encontrado...</p>")
        res.end()
    }
}).listen(7777)

/*
http.createServer(function(req,res){
    var myurl = url.parse(req.url, true).pathname
    console.log(myurl)
    if(myurl=="/filmes" || myurl=="/" || myurl=="/filmes/" ){
        fs.readFile('./index.html', function(err,data){
            res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'})
            if(err){
                res.write("<p>Erro, ficheiro não encontrado...</p>")
            }
            else{
                res.write(data)
            }
            res.end()
        })
    }
    else{
        fs.readFile('.' + myurl + '.html', function(err,data) {
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
            if(err){
                res.write("<p>Erro, ficheiro não encontrado...</p>")
            }
            else{
                res.write(data)
            }
            res.end()
        })
    }
}).listen(7777)
*/
