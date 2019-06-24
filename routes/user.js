// mysql
var sha1 = require('sha1');
//var verifytoken=require('../routes/verify_token')
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


//router.use(verifytoken)

router.get('/',verifyToken, function (req, res) {
    db.query('SELECT * FROM users', [])
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
                message: 'Error while querying users from DB. ' + error.message,
                data: error
            })
        })
})
  

router.get('/:id',verifyToken,function (req, res) {
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


router.post('/', async function(req,res){
    // validation
    var errors = {}
    // - email is required
    if (!req.body.email) {
        errors['email'] = 'Email field is required.'
    } else {
        // - email is email
        var emailRegex =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!req.body.email.match(emailRegex)) {
            errors['email'] = req.body.email + ' is not a valid email.'
        } else {
            try {
                var results = await db.query("SELECT id FROM users WHERE email = ?", [req.body.email])
                if (results.length > 0) {
                    errors['email'] = "User with email:"+ req.body.email + " is already registred."
                }
            } catch (error) {
                res.status(400).json({
                    type: TYPE_ERROR,
                    message: 'Error while checking email uniqueness: ' + error.message,
                    data: error
                })
            }
        }   
    }
    // - password is required
    if (!req.body.password) {
        errors['password'] = 'Password field is required.'
    }
    // - password_confirmation is required
    if (!req.body.password_confirmation) {
        errors['password_confirmation'] = 'Password confirmation field is required.'
    }
    // - password == password_confirmation
    if (req.body.password != req.body.password_confirmation) {
        errors['password'] = 'Password does not match password confirmation'
    }

    if (Object.keys(errors).length != 0) {
        res.status(422).json({
            type: TYPE_ERROR,
            message: errors[Object.keys(errors)[0]],
            data: errors
        })
        return false;
    }
    var hashedPassword = sha1(req.body.password)
    let params=[req.body.first_name,req.body.last_name,req.body.email, hashedPassword,req.body.token];
    db.query('INSERT INTO users (first_name, last_name, email, password,token) values(?,?,?,?,?)',params)
        .then(results => {
        res.json({
            type:TYPE_SUCCESS,
            message:'',
            data: {
                id: results.insertId,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                token:req.body.token
            }
        })

        })
        .catch(error => {
        res.status(400).json({
            type:TYPE_ERROR,
            message:'Error while inserting user' + error.message,
            data:error

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

router.post('/login', async (req,res)=> {
    // data validation
    var errors = {}
    if (!req.body.email) {
        errors['email'] = 'Email field is required.'
    }
    if (!req.body.password) {
        errors['password'] = 'Password field is required.'
    }
    if (Object.keys(errors).length != 0) {
        res.status(422)
            .json({
                type: TYPE_ERROR,
                message: errors[Object.keys(errors)],
                data: errors
            })
        return false
    }   

    // get auth user
    var user = null
    var params=[req.body.email, sha1(req.body.password)];
    try {    
        var results = await db.query("SELECT * FROM users WHERE email = ? AND password = ?", params)
        user = results[0]
    } catch (error) {
        res.status(400)
            .json({
                type:TYPE_ERROR,
                message:'Error while login user '+errors.message,
                data:error
            })
        return false
    }

    if (!user) {
        res.status(400)
        .json({
            type: TYPE_ERROR,
            message: "Email and password do not match any account",
            data:errors
        }) 
        return false
    }
    
    // here user is logged in
    // TODO: generate user token 
    user.token = sha1(Math.random() * 1000000000)
        
    // save token
    try {
        await db.query("UPDATE users SET token = ? WHERE id = ? LIMIT 1", [user.token, user.id])
    } catch (error) {
        res.status(400)
            .json({
                type: TYPE_ERROR,
                message: 'Error while saving user token',
                data: error
            })
        return false
    }

    res.json({
        type: TYPE_SUCCESS,
        message: '',
        data: user
    })
})
module.exports=router