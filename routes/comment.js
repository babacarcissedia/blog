// mysql
var sha1 = require('sha1');
var Database = require('../src/database/db')
var db = new Database({
  host     : 'localhost',
    user     : 'blog',
    password : 'blog',
    database : 'blog_db'
})

const express=require('express')
const router=express.Router()
const TYPE_ERROR = 'error'
const TYPE_SUCCESS = 'success'
const verifyToken = require('../src/routes/verify_token')

router.get('/', verifyToken, function (req, res) {
    db.query('SELECT * FROM comments', [])
        .then(results => {
            res.json ({
                type: TYPE_SUCCESS,
                message: '',
                data: results
            })
        })
        .catch(error => {
            res.json({
                type: TYPE_ERROR,
                message: 'Error while querying comments from DB. ' + error.message,
                data: error
            })
        })
})
router.get('/:id', function (req, res) {
    db.query('SELECT * FROM comments where id = ?', [req.params.id])
         .then(results => {
            if(results.length == 0) {
                res.status(404)
                      .json ({
                        type: TYPE_ERROR,
                        message: 'No comment with id:' + req.params.id,
                        data: {}
                    })
                return false;
            }
            res.json ({
                type: TYPE_SUCCESS,
                message: '',
                data: results[0]
            }) 
    })
         .catch(error => {
           res.status(400)
               .json ({
                    type: TYPE_ERROR,
                    message: 'Error while querying posts from DB.',
                    data: error
            })
    })
})

router.post('/', async function(req,res){
    var errors = {}
    if (!req.body.content) {
        errors['content'] = 'content field is required.'
    }
    if (!req.body.created_at) {
        errors['created_at'] = 'created_at field is required.'
    }
    
    if (Object.keys(errors).length != 0) {
        res.status(422)
            .json ({
                type: TYPE_ERROR,
                message: errors[Object.keys(errors)[0]],
                data: errors
            })
        return false
    }   
var token=req.headers.kouna
var id=req.headers.babacar
var user_id=null
var user=null
var post=null
try {
  var results= await db.query('select * from users where token = ?',[token])
  user = results[0]
  console.log(results[0])
  if(!user) {
     res.status(404)
        .json ({
           type:TYPE_ERROR,
           message:'No user with id',
           data:{}
         })
          return false
     }

}catch (error) {
  res.status(400)
     .json ({
        type:TYPE_ERROR,
        message:'Error while quering user from DB'+error.message,
        data:error.message
    })
  return false
}
try {
    var result= await db.query('select * from posts where id = ?',[id])
    post=result[0]
    if(!post) {
       res.status(404)
          .json ({
             type:TYPE_ERROR,
             message:'No post with id',
             data:{}
           })
            return false
       }
  }catch (error) {
    res.status(400)
       .json ({
          type:TYPE_ERROR,
          message:'Error while quering post from DB'+error.message,
          data:error.message
      })
  }
// recuperation du post
var params = [req.body.content,req.body.created_at,user.id,post.id]
db.query('INSERT INTO comments (content,created_at,user_id,post_id) values (?, ?,?,?)', params)
  .then(results => {
     res.json({
       type:TYPE_SUCCESS,
       message:'',
       data: {
         id: results.insertId,
         content: req.body.content,
         created_at:req.body.created_at,
         user_id:user.id,
         post_id:post.id
      }
   })    
})
  .catch(error => {
   res.status(400)
       .json({
         type:TYPE_ERROR,
         message:'Error while inserting from DB',
         data:errors
                })  
        })   
})
router.put('/:id', async function (req,res) {
    var token = req.headers.kouna
    var id = req.headers.babacar
    var user = null
    var post = null
    var com = null

    // validation
    var errors={}
    if (!req.body.content) {
        errors['content'] = 'content field is required.'
    }
    if (!req.body.created_at) {
        errors['created_at'] = 'created_at field is required.'
    }
    
    if (Object.keys(errors).length != 0) {
        res.status(422)
            .json ({
                type: TYPE_ERROR,
                message: errors[Object.keys(errors)[0]],
                data: errors
            })
        return false
    }   
    try {
        var result= await db.query('select * from users where token = ?',[token])
        user = result[0]
        if (!user) {
            res.status(401)
                .json ({
                    type:TYPE_ERROR,
                    message:'No user with id',
                    data:{}
            })
            return false
          } 
      }
    catch (error) {
            res.status(400)
                .json ({
                    type:TYPE_ERROR,
                    message:'Error while quering user from DB'+error.message,
                    data:error.message
                })
            return false
    }

    try {
        var results = await db.query('select * from posts where id = ?',[id])
        post = results[0]
        if (!post) {
            res.status(401)
                .json ({
                    type:TYPE_ERROR,
                    message:'No post with id',
                    data:{}
            })
            return false
          } 
      }
    catch (error) {
            res.status(400)
                .json ({
                    type:TYPE_ERROR,
                    message:'Error while quering post from DB'+error.message,
                    data:error.message
                })
            return false
    }
    try {   
        var results = await db.query('SELECT * FROM comments where id = ?', [req.params.id])
        com = results[0]
        if (!com)  {
            res.status(404)
                .json ({
                    type: TYPE_ERROR,  
                    message: 'No comment with id:'+ req.params.id,
                    data: {}
                })
            return false
        }
    } 
    catch (error) {
        res.status(400)
            .json ({
                type:TYPE_ERROR,
                message:'Error while quering comment from DB'+error.message,
                data:error.message
            })
        return false
    }
    if (com.user_id != user.id) {
        res.status(403)
            .json ({
                type:TYPE_ERROR,
                message:'Not authorized',
                data:{}
            })
        return false
    }    
    let params = [req.body.content, req.body.created_at, post.user_id, req.params.id, user.id];
    db.query('UPDATE comments set content = ?, created_at = ?, post_id = ? where id = ? and user_id = ?', params)
        .then(results => {
            res.json ({
                type:TYPE_SUCCESS,
                message:'',
                data: {
                    id: req.params.id,
                    content: req.body.content,
                    created_at:req.body.created_at,
                    user_id: user.id,
                    post_id: post.user_id
                }
            })
            })
        .catch(error => {
            res.status(400)
                .json ({
                    type:TYPE_ERROR,
                    message:'Error while updating comment with id :'+req.params.id,
                    data:error
                })
        })
})
router.delete('/:id',async function(req,res){
    var token = req.headers.kouna
    var user = null
    var post = null
    var com=null
    try {
        var result= await db.query('select * from users where token = ?',[token])
        user = result[0]
        if (!user) {
            res.status(401)
                .json ({
                    type:TYPE_ERROR,
                    message:'No user with id',
                    data:{}
            })
            return false
          } 
      }
    catch (error) {
            res.status(400)
                .json ({
                    type:TYPE_ERROR,
                    message:'Error while quering user from DB'+ error.message,
                    data:error.message
                })
            return false
    }
    try {
        var results = await db.query('SELECT * FROM comments where id = ?', [req.params.id])
        com = results[0]
        if (!com) {
            res.status(404)
                .json({
                    type: TYPE_ERROR,
                    message: 'No comment with id: ' + req.params.id,
                    data: {}
                })
            return false
        }
    } catch (error) {
        res.status(400)
            .json({
                type: TYPE_ERROR,
                message: error.message,
                data: {}
            })
        return false
    }
    if (com.user_id != user.id) {
        res.status(403)
            .json ({
                type:TYPE_ERROR,
                message:'Not authorized',
                data:{}
            })
        return false
    }
    let params = [req.params.id];
    db.query('DELETE FROM comments where id=?', params)
        .then(results => {
            res.json({
                type:TYPE_SUCCESS,
                message:'Comment with id ' + req.params.id + ' deleted.',
                data: {}
            })
        })
        .catch(error => {
            res.status(400)
                .json({
                    type:TYPE_ERROR,
                    message:'Error while deleting post with id :'+req.params.id + error.message,
                    data:error
                })
        })
})


module.exports=router 