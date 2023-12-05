const dotenv= require('dotenv')
dotenv.config({path:'./.env'});
const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const jwtoken= require('jsonwebtoken');
const registerSchema=mongoose.Schema({
    name:{
        type:String,
        
    },
    email:{
        type:String,
        
    },
    password:{
        type:String,
        
    },
    confirmpassword:{
        type:String,
        
    },
    mobile:{
        type:Number,
        
    },
    message:[
        {
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true,
                unique:true
            },
            mobile:{
                type:Number,
                required:true 
            },
            message:{
                type:String,
                required:true
            }
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})
// create hash password
registerSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password,12);
        this.confirmpassword= await bcrypt.hash(this.confirmpassword,12);
    }
    next();
});

// create authentication token 
registerSchema.methods.generateAuthToken=async function(){
    try{
        let token= jwtoken.sign({_id:this._id},
            process.env.SECRET_KEY);
            this.tokens=this.tokens.concat({token:token})
            await this.save();
            return token;
    }catch(err){
        console.log(err);
    }
}

// create message data
registerSchema.methods.addMessage= async function(name,email,mobile,message){
    try{
        this.message= this.message.concat({name,email,mobile,message});
        await this.save();
        return this.message;
    }catch(error){
        console.log(error)
    }
}

const resgisterModel = mongoose.model('registered-user',registerSchema)
module.exports=resgisterModel