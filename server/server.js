const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const {port} = require("./config/config")

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
app.use(bodyParser.json())

app.use("/admin",adminRouter);
app.use("/user",userRouter);
app.listen(port,(req,res)=>{
    console.log(`server running on port : ${port}`)
})
