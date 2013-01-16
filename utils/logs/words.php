<!DOCTYPE html>
<html>
<head>
<title>character count</title>
<link type="text/css" rel="stylesheet" href="css/visualize.css"/>
<link type="text/css" rel="stylesheet" href="css/visualize-dark.css"/>
<style type="text/css">
* {
	padding: 0;
	margin: 0;
}
body {
	font-family: Helvetica, Arial, sans-serif;
	font-size: 14px;
	margin: 30px;
}
table th, table td {
	text-align: left;
	padding: 5px;
}
#thewords {
	margin: 20px;
}
</style>
</head>
<body>
<?php

echo '<h1>word frequency on #ac</h1>';
echo '<h2>brought to you by cylebot</h2>';

// check log... get word frequency per person... lol

$common_words = array('the', 'you', 'are', 'that', 'this', 'and', 'for', 'but');

$logfilepath = '/node/logs/cylebot_chat.log';

$logfile = file_get_contents($logfilepath);

$lines = explode("\n", $logfile);

echo '<p>tracking since ' . substr($lines[0], 0, 19) . ', ';

//echo '<pre>'.print_r($lines, true).'</pre>';

$people = array();

$counter = 0;

foreach ($lines as $line) {
	if (preg_match('/(\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}) (\[(\w+)\]) (.*)/i', $line, $matches)) {
		//echo '<pre>'.print_r($matches, true).'</pre>';
		$people[$matches[3]][] = $matches[4];
		$counter++;
	}
	unset($matches);
}

unset($line, $lines);

echo 'dealt with '.$counter.' lines so far, updating as chat rolls on...</p>';

echo 'not counting anything less than 3 letters, or the words: <i>'.implode(', ', $common_words).'</i>';

//echo '<pre>'.print_r($people, true).'</pre>';

$frequencies = array();

foreach ($people as $name => $lines) {
	foreach ($lines as $line) {
		if (preg_match_all('/\b\S+\b/i', $line, $matches)) {
			//echo '<pre>'.print_r($matches, true).'</pre>';
			foreach ($matches[0] as $match) {
				if (strlen($match) < 3 || in_array($match, $common_words)) {
					continue;
				}
				if (!isset($frequencies[$name][strtolower($match)])) {
					$frequencies[$name][strtolower($match)] = 1;
				} else {
					$frequencies[$name][strtolower($match)]++;
				}
			}
		}
		unset($matches);
	}
}

unset($name, $lines);

$limited = array();

foreach ($frequencies as $name => $words) {
	$newwords = array();
	foreach ($words as $word => $count) {
		if ($count > 10) {
			$newwords[$word] = $count;
		}
	}
	//echo $name. ' said '.count($words). ' words <br />';
	if (count($newwords) == 0) {
		continue;
	}
	$limited[$name] = $newwords;
}

unset($name, $lines);

//echo '<pre>'.print_r($frequencies, true).'</pre>';

$sorted = array();

foreach ($limited as $name => $words) {
	//echo '<pre>'.print_r($words, true).'</pre>';
	arsort($words);
	$sorted[$name] = $words;
	//echo '<pre>'.print_r($words, true).'</pre>';
}

echo '<div id="thewords"><pre>'.print_r($sorted, true).'</pre></div>';

?>
</body>
</html>