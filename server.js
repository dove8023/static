const express=require("express");
const http=require("http");

let app = express();
app.use(express.static("./www"));

let server = http.createServer(app);
server.listen(3000, ()=>{
    console.log("Static server running");
});