<?php

// get a random line from a random poem in mongodb

$m = new Mongo();
$db = $m->poetry;
$poems = $db->poems;
$num_poems = $poems->count();


$result = array();

if (isset($_GET['l']) && is_numeric($_GET['l']) && $_GET['l'] * 1 <= 5 && $_GET['l'] * 1 > 1) {
	
	$numlines = $_GET['l'] * 1;
	
	$nextline = '';
	$fullpoem = '';
	for ($i = 0; $i < $numlines; $i++) {
		while (trim($nextline) == '') {
			$poem = $poems->find()->limit(1)->skip(rand(1,$num_poems)-1)->getNext();
			$lines = explode("\n", $poem['poem']);
			$nextline = trim($lines[array_rand($lines)]);
		}
		$fullpoem .= $nextline."\n";
		$nextline = '';
	}
	
	$result['title'] = 'Random Poem';
	$result['author'] = 'cylebot';
	$result['line'] = $fullpoem;
	
} else {
	
	while (!isset($result['line']) || trim($result['line']) == '') {
		$poem = $poems->find()->limit(1)->skip(rand(1,$num_poems)-1)->getNext();
		
		$result['title'] = $poem['title'];
		$result['author'] = $poem['author'];
		
		$lines = explode("\n", $poem['poem']);
		$result['line'] = $lines[array_rand($lines)];
	}
	
}




//print_r($result);

echo json_encode($result);

?>