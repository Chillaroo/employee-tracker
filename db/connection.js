// Enable access to .env variables
require('dotenv').config();

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err)=>{
    if (err) {
        console.log(err);
        throw err;
    }
});

module.exports = connection;
