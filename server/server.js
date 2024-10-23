const express = require('express')
const app = express();
const bodyParser = require('body-parser')

const PORT = 3000;
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
app.use(bodyParser.json())

app.use("/admin",adminRouter);
app.use("/user",userRouter);
app.listen(PORT,(req,res)=>{
    console.log(`server running on port : ${PORT}`)
})
