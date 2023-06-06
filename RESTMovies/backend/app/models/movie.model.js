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
      result({ movie: "not_found" }, null);
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