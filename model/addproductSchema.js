var mongoose= require("../db/conn");
var mongoose= require('mongoose');

const productSchema = new mongoose.Schema({
    productname:{
        type:String
    },
    productprice:{
        type:String
    },
    productimage:{
        type:String
    }
})

const add_product = mongoose.model('addprocut2',productSchema)
module.exports=add_product;