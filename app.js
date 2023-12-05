const dotenv= require('dotenv')
dotenv.config({path:'./.env'});
var cookieParser= require('cookie-parser');

const data= require('./db/conn');

const express= require('express');
var app=express();
app.use(express.json());
app.use('/upload',express.static('upload'));

app.use(cookieParser());
app.use(require('./router/auth'));



const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
// app.use('/',router);
// app.listen(2222);