var http = require('http')
var url = require('url')
const axios = require('axios');

function generateMainPage(){
    page = "<html>\n\
    <head>\n\
        <title> Academia de Música </title>\n\
    </head>\n\
    <body>\n\
        <h1>Academia de Música </h1>\n\
        <ul>\n\
            <li><a href=\"http://localhost:4000/alunos\"> Lista de alunos </a></li>\n\
            <li><a href=\"http://localhost:4000/instrumentos\"> Lista de instrumentos </a></li>\n\
            <li><a href=\"http://localhost:4000/cursos\"> Lista de cursos </a></li>\n\
        </ul>\n\
    </body>\n\
</html>" 
    return page
}

function generatePage(table, subject){
    page = "<html>\n\
    <head>\n\
        <title>" + subject + "</title>\n\
        <style>\
            table, th, td {\
            border: 1px solid black;\
            border-collapse: collapse;\
            }\
            th, td {\
            padding: 5px;\
            padding-right: 0px;\
            }\
        </style>\
    </head>\n\
    <body>\n\
        <h1>"+ subject +"</h1>\n"
        + table + 
    "</body>\n\
</html>"
    return page
}

function generateTable(subject){
    flag = 1;
    aux = "";
    return axios.get("http://localhost:3000/"+subject)
    .then((resp) => {
        temp = resp.data;
        table = "<table class=\"w3-table-all\">\n\
    <tr>"
        temp.forEach(c => {
            if (flag){
                Object.keys(c).forEach(x => {
                    table += "<th style=\"width:1%\">"+x+"</th> "
                });
                table += "</tr>\n"
                flag=0;
            }
            table += "    <tr>"
            Object.values(c).forEach(y => {
                if(typeof y === 'object'){
                    table += "<td>"+y["#text"]+"</td> "
                }
                else{
                    table += "<td>"+y+"</td> "
                }
            });
            table += "</tr>\n"
        });
        table += "</table>\n"
        return table
    })
}


http.createServer(function (req,res) {
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)
    var myurl = url.parse(req.url,true).pathname
    if(myurl == "/"){
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write(generateMainPage())
        res.end()
    }
    else if(myurl=="/alunos") {
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        generateTable("alunos")
            .then(data => { 
                res.write(generatePage(table,"Alunos"))
                res.end()
            }).catch(err => console.log(err))
        //res.write(generatePage(table,"Alunos"))
        //res.end()
    }
    else if(myurl=="/cursos") {
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        generateTable("cursos")
            .then(data => { 
                res.write(generatePage(table,"Cursos"))
                res.end()
            }).catch(err => console.log(err))
        //res.write(generatePage(table,"Cursos"))
        //res.end()
    }
    else if(myurl=="/instrumentos") {
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        generateTable("instrumentos")
            .then(data => { 
                res.write(generatePage(table,"Instrumentos"))
                res.end()
            }).catch(err => console.log(err))
        //res.write(generatePage(table,"Instrumentos"))
        //res.end()
    }
}).listen(4000)