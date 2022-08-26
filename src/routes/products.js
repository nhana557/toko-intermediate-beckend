
const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const { getAllProduct, getProduct, insertProduct, updateProduct, deleteProduct, searching } = require('../controller/products')
const { protect, roles } = require('../middlewares/auth')
const { cacheProduct, clearCacheProductDetail } = require('../middlewares/redis')

router
  .get('/cari', protect, roles, searching)
  .get('/', protect, roles, getAllProduct)
  .get('/:id', protect, roles, cacheProduct, getProduct)
  .post('/',protect, roles,  upload.single('photo'), insertProduct)
  .put('/:id', protect, roles, clearCacheProductDetail, upload.single('photo'), updateProduct)
  .delete('/:id', protect, roles, clearCacheProductDetail, deleteProduct)

module.exports = router
