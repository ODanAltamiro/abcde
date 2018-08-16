let dbConnection = require('./db-connection')

module.exports.temBD = function(retorno) {
    dbConnection.conexao.query("SHOW TABLES",function(err, result){
      if(err) throw err ;
      else {
        retorno(result[0])
      }
    })
}

module.exports.preparaBD = function() {
    dbConnection.conexao.query("CREATE DATABASE IF NOT EXISTS vendingmachine", function (err, result) {
      if (err) throw err;

      let tableScripts = [
        "CREATE TABLE cartao (id INT AUTO_INCREMENT PRIMARY KEY, numero VARCHAR(127) UNIQUE, saldo FLOAT, ultimaCarga DATETIME default null)",
        "CREATE TABLE produto (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco FLOAT, quantidade INT, link VARCHAR(255))",
        "CREATE TABLE compra (id INT AUTO_INCREMENT PRIMARY KEY, cartaoId INT, produtoId INT, FOREIGN KEY (cartaoId) REFERENCES cartao(id), FOREIGN KEY (produtoId) REFERENCES produto(id))",
        "INSERT INTO produto (nome, preco, quantidade, link) VALUES ('Ruffles', 5.5, 5, 'https://redemachado.com.br/media/catalog/product/cache/1/image/562x562/9df78eab33525d08d6e5fb8d27136e95/r/u/ruffles.png'), ('Doritos', 5.5, 5, 'https://www.fritolay.com/images/default-source/blue-bag-image/doritos-cool-ranch.png?sfvrsn=a64e563a_2'), ('Cebolitos', 5.5, 5, 'https://www.paodeacucar.com/img/uploads/1/511/553511.png?type=product'), ('Snickers', 2, 10, 'http://pngimg.com/uploads/snickers/snickers_PNG13925.png'), ('MilkyWay', 2, 10, 'https://www.photospng.com/uploads/milky-way-chocolate-bar-icon.png'), ('Twix', 2, 10,'http://www.marspresskit.com/wp-content/uploads/2017/09/Twix-White-Choc-2-to-Go.png');",
        "INSERT INTO cartao(numero, saldo, ultimaCarga) VALUES (1322, 5.5, '2018-08-10'), (1233, 5.5, '2018-08-10'),(1123, 5.5, now());"
      ]
      for(let i in tableScripts) {
        dbConnection.conexao.query(tableScripts[i],function(err){
          if (err) throw err;
        })
      }
    });
}
