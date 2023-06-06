<?php

namespace app\models;

use app\core\Db;
class Movies {
  /**
  * Método para obtenção do dataset de todos os filmes
  *
  * @return   array
  */
  public static function getAllMovies() {
    $conn = new Db();
    $response = $conn->execQuery('SELECT id, title, imdb_rating, release_year FROM movies');
    return $response;
  }

  /**
  * Método para a obtenção de um brawler pelo id correspondente
  * @param    int     $id   Id. do brawler
  *
  * @return   array
  */
  public static function findMovieById(int $id) {
    $conn = new Db();
    $response = $conn->execQuery('SELECT id, title, imdb_rating, release_year FROM movies WHERE id = ?', array('i', array($id)));
    return $response;
  }

}