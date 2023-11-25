const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
const { URL } = require('../Dbconfig/Dbconfig');
let db = mongoose.connect(URL)
    .then(() => console.log('Connected!'));
const { hashpassword, hashCompare, createToken } = require('../Authentication/auth');
const { UserModel } = require('../Model/userSchemas');
const { productModel } = require('../Model/productschema');
//get all user
exports.alluser=async (req, res) => {
    try {
      let user = await UserModel.find({}, { password: 0 });
      res.status(200).send({
        message: "user data fetch successful",
        user: user
      });
  
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error", error })
    }
  };
  
//signup 
exports.signup = async (req, res) => {
    try {
        let user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            let hashedpassword = await hashpassword(req.body.password);
            req.body.password = hashedpassword;
            let data = await UserModel.create(req.body);
            res.status(200).send({
                userrd:true,
                message: "User Signup Successfull!"
            })
        } else {
            res.status(400).send({ userrd:false, message: "user alreay Exists" })
        }

    } catch (error) {
        res.status(500).send({ userrd:false, message: `Internal server error.\n\n${error}` });
        console.log(error)

    }
}

//login 
exports.login = async (req, res) => {
    try {
        let user = await UserModel.findOne({ email: req.body.email });
        if (user) {
            timeExpires = '2h'
            if (await hashCompare(req.body.password, user.password)) {
                let token = await createToken({
                    name: user.name,
                    email: user.email,
                    role:user.role,
                }, timeExpires)
                res.status(200).send({
                    message: "Login successful",
                    token,
                    myid:user._id,
                    myname:user.name,
                    myRole:user.role,
                    userrd:true,
                });
            } else {
                res.status(402).send({ userrd:false, message: "Invalid Credentials" })
            }

        } else {
            res.status(400).send({ userrd:false, message: "user does not exists!" })
        }
    } catch (error) {
        res.status(500).send({ userrd:false, message: `Internal server error.\n\n${error}` });
        console.log(error)

    }
}
//forgotpassword
exports.forgotpassword=async(req,res)=>{
    try {
        let user = await UserModel.findOne({ email: req.body.email });
        timeExpires = '10m'
        if (!user) {
            res.send({ rd: false, message: "user not exists" })
        } else {
            const token = await createToken({
                email: user.email,
                id: user._id
            }, timeExpires)
            console.log(token, user._id)
            const link = `${process.env.mainurl}/resetpassword/${user._id}/${token}`

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.G_MAIL,
                    pass: process.env.G_MAIL_PASSWORD,
                }
            });
            var mailOptions = {
                from: process.env.G_MAIL,
                to: user.email,
                subject: 'Reset password',
                text: link
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.send({  rd:false,error})
                } else {
                    res.send({  rd: true, message: "mail send " })
                }
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ rd: false, message: `Internal server error.\n\n${error}` });
    }

}
//resetpassword
exports.resetpassword=async(req,res)=>{
    const { id, token } = req.params;
    try {
        const olduser = await UserModel.findOne({ _id: id });
        if (!olduser) {
            res.send({  rd: true, message: "user not exists" })
        } else {
            const verify = jwt.verify(token, process.env.secretKey);
            const encryptedPassword = await hashpassword(req.body.password)
            await UserModel.updateOne(
                {
                    _id: id
                },
                {
                    $set: {
                        password: encryptedPassword,
                    }
                }
            );
            res.status(200).send({
                rd: true,
                message: "password reset"
            })
        }
    } catch (error) {
        console.log(error)
        res.send({ rd: false, message: "Something Went Wrong" })
    }
}

//Add favorite Product

exports.addfavoriteProduct=async(req,res)=>{
    console.log(req.params.id,req.body)
    try {
        let favoriteProduct=await productModel.find({_id:req.body.idx});
        console.log(favoriteProduct)
        if(favoriteProduct){
          let product=await UserModel.findOneAndUpdate(
            {
                _id: req.params.id
              },
              {
                $push: { favoriteProducts:req.body.idx}
              }
            );    
            res.status(200).send({message:"Add Favorite Product",product});

        }else{
            res.status(400).send({message:"Product Id not wrong"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ rd: false, message: `Internal server error.\n\n${error}` });

    }
}
//Get  favorite Product
exports.getfavoriteProduct=async(req,res)=>{
    console.log(req.params.id)
    try {
        let user=await UserModel.find({_id:req.params.id});
        console.log(user[0].mobile,user)
        let list=user[0].favoriteProducts;
        console.log(list)
        if(list){
          let product=await productModel.find({_id:{$in:list}})    
            res.status(200).send({message:"Your Favorite Product",product});

        }else{
            res.status(400).send({message:"Product Id not wrong"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ rd: false, message: `Internal server error.\n\n${error}` });

    }
}

//orderList
exports.addorderlist=async(req,res)=>{
    console.log(req.params.id,req.body)
    try {
        let favoriteProduct=await productModel.find({_id:req.body.idx});
        console.log(favoriteProduct)
        if(favoriteProduct){
          let product=await UserModel.findOneAndUpdate(
            {
                _id: req.params.id
              },
              {
                $push: { orderHistory:req.body.idx}
              }
            );    
            res.status(200).send({message:"your product Buy",product});

        }else{
            res.status(400).send({message:"Product Id not wrong"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ rd: false, message: `Internal server error.\n\n${error}` });

    }
}

//Get  orderList
exports.getorderlist=async(req,res)=>{
    console.log(req.params.id)
    try {
        let user=await UserModel.find({_id:req.params.id});
        let list=user[0].orderHistory;
        console.log(list)
        if(list){
          let product=await productModel.find({_id:{$in:list}})    
            res.status(200).send({message:"Your Orders",product});

        }else{
            res.status(400).send({message:"Product Id not wrong"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ rd: false, message: `Internal server error.\n\n${error}` });

    }
}
