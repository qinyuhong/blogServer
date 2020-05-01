var express = require('express');
var router = express.Router();
const query = require('../db/index')
const {
  PWD_SALT,
  PRIVATE_KEY,
  EXPIRATION_TIME
} = require('../utils/base')
const {
  md5,upload
} = require('../utils/index')
const jwt = require('jsonwebtoken')



/* POST users Register. */
router.post('/register', async (req, res, next) => {
  let {
    username,
    password,
    nickname
  } = req.body
  try {
    const user = await query('select * from user where username= ?', [username])
    if (!user || user.length == 0) {
      console.log(user)
      password = md5(`${password}${PWD_SALT}`)
      console.log(password)
      await query('insert into user(username,password,nickname) value(?,?,?)', [username, password, nickname])
      res.send({
        code: 1,
        msg: "注册成功"
      })
    } else {
      res.send({
        code: -1,
        msg: '该用户已被注册'
      })
    }
  } catch (error) {
      console.log(error)
      next(error)
  }
});

/* POST users Login. */
router.post('/login', async (req, res, next) => {
  let {
    username,
    password
  } = req.body
  try {
    const user = await query('select * from user where username= ?', [username])
    if (!user || user.length == 0) {
      res.send({
        code: -1,
        msg: '用户名不存在'
      })
    } else {
      password = md5(`${password}${PWD_SALT}`)
      let result = await query('select * from user where username= ? and password= ?', [username, password])
      if (!result || result.length == 0) {
        res.send({
          code: -1,
          msg: '用户名或者密码错误'
        })
      } else {
        let token = jwt.sign({
          username
        }, PRIVATE_KEY, {
          expiresIn: EXPIRATION_TIME
        })
        res.send({
          code: 0,
          msg: '登录成功',
          token: token
        })
      }
    }

  } catch (error) {
      console.log(error)
      next(error)
  }
});

// 用户信息接口
router.get('/info', async (req, res, next) => {
  try {
    // console.log(req.user)
    const {username}=req.user
   let result= await query('select nickname,head_img from user where username= ? ', [username])
  //  console.log(res)
    res.send({code:0,msg:'成功',data:result[0]})
  } catch (error) {
    console.log(error)
    next(error)
  }
});

// 头像上传接口
router.post('/avatar',  upload.single('head_img'),async (req, res, next) => {
  try {
    console.log(req.file)
    let imgPath = req.file.path.split('public')[1]
    let imgUrl = 'http://127.0.0.1:3000'+imgPath
    res.send({code:0,msg:'上传成功',data:imgUrl})
  } catch (error) {
    console.log(error)
    next(error)
  }
});

// 用户信息更新接口
router.post('/updataUser', async (req, res, next) => {
  let {nickname,head_img}=req.body
  let {username}=req.user
  try {
    // console.log(req.user)
   let result= await query('update user set nickname= ?,head_img= ? where username= ?', [nickname,head_img,username])
    console.log(result)
    res.send({code:0,msg:'更新成功'})
  } catch (error) {
    console.log(error)
    next(error)
  }
});
module.exports = router;