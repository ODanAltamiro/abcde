let express = require('express')
let cors = require('cors')
let bodyParser = require('body-parser')
let dbConnection = require('./db-connection')
let produtos = require('./produtos')
let comprar = require('./comprar')
let banco = require('./banco')

let api = express()
let port = 3000

let verBD = function(){
  let callback = (retorno) => {
    if(retorno) {
      // BASE DE DADOS JÁ EXISTE
    }
    else banco.preparaBD();
  }
  banco.temBD(callback)
}

api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json())
api.use(cors())

api.get('/api/produtos', (req,res) => {
  let retorno = (produtos) => {
    res.status(200).send(produtos)
  }
  produtos.findAllProdutos(retorno)
})

api.route('/api/comprar')
  .post(function (req, res) {
    let compra = req.body
    let retorno = (status, msg) => {
      res.status(status).send(msg)
    }
    comprar.realizarCompra(compra.cartao, compra.produto, retorno)
  })

api.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
  console.log('Para derrubar o servidor: ctrl + c\n\n');
  verBD();
})
