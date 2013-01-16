<?php
/*

pick one of these:
- reading <random book> (get book name from API or dictionary)
	- roll for "and it's horrible" or "and i love it"
- watching random movie (get movie name from API or dictionary - maybe IMDB top 100 movies)
	- roll for random criticism at the end
		- "it's way too long"
		- "the acting could be better"
		- "appalled by the racism"
- i'm just <adverb> <adjective> today.
- post random link from dictionary
	- or randomly-generated bit.ly link
- random line from a dictionary of predefined lines:
	- "pregnant. again."
	- vague passive-aggressive ones about "people"
	- complaints about Hana as girlfriend from dictionary
	- "tough to be a robot" lines
	- complaining about stupid electric sleep dream
	- empty political beliefs
	
before posting:
- roll for all caps
- roll for end-phrase: deal with it, zing!, lulz, etc


so databases needed:
 - books
 - movies
 - adverbs
 - adjectives
 - links
 - predefined status update lines
 - end-phrases
 
*/

$m = new Mongo();
$db = $m->statusbot;
$books = $db->books;
$movies = $db->movies;
$adverbs = $db->adverbs;
$adjectives = $db->adjectives;
$links = $db->links;
$statuses = $db->statuses;
$endings = $db->endings;
$book_remarks = $db->book_remarks;
$movie_remarks = $db->movie_remarks;

function randomStatus() {
	
	global $books, $movies, $adverbs, $adjectives, $links, $statuses, $endings, $book_remarks, $movie_remarks;
	
	$okso = rand(1, 100);
	$status = '';
	
	// first, what to post?
	if ($okso > 0 && $okso <= 5) {
		// reading something
		$num_books = $books->count();
		$book = $books->find()->limit(1)->skip(rand(1,$num_books)-1)->getNext();
		$status = 'reading '.$book['name'];
		if (rand(1,100) < 70) {
			$num_remarks = $book_remarks->count();
			$remark = $book_remarks->find()->limit(1)->skip(rand(1,$num_remarks)-1)->getNext();
			$status .= $remark['name'];
		}
	} else if ($okso > 5 && $okso <= 10) {
		// watching something
		$num_movies = $movies->count();
		$movie = $movies->find()->limit(1)->skip(rand(1,$num_movies)-1)->getNext();
		$status = 'watching '.$movie['name'];
		if (rand(1,100) < 70) {
			$num_remarks = $movie_remarks->count();
			$remark = $movie_remarks->find()->limit(1)->skip(rand(1,$num_remarks)-1)->getNext();
			$status .= $remark['name'];
		}
	} else if ($okso > 10 && $okso <= 35) {
		// random adverb + adjective
		$num_adverbs = $adverbs->count();
		$adverb = $adverbs->find()->limit(1)->skip(rand(1,$num_adverbs)-1)->getNext();
		$num_adjectives = $adjectives->count();
		$adjective = $adjectives->find()->limit(1)->skip(rand(1,$num_adjectives)-1)->getNext();
		$status = 'i\'m just '.$adverb['name'].' '.$adjective['name'].' today.';
	} else if ($okso > 35 && $okso <= 65) {
		// random link from database or bit.ly
		if (rand(1,100) < 30) {
			// bitly link
			//$status = 'random bit.ly link';
			$length = rand(4, 6);
			$generated = '';
			$prefix = 'http://bit.ly/';
			for ($i = 0; $i < $length; $i++) {
				$num_or_letter = rand(1,1000) % 2;
				$generated .= ($num_or_letter) ? chr(rand(48, 57)) : chr(rand(97, 122));
			}
			$status = 'oh lol '. $prefix.$generated;
		} else {
			// link from database
			$num_links = $links->count();
			$link = $links->find()->limit(1)->skip(rand(1,$num_links)-1)->getNext();
			$status = 'i lol\'d '.$link['name'];
		}
	} else {
		// random line from database...
		//$status = 'random line from database...';
		$num_statuses = $statuses->count();
		$status = $statuses->find()->limit(1)->skip(rand(1,$num_statuses)-1)->getNext();
		$status = ''.$status['name'].'';
	}
	
	// finally, do anything to it?
	$rightwell = rand(1, 100);
	if ($rightwell > 0 && $rightwell <= 10) {
		//$status = status.toUpperCase();
		$status = strtoupper($status);
	} else if ($rightwell > 10 && $rightwell <= 20) {
		// make sure there's punctuation at the end before the ending phrase
		if (!in_array(substr($status, -1, 1), array('.', '?', '!'))) {
			$status .= '.';
		}
		$num_endings = $endings->count();
		$ending = $endings->find()->limit(1)->skip(rand(1,$num_endings)-1)->getNext();
		$status .= ' '.$ending['name'];
	}
	
	return $status;
	
}

echo randomStatus();
?>