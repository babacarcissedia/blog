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



router.post('/',function(req,res){

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
            .json({
                type: TYPE_ERROR,
                message: errors[Object.keys(errors)[0]],
                data: errors
            })
        return false
    }   

   var params = [req.body.title, slug, req.body.content]
   db.query('INSERT INTO posts (title, slug, content) values (?, ?, ?)', params)
        .then(results => {
            res.json({
                type:TYPE_SUCCESS,
                message:'',
                data: {
                    id: results.insertId,
                    title: req.body.title,
                    slug: slug,
                    content: req.body.content
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
            res.json({
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


router.get('/:slug([a-zA-Z0-9-]+)-:id([0-9]+)', verifyToken, function (req, res) {
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
             .json({
                type: TYPE_ERROR,
                message: 'Error while querying posts from DB.',
                data: error
            })
    })
})

router.put('/:id',verifyToken, async function(req,res){
    try {
        var results = await db.query('SELECT * FROM posts where id = ?', [req.params.id])
        if (results.length == 0) {
              res.status(404)
                 .json({
                    type: TYPE_ERROR,
                    message: 'No post with id:' + req.params.id,
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
  // post.slug = slugify(req.body.title)
    let params = [req.body.title,req.body.slug,req.body.content,req.params.id];
    db.query('UPDATE posts set title = ?, slug= ?, content = ? where id=?', params)
            .then(results => {
                res.json({
                    type:TYPE_SUCCESS,
                    message:'',
                    data: {
                        id: req.params.id,
                        title: req.body.title,
                        slug:req.body.slug,
                        content: req.body.content
                    }
                })
            })
            .catch(error => {
                res.status(400)
                    .json({
                    type:TYPE_ERROR,
                    message:'Error while updating post with id :'+req.params.id,
                    data:error

                })
            })
})

router.delete('/:id',verifyToken,async function(req,res){
    try {
        var results = await db.query('SELECT id FROM posts where id = ?', [req.params.id])
        if (results.length == 0) {
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