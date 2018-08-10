// console.log("\n\n\n\n\nHello world!")
let readline = require('readline')
let express = require('express')
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

api.get('/', (req,res) => {
  console.log("There's somebody here!\n\n")
  let produtos = dbConnection.listaProdutos();
  console.log(produtos)
  for (let i in produtos){
    console.log("Nome: " + produtos[i].nome + " Valor: " + produtos[i].valor + " Quantidade: " + produtos[i].quantidade);
  }
  res.send('<h1>PRODUTOS</h1>')
})

api.route('/contato')
  .get(function (req, res) {
  console.log("Agora tem alguem em GET /contato")
  res.send(`
      <h1>Contato</h1>
      <form action="/contato" method="POST">
        <label for="email">Email:</label>
        <input type="email" name="email" id="email">
        <label for="mensagem">Mensagem:</label>
        <input type="text" name="mensagem" id="mensagem"></input>
        <input type="submit" value="Enviar">
      </form>
    `)
  })
  .post(function (req, res) {
    console.log("Recebi um POST em /contato")
    console.log(req.body)
//    let usr = req.body
    res.send('<h3>Ser&aacute;?</h3>')
  })

api.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
  console.log('Para derrubar o servidor: ctrl + c\n\n');
  criarBD();
})
