const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
      (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      }
    )
  })
}

const createUser = ({
  idUser,
  name,
  email,
  phonenumber,
  password,
  role
}) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO users(idUser, name, email, phonenumber, password, role)VALUES($1, $2, $3, $4, $5, $6)',
      [idUser, name, email, phonenumber, password, role],
      (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      }
    )
  })
}

const updateUser = ({
  name,
  email,
  phonenumber,
  image,
  updated_at,
  idUser
}) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), phonenumber = COALESCE($3, phonenumber), image = COALESCE($4, image), updated_at = COALESCE($5, updated_at) WHERE idUser = $6',
      [
        name,
        email,
        phonenumber,
        image,
        updated_at,
        idUser
      ],
      (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      }
    )
  })
}
const changePasswordUser = (body) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT email FROM users WHERE idUser = $1',
      [body.idUser],
      (err, result) => {
        if (!result.rows[0]) {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              reject(err)
            }
            const { password, email } = body
            bcrypt.hash(password, salt, (_err, hashedPassword) => {
              if (_err) {
                reject(_err)
              }
              pool.query(
                'UPDATE users SET password= $1 WHERE email = $2',
                [hashedPassword, email],
                (_err, result) => {
                  if (!_err) {
                    resolve({ msg: 'change password success' })
                  } else {
                    reject(_err)
                  }
                }
              )
            })
          })
        } else {
          reject(err)
        }
      }
    )
  })
}
module.exports = {
  findByEmail,
  createUser,
  updateUser,
  changePasswordUser
}