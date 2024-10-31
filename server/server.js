require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const passport = require('passport')
const errorHandler = require('./middleware/errorHandler')

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

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server listening on port ${port}`))
