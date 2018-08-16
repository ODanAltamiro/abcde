let dbConnection = require('./db-connection')

module.exports.findAllProdutos = function(retorno){
    dbConnection.conexao.query("SELECT * FROM produto", function(err, result) {
      if (err) throw err;
      retorno(result)
    });
}
