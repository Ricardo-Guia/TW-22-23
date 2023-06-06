<?php
use app\core\Controller;

class Home extends Controller {
  // invocação da view index.php de /home
  public function index() {
    
    $data = [
      [ 'title' => 'Alabama','description' => 'This filme is really amazing', 'id' => 104 ],
      [ 'title' => 'Arizona','description' => 'This filme is really not amazing', 'id' => 121 ],
      [ 'title' => 'Other Film','description' => 'This filme is nice', 'id' => 122 ],
      [ 'title' => 'Amazon Trip','description' => 'This filme is amazon', 'id' => 123 ],
    ];

    $this->view('home/index', ['movies' => $data]);

    //$this->view('home/index');
  }
}

?>