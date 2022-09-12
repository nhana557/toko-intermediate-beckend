const express = require('express')
const router = express.Router()
const { register, login, profile, refreshToken, selectAll } = require('../controller/users')
const {protect, roles} = require('../middlewares/auth')


router
.post('/register',register)
.post('/login',login)
.post('/refersh-token', refreshToken)
.get('/profile',protect, profile)
.get('/', selectAll)


module.exports = router