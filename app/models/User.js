const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcrypt')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema

const userSchema = new Schema({
	userName: {
		type: String,
		minlength: 3,
		required: true,
		validate: {
			validator: function (value) {
				return value.length >= 3
			},
			msg: function () {
				return 'Name has less than 3 characters'
			}
		}
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function (email) {
				return validator.isEmail(email)
			},
			msg: function () {
				return 'invalid email'
			}
		},
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		maxlength: 128,
		validate: {
			validator: function (password) {
				return password.length >= 8
			},
			msg: function () {
				return 'password is less than 8 characters'
			}
		}
	},
	tokens: [
		{
			token: {
				type: String
			},
			createdAt: {
				type: Date,
				default: Date.now()
			}
		}
	]
})

userSchema.pre('save', function (next) { // when saved data and updating the data
	const user = this
	if (user.isNew) {
		bcryptjs.genSalt(10)
			.then((salt) => {
				console.log(salt)
				bcryptjs.hash(user.password, salt)
					.then((bcryptedPassword) => {
						user.password = bcryptedPassword
						next()
					})
			})
	}
	else {
		next()
	}
})

//static method
userSchema.statics.findByCredentials = function (email, password) {
	const User = this
	return User.findOne({ email })
		.then(function (user) {
			if (!user) {
				return Promise.reject('invalid email')
			}
			return bcryptjs.compare(password, user.password)
				.then(function (result) {
					if (result) {
						return Promise.resolve(user)
					}
					else {
						return Promise.reject('invalid password')
					}
				})
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

// instance method 
userSchema.methods.generateToken = function () {
	const user = this
	const tokenData = {
		_id: user._id,
		userName: user.userName,
		createdAt: Number(new Date)
	}
	const token = jwt.sign(tokenData, 'jwt@123')
	user.tokens.push({ token })

	return user.save()
		.then(function (user) {
			return Promise.resolve(token)
		})
		.catch(function (err) {
			return Promise.reject(err)
		})
}

// static method
userSchema.statics.findByToken = function (token) {
	const User = this
	let tokenData
	try {
		tokenData = jwt.verify(token, 'jwt@123')
	}
	catch (err) {
		return Promise.reject(err)
	}
	return User.findOne({
		_id: tokenData._id,
		'tokens.token': token
	})
}

const User = mongoose.model('User', userSchema)
module.exports = { User }