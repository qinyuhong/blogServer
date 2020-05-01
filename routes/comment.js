var express = require('express');
var router = express.Router();
const query = require('../db/index')

// 发表评论接口
router.post('/public', async (req, res, next) => {
  const {article_id,content}=req.body
  let {username}=req.user
  try {
    const Row = await query('select id,nickname,head_img from user where username=?', [username])
  
    let {id:user_id,nickname,head_img} = Row[0]
    let sql = 'insert into comment(user_id,article_id,cm_content,nickname,head_img,create_time) values(?,?,?,?,?,NOW())'
     await query(sql, [user_id,article_id,content,nickname,head_img])
    // console.log(result)
    res.send({
      code: 0,
      msg: '发表成功',
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
});

// 评论列表接口
router.get('/list', async (req, res, next) => {
    const {article_id}=req.query
    try {
      let sql = 'select nickname,head_img,cm_content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from comment where article_id=?'
       let result=await query(sql, [article_id])
      // console.log(result)
      res.send({
        code: 0,
        msg: '获取列表成功',
        data:result
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  });
module.exports = router;