const jwt=require('jsonwebtoken')

const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDdmMzE2NTcwZjJiZDA2ZDVlNzE1ZmEiLCJ1c2VyTmFtZSI6InNhdGlzaCIsImNyZWF0ZWRBdCI6MTU2ODYyOTk3MzMzMSwiaWF0IjoxNTY4NjI5OTczfQ.gs0FB0QHY4TYmArUUE6YrcES9YIoob7N2aZRsrXtPnA'

console.log(jwt.verify(token,'jwt@123'))

//iat is token created at