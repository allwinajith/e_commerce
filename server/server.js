import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import router from './routes/authRoutes.js'

dotenv.config()

const port = process.env.PORT || 5000
console.log(port);


connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', router)

app.listen(port, ()=>console.log("Server is running on the port", port))