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
app.use((req, res, next)=>{
    console.log("what");
    res.header("Content-Type", "text/json; charset=utf-8");
    next();
})
app.use(express.static("./www"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());


/* 测试 authenticate 认证 */
app.get("/auth", (req, res)=>{
    res.header("Content-Type", "text/html; charset=utf-8");

    let auth = req.headers["authorization"];

    if(!auth){
        res.header('WWW-Authenticate', 'Basic realm="test"');
        res.status(401);
        res.end("请输入密码");
        return;
    }

    let tmp = auth.split(" ");
    let buf = new Buffer(tmp[1], 'base64');
    let plain_auth = buf.toString();
    console.log("the authenticate : ", plain_auth);
    let creds = plain_auth.split(":");
    res.status(200);
    res.end("username: " + creds[0] + "; password: " + creds[1]);
});


app.post("/update", (req, res)=>{
    console.log(req.body);
    /*res.json({
        error : null,
        stdout: "stdout",
        stderr: "stderr"
    });

    return;*/
    

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