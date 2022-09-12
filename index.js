require('dotenv').config()
const express = require('express')
const createError = require('http-errors')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const userRouter = require('./src/routes/users')
const productsRouter = require('./src/routes/products')
const categoryRouter = require('./src/routes/category')
const transaksiRouter = require('./src/routes/transaksi')
const paymentRouter = require('./src/routes/payment');
const transaksi_detailRouter = require('./src/routes/transaksi_detail')

app.use(express.json())
app.use(cors())
// app.use(helmet())
app.use(morgan('dev'))

app.use('/users', userRouter )
app.use('/products', productsRouter)
app.use('/category', categoryRouter)
app.use('/transaksi', transaksiRouter)
app.use('/payment', paymentRouter)
app.use('/transaksi_detail', transaksi_detailRouter)

app.use('/img', express.static('./src/upload'))


app.all('*', (req, res, next) => {
  next(new createError.NotFound())
})
app.use((err,req,res,next)=>{
  const messageError = err.message || "internal server error"
  const statusCode = err.status || 500
  
  res.status(statusCode).json({
    message : messageError
  })
  
})


const PORT = process.env.PORT || 5000
const DB_HOST = process.env.DB_HOST
app.listen(PORT, () => {
  console.log(`server running on http://${DB_HOST}:${PORT}`)
})
