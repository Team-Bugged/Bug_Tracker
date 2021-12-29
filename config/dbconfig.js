require('dotenv').config()

DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

module.exports = {
    secret: process.env.SECRET,
    database: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.t21du.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
}