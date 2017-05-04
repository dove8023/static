const express=require("express");
const http=require("http");
const child = require("child_process");

let app = express();
app.use(express.static("./www"));
app.post("/update", (req, res)=>{
    child.exec("git pull", (error, stdout, stderr)=>{
        if(error){
            console.log(error);
        }

        if(stdout){
            console.log(stdout);
            res.send(stdout);
            return;
        }

        if(stderr){
            console.log(stderr);
        }
        res.send(error || stderr);
    });
});

let server = http.createServer(app);
server.listen(3000, ()=>{
    console.log("Static server running");
});