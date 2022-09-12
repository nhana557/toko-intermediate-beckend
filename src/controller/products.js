const createError = require('http-errors')
const {selectAll, select, countData, findId, insert, update, deleteData, searching} = require('../models/products')
const commonHelper = require('../helper/common')
const client = require('../config/redis')



const productController = {
  getAllProduct: async(req, res) => {
    try{
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 20;
      const offset = (page - 1) * limit
      const sortby = req.query.sortby || 'name'
      const sort = req.query.sort || "ASC"
      const {rows: [count]} = await countData()
      const search = req.query.search;
      let querySearch = '';
      if (search) {
          querySearch =  `where name ILIKE '%${search}%'` ;
      }
      // const cari = querySearch.toLowerCase();

      const result = await selectAll({
        limit,
        offset,
        sort,
        sortby,
        querySearch
      
      })
      const totalData = parseInt(count.count)
      const totalPage = Math.ceil(totalData/limit)
      const pagination ={     
            currentPage : page,
            limit:limit,
            totalData:totalData,
            totalPage:totalPage
          }
          commonHelper.response(res, result.rows, 200, "get data success", pagination)
    }catch(error){
      console.log(error);
    }
  },
  searching: (req, res)=>{
    const search = req.query.search ||"";
        searching(search)
        .then(result => res.json(result.rows))
        .catch(err => res.send(err));
  },
  getProduct: (req, res) => {
    const id = Number(req.params.id)
    select(id)
      .then(
        result => {
        client.setEx(`product/${id}`, 60 * 60,JSON.stringify(result.rows))
        commonHelper.response(res, result.rows, 200, "get data success from database")
        }
      )
      .catch(err => res.send(err)
      )
  },
  insertProduct: async(req, res) => {
    const PORT = process.env.PORT || 8080
    const DB_HOST = process.env.DB_HOST || 'localhost'
    const photo = req.file.filename;
    const { name, stock, price, merk, description, category_id, transaksi_id} = req.body
    const {rows: [count]} = await countData()
    const id = Number(count.count) + 1;

    const data ={
      id,
      name,
      description,
      stock,
      price,
      merk,
      category_id,
      transaksi_id,
      photo:`http://${DB_HOST}:${PORT}/img/${photo}`
    }
    insert(data)
      .then(
        result => commonHelper.response(res, result.rows, 201, "Product created")
      )
      .catch(err => res.send(err)
      )
  },
  updateProduct: async(req, res) => {
    try{
      const PORT = process.env.PORT || 5000
      const DB_HOST = process.env.DB_HOST || 'localhost'
      const id = Number(req.params.id)
      const photo = req.file.filename;
      const { name, stock, price, category_id, merk, transaksi_id, description } = req.body
      const {rowCount} = await findId(id)
      if(!rowCount){
        return next(createError(403,"ID is Not Found"))
      }
      const data ={
        id,
        name,
        description,
        stock,
        price,
        merk,
        category_id,
        transaksi_id,
        photo:`http://${DB_HOST}:${PORT}/img/${photo}`
      }
      update(data)
        .then(
          result => commonHelper.response(res, result.rows, 200, "Product updated")
          )
          .catch(err => res.send(err)
          )
        }catch(error){
          console.log(error);
        }
  },
  deleteProduct: async(req, res, next) => {
    try{
      const id = Number(req.params.id)
      const {rowCount} = await findId(id)
      if(!rowCount){
        return next(createError(403,"ID is Not Found"))
      }
      deleteData(id)
        .then(
          result => commonHelper.response(res, result.rows, 200, "Product deleted")
        )
        .catch(err => res.send(err)
        )
    }catch(error){
        console.log(error);
    }
  }
}

module.exports = productController
