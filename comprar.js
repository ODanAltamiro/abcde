let dbConnection = require('./db-connection')
let dateFormat = require('dateformat');

let findProdutoById = (id, retorno) => {
  dbConnection.conexao.query("SELECT * FROM produto where id =" + id, function(err, result){
    if (err) throw err;
    retorno(result[0])
  });
}

let temProduto = (produto) => {
  if (produto.quantidade > 0) return true
  else return false
}

let atualizaBD = (produto, cartao, callback) => {
  dbConnection.conexao.query(`UPDATE cartao SET saldo = ${cartao.saldo - produto.preco} WHERE id = ${cartao.id}`, function(err){
    if (err) throw err;
    dbConnection.conexao.query(`UPDATE produto SET quantidade = ${produto.quantidade - 1} WHERE id = ${produto.id}`, function(err){
      if (err) throw err;
    });
    if(callback) {
      callback()
    }
  });
}

let findCartaoById = (id, retorno) => {
  dbConnection.conexao.query("SELECT id, saldo, DATE_FORMAT(ultimaCarga, '%Y/%m/%d') as ultimaCarga FROM cartao where id = " + id, function(err, result){
      if (err) throw err;
      retorno(result[0])
    }
  );
}

let registraCompra = (cartao, produto, retorno) => {
  if (temProduto(produto)){
    if (cartao.saldo >= produto.preco){
      dbConnection.conexao.query(`INSERT INTO compra (cartaoId, produtoId) VALUES(${cartao.id}, ${produto.id})`,function(err){
        if (err) throw err;
        let callback = () => {
          let retornoFinal = (produto) => {
            retorno(201, {mensagem: "Compra efetuada", produto: produto})
          }
          findProdutoById(produto.id, retornoFinal)
        }
        atualizaBD(produto, cartao, callback)
      });
    } else {
      retorno(404, {mensagem:"Saldo insuficiente - R$" + cartao.saldo})
    }
  } else {
    retorno(404, {mensagem:"Sem produto no estoque"})
  }
}

let efetuarCarga = (cartao, callback) => {
  let hoje = dateFormat(new Date(), 'yyyy/mm/dd').toString()
  if (cartao.ultimaCarga !== hoje) {
    let recarga = 5.5 - cartao.saldo
    dbConnection.conexao.query(`UPDATE cartao SET saldo = ${cartao.saldo + recarga}, ultimaCarga=now() WHERE id = ${cartao.id}` ,function(err){
      if (err) throw err;
      cartao.saldo = 5.5
      callback(cartao)
    })
  } else callback(cartao)
}

module.exports.realizarCompra = function(cartaoId, produtoId, retorno) {
  let retornoCartao = (cartao) => {
    if (cartao){
      let retornoRecarga = (cartao) => {
        let retornoProduto = (produto) => {
          registraCompra(cartao, produto, retorno)
        }
        findProdutoById(produtoId, retornoProduto)
      }
      efetuarCarga(cartao, retornoRecarga)
    } else (
      retorno(404, {mensagem:"Esse cartão não existe"})
    )
  }
  findCartaoById(cartaoId, retornoCartao)
}
