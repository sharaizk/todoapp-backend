const mongoose = require('mongoose')
const DB = 'mongodb+srv://sharaizk:Ppaplk123@cluster0.boqci.mongodb.net/TodoApp?retryWrites=true&w=majority'

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
    console.log('Connection Established')
}).catch((e)=>{
    console.log(e)
})