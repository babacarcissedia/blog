
const TYPE_ERROR = 'error'
const TYPE_SUCCESS = 'success'

var Database = require('../src/database/db')
var db = new Database({
    host     : 'localhost',
    user     : 'blog',
    password : 'blog',
    database : 'blog_db'
})

module.exports = async function verifyToken(req, res, next){
    var token = req.headers.kouna
    try {
        var results = await db.query('SELECT * FROM users where token = ?', [token])
        if (results.length == 0) {
            res.status(401)
                .json({
                    type: TYPE_ERROR,
                    message: "Not authorized",
                    data: {}
                })
        } else {
            next()
        }
    } catch (error) {
        res.status(400)
            .json({
                type: TYPE_ERROR,
                message: error.message,
                data: error
            })
    }

}