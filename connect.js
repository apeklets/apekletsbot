require('dotenv').config();
const mysql = require('mysql');

var conn = mysql.createConnection({
    host        :   process.env.HOST,
    user        :   process.env.USER,
    password    :   process.env.PW,
    database    :   process.env.DB
});

module.exports = conn;
