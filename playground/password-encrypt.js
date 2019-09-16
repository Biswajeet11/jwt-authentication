const bcryptjs=require('bcrypt')

const password='secret123'

bcryptjs.genSalt(10)
.then(function(salt){
	console.log(salt)
	bcryptjs.hash(password,salt)
	.then(function(encryptedpassword){
		console.log(encryptedpassword)
	})
})