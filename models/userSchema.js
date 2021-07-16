const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profileimg:{
        type:String, 
        required:true
    }
}, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
})

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password  = await bcrypt.hash(this.password,12)
    }
    next()
})
userSchema.pre('findOneAndUpdate',async function(next){
    this._update.password = await bcrypt.hash(this._update.password, 12)
    next()
})

const User = mongoose.model('USER', userSchema)
module.exports = User