const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const {protect} = require('../middlewares/authUsers')
const { register, login, refreshToken, updateProfile, profile, changePassword } = require('../controller/authUsers')

router
//   .get('/profil', protect, getProfil)
  .post('/register', register)
  .post('/login', login)
  .post('/refresh-token', refreshToken)
  .put('/:idUser', upload.single('image'), updateProfile)
  .post('/change-password', changePassword)
  .get('/profile', protect, profile)

module.exports = router
