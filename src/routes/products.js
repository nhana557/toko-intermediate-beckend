
const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const { getAllProduct, getProduct, insertProduct, updateProduct, deleteProduct, searching } = require('../controller/products')
const { protect, roles } = require('../middlewares/auth')
const { cacheProduct, clearCacheProductDetail } = require('../middlewares/redis')

router
  .get('/cari', searching)
  .get('/', getAllProduct)
  .get('/:id', cacheProduct, getProduct)
  .post('/', upload.single('photo'), insertProduct)
  .put('/:id', clearCacheProductDetail, upload.single('photo'), updateProduct)
  .delete('/:id', clearCacheProductDetail, deleteProduct)

module.exports = router
