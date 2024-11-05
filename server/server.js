require('dotenv').config()
const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const cookieParser = require('cookie-parser')
const cors = require('cors')
const passport = require('passport')
const errorHandler = require('./middleware/errorHandler')
const SocketService = require('./config/socket')


const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
require('./config/passportConfig')(passport)

const userRouter = require('./routes/userRoutes')
const authRouter = require('./routes/authRoutes')
const listingRouter = require('./routes/listingRoutes')

app.use('/api', authRouter)
app.use('/api/users', userRouter)
app.use('/api/listings', listingRouter)
app.use(errorHandler)

SocketService.initialize(server);

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server listening on port ${port}`))
