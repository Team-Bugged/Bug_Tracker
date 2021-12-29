const cors = require('cors');
const express = require('express')
const passport = require('passport');
const routes = require('./routes/routes')
const connectDB = require('./config/db');
require('dotenv').config()

const app = express()
const port = process.env.PORT
connectDB();
app.use(cors())
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())
app.use(routes)
app.use(passport.initialize())
require('./config/passport')(passport)

app.listen(port, console.log(`Server running in ${port}`))