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
  origin: true,
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
const verifyEduRouter = require('./routes/emailVerificationRoutes')

app.use('/api', authRouter)
app.use('/api/users', userRouter)
app.use('/api/listings', listingRouter)
app.use('/api/email-verify', verifyEduRouter)
app.use(errorHandler)

SocketService.initialize(server)

const port = process.env.PORT || 3000
server.listen(port, '0.0.0.0', () => console.log(`server listening on port ${port}`))
