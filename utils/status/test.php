<?php

$m = new Mongo();
$db = $m->statusbot;


$movies = $db->movies;
$movie_remarks = $db->movie_remarks;


$num_movies = $movies->count();
		$movie = $movies->find()->limit(1)->skip(rand(1,$num_movies)-1)->getNext();
		$status = 'watching '.$movie['name'];
		if (rand(1,100) < 70) {
			$num_remarks = $movie_remarks->count();
			$remark = $movie_remarks->find()->limit(1)->skip(rand(1,$num_remarks)-1)->getNext();
			$status .= $remark['name'];
		}



echo $status;

?>