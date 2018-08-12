let dateFormat = require('dateformat');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "gestao2018*",
  database: "vendingmachine"
});

module.exports.conexao = con
module.exports.preparaBD = function() {
    con.query("CREATE DATABASE IF NOT EXISTS vendingmachine", function (err, result) {
      if (err) throw err;
      console.log("Database created");

      let tableScripts = [
        "USE vendingmachine",
        "CREATE TABLE cartao (id INT AUTO_INCREMENT PRIMARY KEY, numero VARCHAR(127) UNIQUE, saldo FLOAT, ultimaCarga DATETIME default null)",
        "CREATE TABLE produto (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco FLOAT, quantidade INT, link VARCHAR(255))",
        "CREATE TABLE compra (id INT AUTO_INCREMENT PRIMARY KEY, cartaoId INT, produtoId INT, FOREIGN KEY (cartaoId) REFERENCES cartao(id), FOREIGN KEY (produtoId) REFERENCES produto(id))",
        "INSERT INTO produto (nome, preco, quantidade, link) VALUES ('Ruffles', 5.5, 5, 'https://redemachado.com.br/media/catalog/product/cache/1/image/562x562/9df78eab33525d08d6e5fb8d27136e95/r/u/ruffles.png'), ('Doritos', 5.5, 5, 'https://www.fritolay.com/images/default-source/blue-bag-image/doritos-cool-ranch.png?sfvrsn=a64e563a_2'), ('Cebolitos', 5.5, 5, 'https://www.paodeacucar.com/img/uploads/1/511/553511.png?type=product'), ('Snickers', 2, 10, 'https://banner2.kisspng.com/20180323/ubw/kisspng-ice-cream-mars-bounty-twix-snickers-snickers-5ab4ebd52c94f0.9699951815218062931826.jpg'), ('MilkyWay', 2, 10, 'https://www.photospng.com/uploads/milky-way-chocolate-bar-icon.png'), ('Twix', 2, 10,'http://www.marspresskit.com/wp-content/uploads/2017/09/Twix-White-Choc-2-to-Go.png');",
        "INSERT INTO cartao(saldo, ultimaCarga) VALUES (5.5, now()), (5.5, now()),(5.5, now());"
      ]
      for(let i in tableScripts) {
        con.query(tableScripts[i],function(err){
          if (err) throw err;
        })
      }
    });
}

module.exports.findAllProdutos = function(retorno){
  console.log("Vou te mostrar os produtos disponíveis");
    con.query("SELECT * FROM produto", function(err, result) {
      if (err) throw err;
      retorno(result)
    });
}


let findProdutoById = (id, retorno) => {
  con.query("SELECT * FROM produto where id =" + id, function(err, result){
    if (err) throw err;
    console.log("\nRETORNEI PRODUTO")
    retorno(result[0])
  });
}

let temProduto = (produto) => {
  if (produto.quantidade > 0) return true
  else return false
}

let atualizaBD = (produto, cartao, callback) => {
  con.query(`UPDATE cartao SET saldo = ${cartao.saldo - produto.preco} WHERE id = ${cartao.id}`, function(err){
    if (err) throw err;
    console.log("ERRO NA ATUALIZACAO DO CARTAO")
    con.query(`UPDATE produto SET quantidade = ${produto.quantidade - 1} WHERE id = ${produto.id}`, function(err){
      if (err) throw err;
      console.log("ERRO NA ATUALIZACAO DO PRODUTO")
    });
    if(callback) {
      callback()
    }
  });
}

let findCartaoById = (id, retorno) => {
  con.query("SELECT id, saldo, DATE_FORMAT(ultimaCarga, '%Y/%m/%d') as ultimaCarga FROM cartao where id = " + id, function(err, result){
      if (err) throw err;
      console.log("\n RETORNEI CARTAO")
      retorno(result[0])
    }
  );
}

let registraCompra = (cartao, produto, retorno) => {
  console.log("\nVOU REGISTRAR COMPRA")
  if (temProduto(produto)){
    console.log("\nTEM PRODUTO SIM");
    if (cartao.saldo >= produto.preco){
      console.log("\nTAMBEM TEM SALDO")
      con.query(`INSERT INTO compra (cartaoId, produtoId) VALUES(${cartao.id}, ${produto.id})`,function(err){
        if (err) throw err;
        let callback = () => {
          let retornoFinal = (produto) => {
            retorno(201, {mensagem: "Compra efetuada", produto: produto})
          }
          findProdutoById(produto.id, retornoFinal)
        }
        atualizaBD(produto, cartao, callback)
        console.log("Comprei")
      });
    } else {
      retorno(404, {mensagem:"Saldo insuficiente"})
    }
  } else {
    retorno(404, {mensagem:"Sem produto no estoque"})
  }
}

let efetuarCarga = (cartao, callback) => {
  let hoje = dateFormat(new Date(), 'yyyy/mm/dd').toString()
  if (cartao.ultimaCarga !== hoje) {
    let recarga = 5.5 - cartao.saldo
    con.query(`UPDATE cartao SET saldo = ${cartao.saldo + recarga}, ultimaCarga=now() WHERE id = ${cartao.id}` ,function(err){
      if (err) throw err;
      cartao.saldo = 5.5
      callback(cartao)
    })
  }
  callback(cartao)
}

module.exports.realizarCompra = function(cartaoId, produtoId, retorno) {
  let retornoCartao = (cartao) => {
    let retornoRecarga = (cartao) => {
      let retornoProduto = (produto) => {
        registraCompra(cartao, produto, retorno)
      }
      findProdutoById(produtoId, retornoProduto)
    }
    efetuarCarga(cartao, retornoRecarga)
  }
  findCartaoById(cartaoId, retornoCartao)

}
