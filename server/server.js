const express = require('express')
const app = express();
const PORT = 3000;
app.get('/',(req,res)=>{
    res.send('server');
})
app.listen(PORT,(req,res)=>{
    console.log(`server running on port : ${PORT}`)
})
