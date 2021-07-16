const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const currentdate = new Date()
const taskSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true,
        default: `${currentdate.getFullYear()}-${(currentdate.getMonth() + 1).toString().padStart(2, "0")}-${currentdate.getDate().toString().padStart(2, "0")}`
    },
    tasks:[
        {
            task:{
                type: String,
                required: true,
            },
            status:{
                type:String,
                required: true,
                default: 'Incomplete'
            }
        }
    ]
}, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
})


const Task = mongoose.model('TASK', taskSchema)
module.exports = Task