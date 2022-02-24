from __future__ import print_function
import re
import json
import os


def listToString(s): 
    # initialize an empty string
    str1 = ", " 
    
    # return string  
    return (str1.join(s))

file = open('cinemaATP.json')

data = json.load(file)

indice = 1

filmes = ""
  
try:
    # Create target Directory
    os.mkdir('./filmes')
    print("Directory Created ") 
except FileExistsError:
    print("Directory already exists")


for i in data:
    text = "<html>\n\
    <head>\n\
        <title>" + str(i['title']) +"</title>\n\
    </head>\n\
    <body>\n\
        <h1>"+ str(i['title']) +"</h1>\n\
        <ul>\n\
            <li><b>Year:</b> "+ str(i['year']) +"</li>\n\
            <li><b>Cast:</b> "+ listToString((i['cast']))+"</li>\n\
            <li><b>Genres:</b> "+ listToString((i['genres']))+"</li>\n\
        </ul>\n\
    </body>\n\
</html>" 
    filmes +="              <li> <a href=\"http://localhost:7777/filmes/filme"+str(indice)+"\">"+str(i['title'])+"</a> </li>\n"

    f = open("./filmes/filme"+ str(indice) + ".html","w")
    f.write(text)
    f.close
    indice+=1


texto = "<html>\n\
    <head>\n\
        <title>Index</title>\n\
    </head>\n\
    <body>\n\
        <h1>Index</h1>\n\
        <ul>\n" + filmes +"\
        </ul>\n\
    </body>\n\
</html>"

index = open("index.html","w")
index.write(texto)
index.close