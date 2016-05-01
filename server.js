/**
 * Created by holland on 4/15/16.
 */

var http = require('http');
var PORT = 8080;
var fs = require('fs');
var url = require('url');
var path = require('path');
var ddbManager = require('ddbManager');
var WebSockeServer = require('websocket').server;

// returns the real path to requested file
function parseURL(filePath){

    var parsedPath = filePath.split("/");
    var fileName = parsedPath[parsedPath.length-1];
    var realPath = filePath.substring(0,filePath.length-fileName.length);
    var contentType = "text/plain";

    if(fileName == ""){
        fileName = "index.html";
    }
    console.log("fileName: "+fileName);

    switch (path.extname(fileName)){
        case '.html' :
            contentType = "text/html";
            realPath = realPath + 'public/html/' + fileName;
            break;
        case '.js' :
            contentType = "text/javascript";
            realPath = realPath + 'public/scripts/' + fileName;
            break;
        case '.css' :
            contentType = "text/css";
            realPath = realPath + 'public/css/' + fileName;
            break;
        case '.json' :
            contentType = "application/json";
            realPath = realPath + 'public/resources/' + fileName;
            break;
        case '.png' :
            contentType = "image/png";
            realPath = realPath + 'public/images/' + fileName;
            break;
        case '.jpg' :
            contentType = "image/jpeg";
            realPath = realPath + 'public/images/' + fileName;
            break;
        case '.csv' :
            contentType = "text/javascript";
            realPath = realPath + 'public/scripts/' + fileName;
            break;
    }

    console.log("RealPath: "+realPath);
    return [realPath, contentType];
}

function handleRequest(request, response){
    console.log("requested url: "+request.url);

    var uri = url.parse(request.url).pathname;
    var requestedPath = path.join(process.cwd(), uri);

    var temp = parseURL(requestedPath);
    var realPath = temp[0];
    var contentType = temp[1];

    console.log("realPath: "+realPath);

    fs.exists(realPath, function(exists){
       if(!exists){
           response.writeHead(404, {"Content-Type": "text/plain"});
           response.write("404 not found\n");
           response.end();
           return;
       }

        fs.readFile(realPath, "binary", function(err, file){
            if(err){
                response.writeHead(500, {"Content-Type":contentType});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });

    try{

    }
    catch(err){
        console.log("err: "+err);
    }
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on http://localhost:"+PORT);
});

wsServer = new WebSockeServer({
    httpServer : server
});

wsServer.on('request', function(request){
    var connection = request.accept(null, request.origin);
    var data;
    connection.on('message', function(message){
        if(message.type === 'utf8'){
            data = message.utf8Data;
            if(data.name = "get_ddb_date_times"){
                var timeStart = data.timeStart;
                var timeEnd = data.timeEnd;
                ddbManager.getDateTimeRange(timeStart, timeEnd, function(ddbResponse){
                    connection.send({
                        "name" : "get_ddb_date_times",
                        "type" : "response",
                        "ddbData" : ddbResponse
                    });    
                });
            }
        }
    });

    connection.on('close', function(connection){

    });
});