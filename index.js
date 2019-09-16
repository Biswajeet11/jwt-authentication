const express = require('express')
const app = express()
const { mongoose } = require('./config/db')
const { routes } = require('./config/routes')
const {userRouter}=require('./app/controllers/UserController')
const port = 3010

app.use(express.json())
app.use('/users', userRouter)

app.listen(port, () => {
	console.log('listeing on port', port)
})