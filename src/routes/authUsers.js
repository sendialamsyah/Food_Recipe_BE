const express = require('express')
const router = express.Router()
// const upload = require('../middlewares/uploadFile')
const { register, login, refreshToken, updateProfile, changePassword } = require('../controller/authUsers')

router
//   .get('/profil', protect, getProfil)
  .post('/register', register)
  .post('/login', login)
  .post('/refresh-token', refreshToken)
  .put('/:idUser', updateProfile)
  .post('/change-password', changePassword)

module.exports = router
