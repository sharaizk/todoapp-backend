const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/userSchema')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name:'xdevs',
    api_key:'633265198349345',
    api_secret:'mZc0qtkcqJ5aitjMy0df7wMcvZA'
})

require('../db/conn')

router.post('/register', async (req,res)=>{
    const {name, username, password, profileimg} = req.body
    let {email} =req.body
    email = email.toLowerCase()
    if(!name || !email || !username || !password){
        return res.status(400).json({error: "Please fill the field"})
    }
    try{
        const img = await cloudinary.uploader.upload(profileimg.file)
        const emailExist = await User.findOne({email:email})
        const userNameExist = await User.findOne({username: username})

        if(emailExist){
            return res.status(400).json({error: 'Email Already Exists'})
        }
        if(userNameExist){
            return res.status(400).json({error: 'Username Already Exists'})
        }

        else{
            const user = new User({name, email, username, password, profileimg: img.url})
            const userRegister = await user.save()
            if(userRegister){
                return res.status(200).send({message:"SIGNED UP"})
            }
        }
    }
    catch(e){
        console.log(e)
    }
})

router.post('/login', async(req,res)=>{
    try {
        const {username, password} = req.body

        if(!username || !password){
            return res.status(400).json({error:'Please fill the data'})
        }
    
        const userFound = await User.findOne({username: username})
    
        if(userFound){

            const isMatch = await bcrypt.compare(password, userFound.password)
            if(!isMatch){
                res.status(400).json({error:'Invalid Credentials'})
            }
    
            else{
                const userData = await User.findOne({username: username}).select({ "_id": 1, "name": 1, "email":1,"username":1, "profileimg":1})
                const token = jwt.sign({userId: userData._id},'My_SECRET_KEY')
                res.status(200).send({userData,token})
            }
        }
        else{
            res.status(400).json({error:'Invalid Credientials'})
        }
    } catch (error) {
        console.log(error)
    }
})

router.patch('/changepassword', async(req,res)=>{
    const{username, oldpassword, newpassword} = req.body
    if(!username || !oldpassword || !newpassword){
        return res.status(400).json({error:'Please fill the data'})
    }
    try {
        const findUser = await User.findOne({username})
        if(findUser){
            const isMatch = await bcrypt.compare(oldpassword, findUser.password)
            if(!isMatch){
                res.status(400).json({error:'Current password is wrong'})
            }
            else{
                const changePass = await User.findOneAndUpdate({username:username}, {password: newpassword})
                res.status(200).send({message:"Password Updated"})
            }
        }
        
    } catch (error) {
            console.log(error)
    }
})

module.exports = router