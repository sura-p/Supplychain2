const express = require('express');
const path  = require('path');
const parser = require('body-parser')
const rout = require('./routes/rout');
const app = express();
const port = process.env.PORT || 5000;
app.use(parser.urlencoded());
// app.use(express.static(path.join(__dirname, './')));
console.log(__dirname +'/views/supplier')
app.use(express.static(__dirname +'/views'));
app.set('view engine','ejs');
app.use('/',rout);
app.listen(port,()=>{
    console.log("server is online",port);
})