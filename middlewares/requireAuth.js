const jwt = require('jsonwebtoken')
const mongoose =require('mongoose')
const User = require('../models/userSchema')

module.exports = (req,res,next) =>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).send({error:"You must be logged in"})
    }
    const token = authorization.replace('Bearer ','')
    console.log(token)
    jwt.verify(token,'My_SECRET_KEY', async(err, payload)=>{
        if(err){
            return res.status(401).send({error:"YOU MUST BE LOGGED IN"})
        }
        const {userId} = payload
        const user = await User.findById(userId)
        req.user = user
        next()
    })
}