const express = require('express')
const router = express.Router()
const { User } = require('../models/User')
const { authenticateUser } = require('../middlewares/authenticate')

//register
router.post('/register', function (req, res) {
	const body = req.body
	console.log(body)
	const user = new User(body)
	user.save()
		.then(function (user) {
			res.send(user)
		})
		.catch(err => {
			res.send(err)
		})
})

//login
router.post('/login', function (req, res) {
	const body = req.body
	User.findByCredentials(body.email, body.password)
		.then(function (user) {
			console.log(`the user is ${user}`)
			return user.generateToken()
		})
		.then(function (token) {
			res.setHeader('x-auth', token)
			res.send(token)
		})
		.catch(err => res.send(err))
})

//account protected route
router.get('/account', authenticateUser, function (req, res) {
	const { user } = req
	res.send(user)
})

//logout
router.delete('/logout', authenticateUser, function (req, res) {
	const { user, token } = req
	User.findByIdAndUpdate(user._id, { $pull: { tokens: { token: token } } })
		.then(function () {
			res.send({ notice: 'logged out successfully' })
		})
		.catch(err => res.send(err))
})

module.exports = {
	userRouter: router
}