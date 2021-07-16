const express = require('express')
const app = express()
const cors = require('cors')
const fileupload = require('express-fileupload')
// CONNECTION TO DB
require('./db/conn')
const requireAuth = require('./middlewares/requireAuth')
app.use(fileupload({
    useTempFiles:true
}))
const PORT = 5000

app.use(express.json())
app.use(cors())
app.use(require('./routes/userRoutes'))
app.use(require('./routes/taskRoutes'))


app.get('/',requireAuth,(req,res)=>{
    res.send(`${req.user.email}`)
})

app.listen(PORT,()=>{
    console.log(`${PORT}`)
})