module.exports = app => {
  const movies = require("../controllers/movie.controller.js");

  let router = require("express").Router();

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
