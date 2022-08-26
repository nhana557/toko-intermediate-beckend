const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const {findEmail, create, selectAll} = require('../models/users')
const commonHelper = require('../helper/common');
const authHelper = require('../helper/auth');


const UserController ={
 register : async(req,res,next)=>{
    try{
      const {email,password,fullname} = req.body;
      const role = req.body.role || "buyer"
      const {rowCount} = await findEmail(email)
      const passwordHash = bcrypt.hashSync(password);
      const id = uuidv4()
      if(rowCount){
        return next(createError(403,"Email is already used"))
      }
      const data={
        id,
        email,
        passwordHash,
        fullname,
        role
      }
      create(data)      
      .then(
        result => commonHelper.response(res, result.rows, 201, "Success register")
      )
      .catch(err => res.send(err)
      )
    }catch(error){
      console.log(error);
    }
  },
 login :async(req,res,next)=>{
    try{
      const {email,password} = req.body
      const {rows : [user]} = await findEmail(email)
        if(!user){
          return commonHelper.response(res,null,403,'Email is invalid')
        }
        const isValidPassword = bcrypt.compareSync(password,user.password)
        console.log(isValidPassword);
    
        if(!isValidPassword){
          return commonHelper.response(res,null,403,'Password is invalid')
        }
        delete user.password
        const payload = {
          email: user.email,
          role : user.role
        }
        user.token = authHelper.generateToken(payload)
        user.refreshToken = authHelper.generateRefreshToken(payload)

        commonHelper.response(res,user,201,'login is successful')
    }catch(error){
      console.log(error);
    }
  },
  selectAll: (req, res, next) =>{
    selectAllUsers()
    .then(result =>
      commonHelper.response(res, result.rows, 200, "get data success"))
    .catch(err => res.send(err))
  },
 profile :async(req,res,next)=>{
  const email = req.payload.email
  const {rows:[user]} = await findEmail(email)
  delete user.password
  commonHelper.response(res,user,200)
 },
 refreshToken : (req,res)=>{
  const refreshToken = req.body.refreshToken
  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT)
  const payload ={
    email : decoded.email,
    role : decoded.role
  }
  const result ={
    token : authHelper.generateToken(payload),
    refreshToken : authHelper.generateRefreshToken(payload)
  }
  commonHelper.response(res,result,200)
}
}


module.exports = UserController