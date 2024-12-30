const {Validator} = require('node-input-validator')
const siteHelper = require('../helpers/site_helper')
const {User} = require('../models/association')
const bcrypt = require('bcryptjs')
module.exports = {
    signup: async function (req , resp , next) {
        try {
            const v = new Validator(req.body , {
                username :'required|string',
                password :'required|length:20,8',
                cpassword : 'required|same:password'
            })
            const matched = await v.check();
            if(!matched){
                return resp.status(403).send({
                    status: 'val_err', 
                    message: "Validation error", 
                    val_msg: v.errors 
                });
             
            }
            let hashedPassword = await bcrypt.hash(req.body.password , 10);
            let doc ={
                username : req.body.username,
                password :hashedPassword,
            }
            const data = await User.create(doc);
            // console.log(data)
            return resp.status(201).send({
                status:'sucess',
                message :'User registerd successfully',
                data :data
            })
        } catch (error) {
            console.log(error)
            return resp.status(500).send({
                status :'error',
                message :error?.message ?? 'something went wrong'
            })
        }
    }
    ,
    signin : async function (req , resp , next){
        try {
            const v = new Validator(req.body  ,{
                username :'required',
                password :'required'
            })
            const matched  = await v.check();
            if(!matched){
                return resp.status(403).send({
                    status :'val_err',
                    message: "Validation error", 
                    val_msg: v.errors 
                })
            }
            let user_details = await User.findOne({ where :{username : req.body.username}});
            // console.log(user_details.dataValues.password)
            if (!user_details) {
                return resp.status(200).send({
                  status :"error",
                  message :"user not found."
                })
            }
            const validPassword = bcrypt.compareSync(req.body.password, user_details.dataValues.password);
            if(!validPassword){
                return resp.status(200).send({
                    status :'error',
                    message : 'Please enter valid credential'
                })
            }
            let payload ={
                id: user_details.user_id, 
                username :user_details.username,
            }
            const token = await siteHelper.generateToken(payload);
            return resp.status(200).send({
                status:"success",
                message:"Loggedin successfully.!",
                token:token,
                user_data: user_details,
            })


        } catch (e) {
            return resp.status(200).send({
                status :'error',
                message : e?.message ?? 'something went wrong!'
            })
        }
    }
}