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
const PORT = process.env.PORT ||5000

app.use(express.json({limit: '50mb'}));

app.use(cors())
app.use(require('./routes/userRoutes'))
app.use(require('./routes/taskRoutes'))


app.get('/',(req,res)=>{
    res.send('Hello World')
})

app.listen(PORT,()=>{
    console.log(`${PORT}`)
})