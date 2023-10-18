const mysql=require('mysql2');

const conn= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tsunami_pool'
})

const getConnection = ()=>{
    return  conn;
}

module.exports={
    getConnection
}