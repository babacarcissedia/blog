const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'blog',
  password : 'blog',
  database : 'blog_db'
});

connection.connect(function(err){
    if(err)
    {
        console.log(err);
    }else{
        console.log('Connected to database blog_db');
    }
});

exports.getUser=function(id,callback)
{
    let sql='SELECT * FROM users where id=?';
    connection.query(sql,[id],function(err,data)
    {
        if(err){
            callback(err);
        }else
        {
        
            callback(null,data);
        }
        
    });
}
exports.insertUser=function(data,callback)
{
    let sql='INSERT INTO users set ?';
    connection.query(sql,[data],function(err,data)
    {
        if(err)
        {
            callback(err);
        }else{
            callback(null,data);
        }
    })
}

exports.updateUser=function(id,data,callback)
{
    let sql='UPDATE users set ? where id=?';
    connection.query(sql,[data,id],function(err,data)
    {
        if(err){
            callback(err);
        }else
        {
        
            callback(null,data);
        }
        
    });
}

exports.deleteUser=function(id,callback)
{
    let sql='DELETE from users where id=?';
    connection.query(sql,[id],function(err,data)
    {
        if(err){
            callback(err);
        }else
        {
        
            callback(null,data);
        }
        
    });
}

