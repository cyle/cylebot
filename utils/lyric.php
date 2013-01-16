<?php

error_reporting(0);

// lol get a song lyric

$artists = array(
	'Led Zeppelin',
	'Michael Jackson',
	'Marvin Gaye',
	'Motley Crue',
	'Nine Inch Nails',
	'Van Halen',
	'Gwen Stefani',
	'Janet Jackson',
	'Hank Williams',
	'Jimi Hendrix',
	'Johnny Cash',
	'Every Time I Die',
	'Isaac Hayes',
	'Massive Attack',
	'Guns n Roses',
	'The Doors',
	'Alice in Chains',
	'Will Smith',
	'Daft Punk'
);

$lyrics_api = 'http://lyrics.wikia.com/api.php';

function getLyric() {

	global $artists, $lyrics_api;
	
	$result = array();
	
	$random_artist = $artists[array_rand($artists)];
	
	//echo 'artist: '.$random_artist.'<br />';
	$result['artist'] = $random_artist;
	
	// get the discography for that artist
	$artist_call = $lyrics_api.'?fmt=xml&artist='.urlencode($random_artist);
	
	$artist_xml = simplexml_load_file($artist_call);
	
	if (!$artist_xml) {
		return false;
	}
	
	// pick an album
	$albums_item = $artist_xml->albums;
	$allsongs = array();
	foreach ($albums_item->children() as $what=>$albumitem) {
		if ($what == 'songs') {
			foreach ($albumitem->item as $songtitle) {
				$allsongs[] = ''.$songtitle[0].'';
			}
		}
	}
	
	// pick a song
	$random_song = $allsongs[array_rand($allsongs)];
	
	$result['song'] = $random_song;
	
	// get the lyrics
	$song_call = $lyrics_api.'?fmt=xml&artist='.urlencode($random_artist).'&song='.urlencode($random_song);
	$song_xml = simplexml_load_file($song_call);
	
	if (!$song_xml) {
		return false;
	}
	
	$thelyrics = $song_xml->lyrics;
	
	$lyrics_lines = explode("\n", $thelyrics);
	
	// pick a line
	// check for $lyrics_lines[0] == "Instrumental" or "Not found"
	// only use it if there's more than 1 line
	// don't use a blank line
	
	if (count($lyrics_lines) < 2 || $lyrics_lines[0] == 'Instrumental' || $lyrics_lines[0] == 'Not found') {
		return false;
	} else {
		unset($lyrics_lines[count($lyrics_lines)-1]);
		//print_r($lyrics_lines);
		$theline = trim($lyrics_lines[array_rand($lyrics_lines)]);
		$theline = str_replace(array('>', '<', '`', "\n", "\r", "\r\n", "\n\r", "\t"), '', $theline);
		if ($theline == '') {
			return false;
		}
		$result['line'] = $theline;
		return $result;
	}
}

while (!is_array($thelyric)) {
	$thelyric = getLyric();
}

echo json_encode($thelyric);

error_reporting(1);

?>