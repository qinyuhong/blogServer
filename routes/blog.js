var express = require('express');
var router = express.Router();
const query = require('../db/index')
// 编辑添加博客接口
router.post('/add', async (req, res, next) => {
  let {
    title,
    content
  } = req.body
  let {
    username
  } = req.user
  try {
    let result = await query('select id from user where username=?', [username])
    // console.log(result)
    let user_id = result[0].id
    let result1 = await query('insert into article(title,content,user_id,create_time) values(?,?,?,NOW()) ', [title, content, user_id])
    res.send({
      code: 0,
      msg: '添加成功',
      data: result1
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
});

// 查询全部博客列表接口
router.get('/allList', async (req, res, next) => {
  try {
    let result = await query('select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article')
    // console.log(result)
    res.send({
      code: 0,
      msg: '查询成功',
      data: result
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
});
// 查询我的博客列表接口
router.get('/myList', async (req, res, next) => {
  let {username}=req.user
  try {
    const Row = await query('select id from user where username=?', [username])
    let user_id = Row[0].id
    // console.log(id)
    let sql = 'select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article where user_id=?'
    let result = await query(sql, [user_id])
    // console.log(result)
    res.send({
      code: 0,
      msg: '查询个人列表成功',
      data: result
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
});

// 查询博客详情接口
router.get('/detail', async (req, res, next) => {
  console.log(req.query)
  let article_id=req.query.article_id
  try {
    
    let sql = 'select title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article where id=?'
    let result = await query(sql, [article_id])
    // console.log(result)
    res.send({
      code: 0,
      msg: '查询博客详情列表成功',
      data: result[0]
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
});

// 更新博客详情接口
router.post('/update', async (req, res, next) => {
  const {article_id,title,content}=req.body
  let {username}=req.user
  try {
    const Row = await query('select id from user where username=?', [username])
    let user_id = Row[0].id
    let sql = 'update article set title=?,content=? where id=? and user_id=?'
    let result = await query(sql, [title,content,article_id,user_id])
    // console.log(result)
    res.send({
      code: 0,
      msg: '更新成功'
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
});
// 删除博客接口
router.post('/delete', async (req, res, next) => {
  const {article_id}=req.body
  let {username}=req.user
  try {
    const Row = await query('select id from user where username=?', [username])
    let user_id = Row[0].id
    let sql = 'delete from article where id=? and user_id=?'
    let result = await query(sql, [article_id,user_id])
    // console.log(result)
    res.send({
      code: 0,
      msg: '删除成功',
  
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
});
module.exports = router;