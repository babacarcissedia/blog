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


function slugify (title) {
    return title.toLowerCase().split(' ').join('-')
}

const verifyToken = require('./verify_token')


router.post('/', async function(req,res){

    // title et content are required
    // si le slug n'est pas renseigné  alors on lui fournit: slug=slugify(title)
    // data validation
    var errors = {}
    if (!req.body.title) {
        errors['title'] = 'title field is required.'
    }
    if (!req.body.content) {
        errors['content'] = 'content field is required.'
    }
    var slug = null
    if (!req.body.slug) {
        slug = slugify(req.body.title)
    } else {
        slug = req.body.slug
    }
    if (!slug.match(/^[a-zA-Z0-9-]+$/)) {
        errors['slug'] = "Slug must be only alphanumeric characters with -"
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
var user_id=null
var user=null
try {
  var results= await db.query('select * from users where token = ?',[token])
  user=results[0]
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
// recuperation de l'utilisateur
user_id=user.id
var params = [req.body.title, slug, req.body.content,user_id]
db.query('INSERT INTO posts (title, slug, content,user_id) values (?, ?, ?,?)', params)
  .then(results => {
     res.json({
       type:TYPE_SUCCESS,
       message:'',
       data: {
         id: results.insertId,
         title: req.body.title,
         slug: slug,
         content: req.body.content,
         user_id:user_id
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

router.get('/', verifyToken, function (req, res) {
    db.query('SELECT * FROM posts', [])
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
                message: 'Error while querying posts from DB. ' + error.message,
                data: error
            })
        })
})


router.get('/:slug([a-zA-Z0-9-]+)-:id([0-9]+)', function (req, res) {
    db.query('SELECT * FROM posts where id = ?', [req.params.id])
         .then(results => {
            if(results.length == 0) {
                res.status(404)
                      .json ({
                        type: TYPE_ERROR,
                        message: 'No post with id:' + req.params.id,
                        data: {}
                    })
                return false;
            }
            var post = results[0]
            if(req.params.slug != post.slug)  {
                res.status(301)
                    .redirect(`/post/${post.slug}-${post.id}`)        
                return false;
            }
            res.json ({
                type: TYPE_SUCCESS,
                message: '',
                data: post
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

router.put('/:id', async function (req,res) {
    var token = req.headers.kouna
    var user_id = null
    var user = null
    var post = null

    // validation
    var errors={}
    var slug=null
    if(!req.body.title)
      {
         errors['title']='title field is required'
     }
     if (!req.body.slug) {
        slug = slugify(req.body.title)
    } else {
        slug = req.body.slug
    }
    if(!req.body.content) {
        errors['content']='content field is required'
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
        var results = await db.query('SELECT * FROM posts where id = ?', [req.params.id])
        post = results[0]
        if (!post)  {
            res.status(404)
                .json ({
                    type: TYPE_ERROR,  
                    message: 'No post with id:'+ req.params.id,
                    data: {}
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
    if (post.user_id != user.id) {
        res.status(403)
            .json ({
                type:TYPE_ERROR,
                message:'Not authorized',
                data:{}
            })
        return false
    }    
    let params = [req.body.title, slug, req.body.content, req.params.id, user.id];
    db.query('UPDATE posts set title = ?, slug= ?, content = ? where id = ? and user_id = ?', params)
        .then(results => {
            res.json ({
                type:TYPE_SUCCESS,
                message:'',
                data: {
                    id: req.params.id,
                    title: req.body.title,
                    slug:slug,
                    content: req.body.content,
                    user_id: user.id
                }
            })
            })
        .catch(error => {
            res.status(400)
                .json ({
                    type:TYPE_ERROR,
                    message:'Error while updating post with id :'+req.params.id,
                    data:error
                })
        })
})

router.delete('/:id',async function(req,res){
    var token = req.headers.kouna
    var user = null
    var post = null

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
        var results = await db.query('SELECT * FROM posts where id = ?', [req.params.id])
        post=results[0]
        if (!post) {
            res.status(404)
                .json({
                    type: TYPE_ERROR,
                    message: 'No post with id: ' + req.params.id,
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
    if (post.user_id != user.id) {
        res.status(403)
            .json ({
                type:TYPE_ERROR,
                message:'Not authorized',
                data:{}
            })
        return false
    }
    let params = [req.params.id];
    db.query('DELETE FROM posts where id=?', params)
        .then(results => {
            res.json({
                type:TYPE_SUCCESS,
                message:'Post with id ' + req.params.id + ' deleted.',
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