// console.log("\n\n\n\n\nHello world!")
let readline = require('readline')
let express = require('express')
let cors = require('cors')
let bodyParser = require('body-parser')
let dbConnection = require('./db-connection')

let api = express()
let port = 3000


let criarBD = function(){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Quer criar BD? (S ou N) ', (answer) => {
    if(answer === 'S') {
      dbConnection.preparaBD();
      rl.close();
    } else rl.close();
  });

}

api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json())
api.use(cors())

api.get('/api/produtos', (req,res) => {
  let retorno = (produtos) => {
    res.status(200).send(produtos)
  }
  dbConnection.findAllProdutos(retorno)
})

api.route('/api/comprar')
  .post(function (req, res) {
    console.log("Enviando compra")
    console.log(req.body)
    let compra = req.body
    let retorno = (status, msg) => {
      res.status(status).send(msg)
    }
    dbConnection.realizarCompra(compra.cartao, compra.produto, retorno)
  })

api.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
  console.log('Para derrubar o servidor: ctrl + c\n\n');
  criarBD();
})
