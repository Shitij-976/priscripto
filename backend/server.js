
import express from 'express'
import cors from 'cors'
import connectDB from'./config/mongobd.js'
import 'dotenv/config'


//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()

//middleware
app.use(express.json())
app.use(cors())

//api endpoint
app.get('/',(req,res)=>{
    res.send('api working wow')
})

app.listen(port,()=>console.log('server start',port))
