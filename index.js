
// express
const express = require('express')
const app = express()
// middleware of express
var bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var userRoutes = require('./routes/user.js')
var postRoutes = require('./routes/post.js')
var commentRoutes = require('./routes/comment.js')
app.use('/user', userRoutes)
app.use('/post', postRoutes)
app.use('/comment', commentRoutes)


app.listen(5000, function () {
    console.log('Blog app listening on port 4000!')
})
