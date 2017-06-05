const express=require("express");
const http=require("http");
const child = require("child_process");
const Config= require("./config");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const ip = require("ip");


console.log(ip.address());

let app = express();

app.use((req, res, next)=>{
    console.log(req.url);
    console.log(222, req.ip);
    try{
        console.log(req.connection.remoteAddress);
    }catch(e){
        console.log('worry');
    }
    
    next();
});
app.use(express.static("./www"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());



app.post("/update", (req, res)=>{
    console.log(req.body);

    

    if(!req.body.username || !req.body.password){
        res.status(500).end("worry");
        return;
    }
    let pass = false;
    for(let item of Config.users){
        if(item.username == req.body.username && item.password == req.body.password){
            pass = true;
            break;
        }
    }
    
    if(!pass){
        res.status(500).end("not authorid.");
        return;
    }

    child.exec("git pull", (error, stdout, stderr)=>{
        res.json({
            error : error,
            stdout: stdout,
            stderr: stderr
        })
    });
});



let server = http.createServer(app);
server.listen(3000, ()=>{
    console.log("Static server running");
});