
//express--package
const express = require('express');
const app = express()
//dotenv-package
require('dotenv').config();
//cors-package
var cors = require('cors')
app.use(cors())
//body-parse-package
var bodyParser = require('body-parser');
app.use(bodyParser.json())

//Geting router
var userRouter = require('./Routers/user');
var productRouter=require('./Routers/product');


//use Router
app.use('/user',userRouter);
app.use('/product',productRouter);


app.use('/',(req,res)=>{
    res.send({message:"E-commerce backEnd working"});
})

app.listen(process.env.PORT || '9000', () => (console.log("localhost:9000")))