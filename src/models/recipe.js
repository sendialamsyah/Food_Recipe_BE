/* eslint-disable camelcase */
const pool = require('../config/db')

const selectRecipe = ({ limit, offset, sortby, sort, search }) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM recipe WHERE title ILIKE'%${search}%' ORDER BY ${sortby} ${sort} LIMIT $1 OFFSET $2`, [limit, offset], (err, result) => {
      if (!err) {
        resolve(result.rows)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const selectRecipeById = (idrecipe) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM recipe WHERE idrecipe = $1', [idrecipe], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const insert = ({ title, ingredients , image, video }) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO recipe(title, ingredients, image, video)VALUES($1, $2, $3, $4)', [title, ingredients , image, video], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const update = ({ title, ingredients , image, video, idRecipe }) => {
  return new Promise((resolve, reject) => {
    pool.query('UPDATE recipe SET title = COALESCE($1, title), ingredients = COALESCE($2, ingredients), image = COALESCE($3, image), video = COALESCE($4, video) WHERE idRecipe = $5', [title, ingredients , image, video, idRecipe], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const deleteData = (idRecipe) => {
  return new Promise((resolve, reject) => {
    pool.query('DELETE FROM recipe WHERE idRecipe = $1', [idRecipe], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}
const countRecipe = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT COUNT(*) AS total FROM recipe', (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

module.exports = {
  selectRecipe,
  selectRecipeById,
  insert,
  update,
  deleteData,
  countRecipe
}
