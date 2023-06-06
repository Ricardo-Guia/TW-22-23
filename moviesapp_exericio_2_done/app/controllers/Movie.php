<?php
use app\core\Controller;
class Movie extends Controller {
  /**
  * Invocação da view index.php
  */
  public function index() {
    $Movies = $this->model('Movies'); // é retornado o model Movies()
    //$data = $Movies::getAllMovies();

    $data = [
      [ 'title' => 'Alabama', 'id' => 104 ],
      [ 'title' => 'Arizona', 'id' => 121 ],
    ];

    /*
    $Movies = new Movies();
    $data = $Movies->getAllMovies();
    ------------------------------------------------------
    $Movies = "Movies";
    $data = $Movies::getAllMovies();
    */
    $this->view('movie/index', ['movies' => $data]);
  }

  /**
  * Invocação da view get.php
  *
  * @param  int   $id   Id. movie
  */
  public function get($id = null) {
    if (is_numeric($id)) {

      $Movies = $this->model('Movies');
      $data = $Movies::findMovieById($id);
      $this->view('movie/get', ['movies' => $data]);
    } else {
      $this->pageNotFound();
    }
  }
}

// :: Scope Resolution Operator
// Utilizado para acesso às propriedades e métodos das classes
?>