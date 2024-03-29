/* eslint-disable camelcase */
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const { findByEmail, createUser, updateUser, changePasswordUser, detailUser  } = require('../models/authUsers')
const commonHelper = require('../helper/common')
const authHelper = require('../helper/auth')
const cloudinary = require('../helper/cloudinary')

const register = async (req, res, next) => {
  try {
    const { name, email, phonenumber, password } = req.body
    const { rowCount } = await findByEmail(email)

    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(password, salt)

    if (rowCount) {
      return next(createError(403, 'user sudah terdaftar'))
    }
    const data = {
      idUser: uuidv4(),
      name,
      email,
      phonenumber,
      password: passwordHash,
      role: 'user'
    }
    await createUser(data)
    commonHelper.response(res, null, 201, 'User berhasil register')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const {
      rows: [user]
    } = await findByEmail(email)
    console.log(user)

    if (!user) {
      return commonHelper.response(
        res,
        null,
        403,
        'email atau password anda salah'
      )
    }

    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return commonHelper.response(
        res,
        null,
        403,
        'email atau password anda salah'
      )
    }
    delete user.password

    const payload = {
      name: user.name,
      email: user.email
    }

    user.token = authHelper.generateToken(payload)
    user.refreshToken = authHelper.generateRefreshToken(payload)
    // res.cookie('token', user.token, {
    //   httpOnly: true,
    //   maxAge: 60*1000*60*12,
    //   secure: process.env.NODE_ENV !== 'Development' ? true : false,
    //   path: '/',
    //   sameSite: 'strict'
    // })
    return commonHelper.response(res, user, 201, 'anda berhasil login')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}

const refreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken
  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT2)
  const payload = {
    email: decoded.email,
    role: decoded.role
  }
  const result = {
    token: authHelper.generateToken(payload),
    refreshToken: authHelper.generateRefreshToken(payload)
  }
  commonHelper.response(res, result, 200)
}

const updateProfile = async (req, res, next) => {
  try {
    const idUser = req.params.idUser
    const { name, email, phonenumber } = req.body
    const updated_at = new Date()
    const images = req.file.path
    const ress = await cloudinary.uploader.upload(images)
    const data = {
      idUser,
      name,
      email,
      phonenumber,
      image: ress.url,
      updated_at
    }
    await updateUser(data)
    commonHelper.response(res, data, 201, 'update user success')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}

const profile = async (req, res, next) => {
  const email = req.decoded.email
  const { rows: [user] } = await findByEmail(email)
  delete user.password
  commonHelper.response(res, user, 200, 'get data sucess')
}
const changePassword = (req, res, next) => {
  changePasswordUser(req.body)
    .then(() => {
      res.json({
        message: 'password berhasil diganti'
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
const getDetailUser = async (req, res, next) => {
  try {
    const idUser = req.params.idUser
    const { rows: [user] } = await detailUser(idUser)

    commonHelper.response(res, user, 200, 'Get data from database')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}
module.exports = {
  register,
  login,
  refreshToken,
  updateProfile,
  profile,
  changePassword,
  getDetailUser
}