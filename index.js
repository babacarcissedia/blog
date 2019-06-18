// mysql
var mysql= require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'blog',
  password : 'blog',
  database : 'blog_db'
});

connection.connect();

// express
const express = require('express')
const app = express()
// middleware of express
var bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
  res.send('Hello World!!!')
})
const TYPE_ERROR = 'error'
const TYPE_SUCCESS = 'success'

app.get('/user', function (req, res) {
    connection.query('SELECT * FROM users', function (error, results, fields) {
        if (error)  {
            res.json({
                type: TYPE_ERROR,
                message: 'Error while querying users from DB. ' + error.message,
                data: error
            })
            return false;
        }
            res.json({
            type: TYPE_SUCCESS,
            message: '',
            data: results
        })
      });
  })


  app.get('/user/:id', function (req, res) {
    connection.query('SELECT * FROM users where id=?',req.param("id"),function (error, results, fields) {
        if (error)  {
            res.status(400).json({
                type: TYPE_ERROR,
                message: 'Error while querying users from DB. ' + error.message,
                data: error
            })
            return false;
        }
        if(results.length == 0){
            res.status(404).json({
                type: TYPE_ERROR,
                message: 'No user with id:' + req.param("id") ,
                data: {}
            })
            return false;
        }
        res.json({
           type: TYPE_SUCCESS,
           message: '',
           data: results[0]
        }) 
      });    
  })


  /*app.post('/user',function(req,res){
      let fields = ['first_name', 'last_name', 'email', 'password']
      let params = []
      fields.forEach(field => params[field] = req.body[field])
    connection.query('INSERT INTO users (first_name, last_name, email, password) values (:first_name, :last_name, :email, :password) ',
    function (error, results, fields) {
        if(error) {
            res.status(400).json({
                type: TYPE_ERROR,
                message: 'Error while querying user with id : ' + req.body.id + error.message,
                data: error
            });
            return false
        }
        res.json({
            type: TYPE_SUCCESS,
            message: '',
            data: results
        })
    })
  })*/

  app.post('/user',function(req,res){
      let params=[req.body.first_name,req.body.last_name,req.body.email,req.body.password];
      connection.query('INSERT INTO users (first_name, last_name, email, password) values(?,?,?,?)',params,function(error,results,fielsd){
              if(error){
                  res.status(400).json({
                      type:TYPE_ERROR,
                      message:'Error while quering user with id :'+req.body.id + error.message,
                      data:error

                  })
                  return false;
              }
              res.json({
                  type:TYPE_SUCCESS,
                  message:'',
                  data:results
              })



      })
  })
  
app.put('/user/:id',function(req,res){
    let params=[req.body.first_name,req.body.last_name,req.body.email,req.body.password];
    connection.query('UPDATE users set ? where id=?',params,req.body.id,function(error,results,fielsd){
        if(error){
            res.status(400).json({
                type:TYPE_ERROR,
                message:'Error while quering user with id :'+req.body.id + error.message,
                data:error

            })
            return false;
        }
        res.json({
            type:TYPE_SUCCESS,
            message:'',
            data:results
        })



})

})

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })