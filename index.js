require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send(`<h1>Hello World</h1>`);
})

app.listen(port, () => {
  console.log("Server starting")
})