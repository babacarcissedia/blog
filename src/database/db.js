var mysql= require('mysql');

/*
* @param {object} options
* @param {string} [options.host]
* @param {string} [options.user]
* @param {string} [options.password]
* @param {string} [options.database]
**/
var Database = function (options) {
    this.connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'blog',
        password : 'blog',
        database : 'blog_db'
    });
    this.connection.connect()
}


Database.prototype.connect = function () {
    this.connection.connect()
}

Database.prototype.query = function (sql, params) {
    return new Promise((resolve, reject) => {
        this.connection.query(sql, params, (error, results) => {
            if (error) {
                reject(error)
                return false
            }
            resolve(results)
        })
    })
}

Database.prototype.close = function () {
    this.connection.end()
}

module.exports = Database