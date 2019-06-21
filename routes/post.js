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

const verifyToken = require('./verify_token')
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
  

router.get('/:id', verifyToken, function (req, res) {
    db.query('SELECT * FROM users where id=?', [req.params.id])
        .then(results => {
            if(results.length == 0){
                res.status(404).json({
                    type: TYPE_ERROR,
                    message: 'No user with id:' + req.params.id ,
                    data: {}
                })
                return false;
            }
            res.json({
                type: TYPE_SUCCESS,
                message: '',
                data: results[0]
                }) 
        })
        .catch(error => {
            res.status(400).json({
                type: TYPE_ERROR,
                message: 'Error while querying users from DB. ' + error.message,
                data: error
            })
        })
})
          
  
router.put('/:id',verifyToken,async function(req,res){
    try {
        var results = await db.query('SELECT id FROM users where id = ?', [req.params.id])
        if (results.length == 0) {
            res.status(404)
                .json({
                    type: TYPE_ERROR,
                    message: 'No user with id: ' + req.params.id,
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
    let params=[req.body.first_name,req.body.last_name,req.body.email, req.params.id];
    db.query('UPDATE users set first_name = ?, last_name = ?, email = ? where id=?', params)
        .then(results => {
            res.json({
                type:TYPE_SUCCESS,
                message:'',
                data: {
                    id: req.params.id,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                }
            })
        })
        .catch(error => {
            res.status(400)
                .json({
                type:TYPE_ERROR,
                message:'Error while updating user with id :'+req.body.id + error.message,
                data:error

            })
        })
})

router.delete('/:id',verifyToken,async function(req,res){
    try {
        var results = await db.query('SELECT id FROM users where id = ?', [req.params.id])
        if (results.length == 0) {
            res.status(404)
                .json({
                    type: TYPE_ERROR,
                    message: 'No user with id: ' + req.params.id,
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
    let params=[req.params.id];
    db.query('DELETE FROM users where id=?', params)
        .then(results => {
            res.json({
                type:TYPE_SUCCESS,
                message:'User with id ' + req.params.id + ' deleted.',
                data: {}
            })
        })
        .catch(error => {
            res.status(400)
                .json({
                type:TYPE_ERROR,
                message:'Error while deleting user with id :'+req.params.id + error.message,
                data:error

            })
        })
})


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
    function slugify (title) {
        var parts = title.split(' ')
        return parts.join('-')
    }

    if (!req.body.slug) {
        slug = slugify(req.body.title)
    } else {
        slug = req.body.slug
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

module.exports=router 