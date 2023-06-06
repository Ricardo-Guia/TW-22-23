const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: 'http://localhost'
};

app.use(cors(corsOptions));

// tratamento (parse) de pedidos de content-type - application/json
app.use(express.json());

// tratamento (parse) de pedidos de content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// route de "entrada" - apenas para efeito de teste
app.get("/", (req, res) => {
  res.json({ message: "Movies API . IPVC22" });
});

// importação das movie.routes com um argumento de inicialização
require('./app/routes/movie.routes.js')(app);

// ativação do servidor, onde serão recebidos os pedidos, na porta definida
app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}.`);
});
