<?php

// pick a sentence from 
// http://en.wiktionary.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:English_sentences&cmlimit=500

$api_url = 'http://en.wiktionary.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:English_sentences&cmlimit=500&format=json';
$api = curl_init($api_url);

curl_setopt($api, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($api, CURLOPT_USERAGENT, 'cylebot/2.0 (+http://www.cylegage.com/)');

$api_result = curl_exec($api);

$sentences_array = json_decode($api_result, true);

//echo '<pre>'.print_r($sentences_array, true).'</pre>';

$sentences = $sentences_array['query']['categorymembers'];

//echo '<pre>'.print_r($sentences, true).'</pre>';

echo $sentences[array_rand($sentences)]['title'];

?>