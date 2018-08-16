var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SUASENHA",
  database: "vendingmachine"
});

module.exports.conexao = con
