const express = require('express');
const resgisterModel = require('../model/registrationSchema');
const router= express.Router();
const bcrypt = require('bcryptjs');
const addproductSchema=require('../model/addproductSchema')
const multer=require('multer');
const path = require('path')
const {v4: uuidv4} = require('uuid');
const Authenticate= require('../middleware/authenticate')
// const fileUpload= require('express-fileupload');


router.get('/',(req,res)=>{
   res.send("hello router");
})

// ------------Sign up API-----------
router.post('/register',async(req,res)=>{
   const{name,email,password,confirmpassword,mobile}=req.body;

   if(!name|| !email || !password || !confirmpassword || !mobile){
    return  res.status(422).json({msg:"please fill all the fields"});   
   }

   try{
      const userExist = await resgisterModel.findOne({mobile:mobile})
      if(userExist){
         return res.status(422).json({error:"mobile already exists"});
      }
      else if(password != confirmpassword){
         return res.status(422).json({error:"password doesn't match"})
         
       }
    const registeruser = new resgisterModel({name,email,password,confirmpassword,mobile});
    const register= await registeruser.save();
    if(register){
        res.status(201).json({message:"user registered successfully"});
    }
   }catch(err){
    console.log(err);
   }

})



// -------------Login API-------------

router.post('/login',async(req,res)=>{

   try{
      const {email,password}= req.body;
      if(!email || !password){
         return res.status(400).json({error:"Please Fill All Fields"})
      }
      const userLogin = await resgisterModel.findOne({email:email});
      // const roles = userLogin.roles;
      console.log(userLogin);

      const isMatch= await bcrypt.compare(password,userLogin.password)
      const token = await userLogin.generateAuthToken()
      console.log(token);
      res.cookie("jwtoken",token,{
         expires:new Date(Date.now()+ 600000000000000),
         httpOnly:true
      })

      if(!isMatch){
         res.json({error:"invalid credentials"});
      }
      else{
         res.json({error:"user login successfully"});
      }
   }
   catch(err){
      console.log (err);
   }
});


// -------------------api of post and upload ---------------------------

var maxSize = 1*1000*1000;
const storage = multer.diskStorage({
   destination: (req,file,cb)=>{
       cb(null, '../backend/upload');
   },

   filename: (req,file,cb)=>{
      cb(null  ,uuidv4()+'-'+Date.now()+ path.extname(file.originalname))
     
   }
});
const fileFilter = (req,file,cb)=>{
   const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
   if(allowedFileTypes.includes(file.mimetype)){
       cb(null,true);
   } else{
       cb(null,flase);
   }
}

let upload = multer({storage, fileFilter,limits: { fileSize: maxSize }});

router.post('/addproduct' ,upload.single("productimage"),async(req,res)=>{
   try{
   const {productname,productprice}=req.body;
   const productimage=req.file.filename;
   const user = new addproductSchema({productname,productprice,productimage})
   const data = await user.save()
   if (data){
       console.log('data send')
   }
}catch(err){
   console.log(err)
}
})

  // upload files react
   

router.route('/academics/:id').get((req,res)=>{
   addproductSchema.find()
   .then(user=>res.json(user))
   .catch(err=>res.status(400).json('Error'+err));
})


// ---- student1 jsx page api  -----

// router.route('/detailpage/:id').get((req,res)=>{
//    addproductSchema.findById()
//    .then(user=>res.json(user))
//    .catch(err=>res.status(400).json('Error'+err));
// })

router.get('/detailpage/:id',(req,res)=>{
   addproductSchema.findById(req.params.id)
   
   .then(user=>res.json(user))
   console.log(user)
   .catch(err=>res.status(400).json('Error'+err));
})


// ----------Contact Api----------


router.get('/getdata',Authenticate,(req,res)=>{
   console.log("hello use of contact");
   res.send(req.rootUser);
})


router.post('/Contact',Authenticate,async(req,res)=>{
   try{
      const {name,email,mobile,message}=req.body;
      if(!name || !email || !mobile || !message){
         console.log("error in contact form")
         return res.json({error:"plz fill the contact form"});
      }
      const userContact= await resgisterModel.findOne({_id:req.userID});
      if(userContact){
         const usermessage= await userContact.addMessage(name,email,mobile,message);
         await userContact.save();
         res.status(201).json({message:"user contact successfully"});
      }
   }catch(err){
      console.log(err);
   }
})

// -------------user Profile ----------
router.get('/user',Authenticate,(req,res)=>{
   res.send(req.rootUser);
})




module.exports= router;