let koa = require("koa");
let app = new koa();


app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms');
});

app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log("%s %s - %s", this.method, this.url, ms);
});


app.use(function *(){
    this.body = "<h1>Hello world</h1>";
});

// app.listen(3000);

const http = require("http");

http.createServer(app.callback()).listen(3000);