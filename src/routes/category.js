const express = require('express')
const router = express.Router()
const categoryController = require('../controller/category')
const {protect, roles} = require('../middlewares/auth')


router
  .get('/cari', protect, roles, categoryController.searching)
  .get('/',protect, roles, categoryController.getAllCategory)
  .get('/:id',protect, roles, categoryController.getCategory)
  .post('/',protect, roles, categoryController.insertCategory)
  .put('/:id',protect, roles, categoryController.updateCategory)
  .delete('/:id',protect, roles, categoryController.deleteCategory)

module.exports = router
