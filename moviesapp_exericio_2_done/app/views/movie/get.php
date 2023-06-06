<?php
echo "<ul>";
foreach ($data['movies'] as $movie) {
  echo '<li>' . $movie['title'] . '</li>';
}
echo "<ul>";
?>