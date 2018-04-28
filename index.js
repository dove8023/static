let koa = require("koa");
let static = require("koa-static");
let app = new koa();


app.use(function* (next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms');
});

app.use(function* (next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log("%s %s - %s", this.method, this.url, ms);
});

app.use(static("./www"));

const http = require("http");

http.createServer(app.callback()).listen(3000);