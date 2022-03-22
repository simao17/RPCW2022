var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static.js')
var {parse} = require('querystring')

function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
        callback(parse(body))
        })
    }
}

// Template para o formulÃ¡rio de aluno ------------------
function geraPag(list1,list2){
    let pagHTML = `
    <html>
        <head>  
            <title>Registo de uma tarefa</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="w3.css"/>
            <style>
            body, html {
                width: 100%;
                height: 100%;
                margin: 0;
              }
              .container {
                width: 100%;
                height: 100%;
              }
              .leftpane {
                  width: 50%;
                  height: 100%;
                  float: left;
                  background-color: white;
                  border-collapse: collapse;
              }
              .rightpane {
                width: 50%;
                height: 100%;
                position: relative;
                float: right;
                background-color: #F0F0F0;
                border-collapse: collapse;
              }
              .toppane {
                width: 100%;
                height: 350px;
                border-collapse: collapse;
              }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="toppane">
                    <div class="w3-container w3-teal">
                        <h2>Registo de uma Tarefa</h2>
                    </div>

                    <form class="w3-container" action="/tarefas" method="POST">
                        <label class="w3-text-teal"><b>Data de registo</b></label>
                        <input class="w3-input w3-border w3-light-grey" type="text" name="date">
                
                        <label class="w3-text-teal"><b>Data límite para o fim da tarefa</b></label>
                        <input class="w3-input w3-border w3-light-grey" type="text" name="deadline">

                        <label class="w3-text-teal"><b>Quem realiza a tarefa </b></label>
                        <input class="w3-input w3-border w3-light-grey" type="text" name="who">
                
                        <label class="w3-text-teal"><b>Tarefa</b></label>
                        <input class="w3-input w3-border w3-light-grey" type="text" name="task">

                        <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                        <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
                    </form>
                </div>
                <div class="rightpane">
                    <h2 style="text-align:center"> Tarefas Realizadas  </h2>
                    <ul>
                    `+ list1 +`
                </ul>
                </div>
                <div class="leftpane">
                    <h2 style="text-align:center"> Tarefas a Fazer </h2>
                    <ul>
                    `+ list2 +`
                </ul>
                </div>
            <footer class="w3-container w3-teal">
                <address>Gerado por tarefas::RPCW2022</address>
            </footer>
        </body>
    </html>
    `
    return pagHTML
}

function geraPostConfirm(tarefa){
    return `
    <html>
        <head>
            <title>POST receipt: ${tarefa.id}</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${tarefa.id}</h1>
            </header>

            <div class="w3-container">
                <p><a href="http://localhost:3000/tarefas"> Aceda à página </p>
            </div>

            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::RPCW2022 - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

function geraListaRealizadas(tarefas){
    let list = ''
    tarefas.forEach(t => {
        list+=`<li> ${t.task} - ${t.who} em ${t.date} </li> `
    })
    return list
}

function geraListaPorFazer(tarefas){
    let list = ''
    tarefas.forEach(t => {
        list+=`<li> ${t.task} - ${t.who} até ${t.deadline} <button onclick="mudaType(${t.id})">Feita</button></li> `
    })
    return list
}

// CriaÃ§Ã£o do servidor
var galunoServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)
    counter=0

    // Tratamento do pedido
    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /alunos --------------------------------------------------------------------
                if(req.url == "/"){
                    axios.get("http://localhost:3000/tarefas?type=porfazer")
                        .then(response => {
                            var tarefas = response.data
                            var temp = geraListaPorFazer(tarefas)
                            axios.get("http://localhost:3000/tarefas?type=realizadas")
                                .then(response => {
                                    var tarefas = response.data
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write(geraPag(geraListaRealizadas   (tarefas),temp))
                                    res.end()
                                })
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>NÃ£o foi possÃ­vel obter a lista de alunos...")
                            res.end()
                        })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " nÃ£o suportado neste serviÃ§o.</p>")
                    res.end()
                }
                break
            case "POST":
                if(req.url =='/tarefas'){
                    recuperaInfo(req,resultado => {
                        resultado['id'] = counter++
                        resultado['type'] = 'porfazer'
                        console.log('POST de tarefa:' + JSON.stringify(resultado))
                        axios.post('http://localhost:3000/tarefas',resultado)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraPostConfirm(resp.data, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write('<p>Recebi um post não suportado</p>')
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " nÃ£o suportado neste serviÃ§o.</p>")
                res.end()
        }
    }
})

galunoServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')