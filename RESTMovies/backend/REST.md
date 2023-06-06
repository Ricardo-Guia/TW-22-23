# **Node.js** . REST API
_Última atualização do doc. 04.Jan.2022_

- [Enquadramento do projeto](#enquadramento-do-projeto)
- [Metodologia](#metodologia)
- [Tecnologia utilizada](#tecnologia-utilizada)
- [API](#api)
- [Estrutura de pastas do projeto](#estrutura-de-pastas-do-projeto)
- [Criar/Preparar a aplicação](#criarpreparar-a-aplicação)
- [Configurar o servidor web (Express Web Server)](#configurar-o-servidor-web-express-web-server)
- [Configurar acesso ao servidor de base de dados](#configurar-acesso-ao-servidor-de-base-de-dados)
- [Configurar conexão à base de dados](#configurar-conexão-à-base-de-dados)
- [Definir o modelo movie](#definir-o-modelo-movie)
- [Definir os Controllers](#definir-os-controllers)
- [Codificar os Controllers](#codificar-os-controllers)
- [Definir as Routes](#definir-as-routes)
- [Testar API](#testar-api)

# Enquadramento do projeto
A REST API, deste projeto, dará resposta ao seguinte:
- (C) Adicionar filmes
- (R) Listar filmes
- (U) Atualizar filmes
- (D) Apagar filmes

REST = REpresentational State Transfer

# Metodologia
- Criação de servidor com o Express
- Configuração de acesso à base de dados
- Criação de _model_ para os Filmes
- Criação de _controller_ respetivo
- Definição de _routes_ para dar respostas a todas as operações (CRUD)

# Tecnologia utilizada
- Node.js
- Express
- [MySQL](https://www.npmjs.com/package/mysql)

# API
Método	| URI | Descrição (resultado)
------- | --- |----------------------
GET |	api/movies | obter todos os filmes
GET |	api/movies/:id | obter um filme pelo seu _id_
GET |	api/movies?title=jumanji | obter todos os filmes cujo nome contém, por exemplo, _jumanji_
POST |	api/movies | adicionar um novo filme
PUT |	api/movies/:id | atualizar um filme pelo seu _id_
DELETE |	api/movies/:id | remover um filme pelo seu _id_
DELETE |	api/movies |	remover todos os filmes

# Estrutura de pastas do projeto 
```
├── app
│   ├── config
│   │   └── db.config.js
│   │ 
│   ├── controllers
│   │   └── movie.controller.js
│   │ 
│   ├── models
│   │   ├── db.js
│   │   └── movie.model.js
|   |
│   └── routes
│       └── movie.routes.js 
└─ server.js
```

# Criar/Preparar a aplicação
> Dentro da pasta do projeto

1. Inicialização da aplicação e criação do ``package.json``
```
npm init
```

2. Instalação dos módulos necessários  

Instalação do **express**
```
npm i express
```
Instalação do **cors**
```
npm i cors
```
Instalação do **mysql**
```
npm i mysql
```

Ou, de forma (ainda mais) abreviada
```
npm i express cors mysql
```

# Configurar o servidor web (Express Web Server)
`server.js`
```js
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
  res.json({ message: "Movies API . IPVC" });
});

// importação das movie.routes com um argumento de inicialização
require('./app/routes/movie.routes.js')(app);

// ativação do servidor, onde serão recebidos os pedidos, na porta definida
app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}.`);
});
```

# Configurar acesso ao servidor de base de dados
`app/config/db.config.js`
```js
module.exports = {
  DBSERVER: 'localhost',
  DBUSER: 'root',
  DBPASS: 'nenhuma',
  DBNAME: 'moviesdb'
};
```

# Configurar conexão à base de dados
`app/models/db.js`
```js
const mysql = require('mysql');
const DBConfig = require('../config/db.config.js');

// Criar conexão à base de dados
const connection = mysql.createConnection({
  host: DBConfig.DBSERVER,
  user: DBConfig.DBUSER,
  password: DBConfig.DBPASS,
  database: DBConfig.DBNAME
});

// Abrir conexão à base de dados
connection.connect(error => {
  if (error) throw error;
  console.log('Ligação à base de dados estabelecida...');
});

module.exports = connection;
```

# Definir o modelo _movie_
`app/models/movie.model.js`
```js
const sql = require("./db.js");

// construtor
const Movie = function(movie) {
  this.title = movie.title;
  this.imdb_rating = movie.imdb_rating;
  this.release_year = movie.release_year;
  this.genres_id = movie.genres_id;
}

Movie.insert = (newMovie, result) => {
  sql.query('INSERT INTO movies SET ?', newMovie, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log("Filme inserido: ", { id: res.insertId, ...newMovie });
    result(null, { id: res.insertId, ...newMovie });
  });
}

Movie.findById = (id, result) => {
  sql.query(`SELECT * FROM movies WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('Filme encontrado: ', res[0]);
      result(null, res[0]);
      return;
    }

    // no caso do filme não ser encontrado
    result({ movie: "not_found" }, null);
  });
};

// Este método, no caso de não receber qualquer nome de filme devolve todos
// os filmes, caso contrário filtra o(s) resultado(s) pelo nome do filme (total ou parcial)
Movie.selectAll = (title, result) => {
  let query;
  query = 'SELECT * FROM movies';

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log("Filmes: ", res);
    result(null, res);
  });
};

Movie.updateById = (id, movie, result) => {
  sql.query(
    'UPDATE movies SET title = ?, imdb_rating = ?, release_year = ?, genres_id = ? WHERE id = ?',
    [movie.title, movie.imdb_rating, movie.release_year, movie.genres_id, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Movie
        result({ movie: "not_found" }, null);
        return;
      }

      console.log('Filme atualizado: ', { id: id, ...movie });
      result(null, { id: id, ...movie });
    }
  );
};

Movie.delete = (id, result) => {
  sql.query('DELETE FROM movies WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Movie with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Filme eliminado com o id: ", id);
    result(null, res);
  });
};

Movie.deleteAll = result => {
  sql.query("DELETE FROM movies", (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log(`Eliminado(s) ${res.affectedRows} filme(s)`);
    result(null, res);
  });
};

module.exports = Movie;
```

# Definir os _Controllers_
`app/controllers/movie.controller.js`

```js
const Movie = require("../models/movie.model.js");

// Inserir um novo filme
exports.insert = (req, res) => {
  
};

// Devolver todos os filmes (ou filtrar por determinado nome - total ou parcial)
exports.selectAll = (req, res) => {
  
};

// Devolver um filme pelo seu id
exports.findById = (req, res) => {
  
};

// Atualizar um filme pelo seu id
exports.update = (req, res) => {
  
};

// Apagar um filme pelo seu id
exports.delete = (req, res) => {
  
};

// Apagar todos os filmes da base de dados
exports.deleteAll = (req, res) => {
  
};

```

# Codificar os _Controllers_
`app/controllers/movie.controller.js`

```js
const Movie = require("../models/movie.model.js");

// Inserir um novo filme
exports.insert = (req, res) => {
  // Validar a request
  if (!req.body) {
    res.status(400).send({
      message: "O conteúdo do filme deve estar definido."
    });
  }

  // Criar um "Movie"
  const movie = new Movie({
    title: req.body.title,
    imdb_rating: req.body.imdb_rating || false,
    release_year: req.body.release_year,
    genres_id: req.body.genres_id
  });

  // Guardar "Movie" na base de dados
  Movie.insert(movie, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ocorreu um erro ao inserir o filme..."
      });
    else res.send(data);
  });
};

// Devolver todos os filmes (ou filtrar por determinado nome - total ou parcial)
exports.selectAll = (req, res) => {
  const title = req.query.title;

  Movie.selectAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ocorreu um erro na obtenção do(s) filme(s)..."
      });
    else res.send(data);
  });
};

// Devolver um filme pelo seu id
exports.findById = (req, res) => {
  Movie.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Não foi encontrado o filme com id = ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Não foi encontrado o filme com id = " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Atualizar um filme pelo seu id
exports.update = (req, res) => {
  // Validar a request
  if (!req.body) {
    res.status(400).send({
      message: "O conteúdo do filme deve estar definido."
    });
  }

  Movie.updateById(
    req.params.id,
    new Movie(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
             message: `Não foi encontrado o filme com id = ${req.params.id}.`
          });
        } else {
          res.status(500).send({
             message: `Foi gerado um erro a atualizar o filme com id = ${req.params.id}.`
          });
        }
      } else res.send(data);
    }
  );
};

// Apagar um filme pelo seu id
exports.delete = (req, res) => {
  Movie.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Não foi encontrado o filme com id = ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: `Foi gerado um erro a apagar o filme com id = ${req.params.id}.`
        });
      }
    } else res.send({ message: 'O filme foi eliminado com sucesso.' });
  });
};

// Apagar todos os filmes da base de dados
exports.deleteAll = (req, res) => {
  Movie.deleteAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Foi gerado um erro a apagar a totalidade dos filmes.'
      });
    else res.send({ message: 'Todos os filmes foram eliminados...' });
  });
};

```


# Definir as _Routes_
Necessário para determinar como o servidor deverá responder quando os _clientes_ enviam pedidos para determinado _endpoint_ através dos pedidos HTTP (GET, POST, PUT, DELETE). As rotas definidas no projeto são:

- `/movies` :através de pedidos GET, POST, DELETE
- `/movies/:id` :através de pedidos GET, PUT, DELETE

`app/routes/movie.routes.js`
```js
module.exports = app => {
  const movies = require("../controllers/movie.controller.js");

  var router = require("express").Router();

  // Consultar todos os filmes
  router.get("/", movies.selectAll);

  // Consultar um filme pelo id
  router.get("/:id", movies.findById);

  // Inserir um novo filme
  router.post("/", movies.insert);

  // Atualizar um filme pelo id
  router.put("/:id", movies.update);

  // Apagar um filme pelo id
  router.delete("/:id", movies.delete);

  // Apagar todos os filmes
  router.delete("/", movies.deleteAll);

  app.use('/api/movies', router);
};
```

# Testar API
_Para o efeito foi utilizada a extensão do VSCode **Thunder Client**_