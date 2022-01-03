const express = require('express')
const connectDB = require("./db/mongoose")
const app = express()
// const users = require("./routes/users.route");

connectDB()

const port = process.env.PORT || 5001

app.use(express.json())

app.use(users)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})