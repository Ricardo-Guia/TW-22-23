const Movie = require("../models/movie.model.js");

// Inserir um novo filme
exports.insert = (req, res) => {
  console.log(req.body);
  // Validar a request
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({
      message: "O conteúdo do filme deve estar definido."
    });
  } else {
    // Criar um "Movie"
    const movie = new Movie({
      title: req.body.title,
      imdb_rating: req.body.imdb_rating || '0.0',
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
  }

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
      if (err.movie === "not_found") {
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
        if (err.movie === "not_found") {
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
      if (err.movie === "not_found") {
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
