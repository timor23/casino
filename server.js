require('dotenv').config({path: './config.env'})
const express = require('express')
const connectDB = require("./config/db")
const app = express()
// const users = require("./routes/users.route");

connectDB()

const PORT = process.env.PORT || 5001

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))

// app.use(users)

app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})