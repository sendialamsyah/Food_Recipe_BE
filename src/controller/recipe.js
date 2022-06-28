const createError = require('http-errors')
const {selectRecipe, selectRecipeById, insert, update, deleteData, countRecipe} = require('../models/recipe')
const errServ = new createError.InternalServerError()
const commonHelper = require('../helper/common')
const cloudinary = require('../helper/cloudinary')
const { url } = require('../helper/cloudinary')

const getRecipe = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5
    const page = parseInt(req.query.page) || 1
    const offset = (page - 1) * limit

    const sortby = req.query.sortby || 'idRecipe'
    const sort = req.query.sort || ''

    const search = req.query.search || ''

    const result = await selectRecipe({ limit, offset, sortby, sort, search })

    const { rows: [count] } = await countRecipe()
    const totalData = parseInt(count.total)
    const totalPage = Math.ceil(totalData / limit)

    const pagination = {
      currentPage: page,
      limit,
      totalData,
      totalPage,
      name: req.payload
    }

    commonHelper.response(res, result, 200, 'Get data success', pagination)
  } catch (error) {
    console.log(error)
    next(errServ)
  }
}

const detailRecipe = async (req, res, next) => {
  try {
    const idRecipe = req.params.idRecipe
    const { rows: [recipe] } = await selectRecipeById(idRecipe)
    // client.setEx(`product/${id}`, 60 * 60, JSON.stringify(product))

    commonHelper.response(res, recipe, 200, 'Get data from database')
  } catch (error) {
    console.log(error)
    next(errServ)
  }
}

const insertRecipe = async (req, res, next) => {
  try {
    const { title, ingredients } = req.body
    const img = req.files.image[0].path
    const ress = await cloudinary.uploader.upload(img)
    const data = {
      title,
      ingredients,
      image: ress.url,
      video: `http://${req.get('host')}/vid/${req.files.video[0].filename}`
    }
    await insert(data)

    commonHelper.response(res, data, 201, 'Insert data success')
  } catch (error) {
    console.log(error)
    next(errServ)
  }
}

const updateRecipe = async (req, res, next) => {
  try {
    const idRecipe = req.params.idRecipe
    const { title, ingredients } = req.body

    const img = req.files.image[0].path
      console.log(req.files)
      const ress = await cloudinary.uploader.upload(img)

    const data = {
      idRecipe,
      title,
      ingredients,
      image: ress.url,
      video: `http://${req.get('host')}/vid/${req.files.video[0].filename}`
    }
    await update(data)

    commonHelper.response(res, data, 200, 'Update data success')
  } catch (error) {
    console.log(error)
    next(errServ)
  }
}

const deleteRecipe = async (req, res, next) => {
  try {
    const idRecipe = req.params.idRecipe
    await deleteData(idRecipe)

    commonHelper.response(res, idRecipe, 200, 'Delete data success')
  } catch (error) {
    next(errServ)
  }
}
module.exports = {
  getRecipe,
  detailRecipe,
  insertRecipe,
  updateRecipe,
  deleteRecipe
}
