require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const userRouter = require('./routes/userRoutes')

app.use('/api/users', userRouter)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server listening on port ${port}`))
