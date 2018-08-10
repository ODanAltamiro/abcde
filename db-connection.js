var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "gestao2018*",
  database: "vendingmachine"
});

module.exports.conexao = con
module.exports.preparaBD = function() {

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE vendingmachine", function (err, result) {
      if (err) throw err;
      console.log("Database created");

      let tableScripts = [
        "USE vendingmachine",
        "CREATE TABLE cartao (id INT AUTO_INCREMENT PRIMARY KEY, saldo FLOAT, ultimaCarga DATETIME default null)",
        "CREATE TABLE produto (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco FLOAT, quantidade INT)",
        "CREATE TABLE compra (id INT NOT NULL, cartaoId INT, produtoId INT, PRIMARY KEY (id), FOREIGN KEY (cartaoId) REFERENCES cartao(id), FOREIGN KEY (produtoId) REFERENCES produto(id))",
        "INSERT INTO produto (nome, preco, quantidade) VALUES ('Ruffles', 5.5, 5), ('Doritos', 5.5, 5), ('Cebolitos', 5.5, 5), ('Snickers', 3, 10), ('MilkyWay', 3, 10), ('Twix', 3, 10);",
        "INSERT INTO cartao(saldo, ultimaCarga) VALUES (5.5, now()), (5.5, now()),(5.5, now());"
      ]
      for(let i in tableScripts) {
        con.query(tableScripts[i],function(err){
          if (err) throw err;
        })
      }

      con.end(function(err){
        if (err) throw err;
        console.log("Connection closed!")
      });
    });
  });
}

module.exports.findAllProdutos = function(retorno, response){
  console.log("Vou te mostrar os produtos disponíveis");

  con.connect(function(err) {
    if (err) throw err;

    con.query("SELECT * FROM produto", function(err, result, fields) {
      if (err) throw err;

      retorno(result, response)

      con.end(function(err) {
        if (err) throw err;
      });

    });

  });
}

module.exports.realizarCompra = function(){
  console.log("Vou realizar a compra");
}

module.exports.atualizaCartao = function(){
  console.log("Você comprou, né")
}
