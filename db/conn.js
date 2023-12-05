const mongoose= require('mongoose');
// const data= mongoose.connect;
const Db= process.env.DATABASE;
mongoose.connect(Db,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("connecttion successfull"))
.catch((err) => console.log(err));



module.exports=Db;