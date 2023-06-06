<?php 
echo "<ul>";
foreach ($data['movies'] as $movie) {
  echo '<li>' . $movie['title'] . ' <a href="./get/' . $movie['id']  . '">Ver +</a></li>';
}
echo "<ul>";
?>