<!DOCTYPE html>
<html>
<head>
<title>certain words count</title>
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
</style>
<!-- <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>-->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
<script type="text/javascript" src="visualize.jQuery.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	$('#words').visualize({type: 'bar', width: 1000, height: 400, colors: ['#be1e2d','#666699','#92d5ea','#ee8310','#8d10ee','#5a3b16','#26a4ed','#f45a90','#e9e744', '#ee6600', '#773300']}).appendTo('#chart').trigger('visualizeRefresh');
});
</script>
</head>
<body>
<?php

echo '<h1>certain words on #ac</h1>';
echo '<h2>brought to you by cylebot</h2>';

$logfilepath = '/node/logs/cylebot_chat.log';

$logfile = file_get_contents($logfilepath);

$lines = explode("\n", $logfile);

echo '<p>tracking since ' . substr($lines[0], 0, 19) . ', updating as chat rolls on...</p>';

$swears = array('/fuck/i', '/shit/i', '/\bass(hole)?\b/i', '/lol/i', '/welp/i', '/poopfarts/i', '/bitch/i', '/rudeass/i', '/yes/i', '/nope/i');

?>
<div id="chart"></div>

<table id="words">
<caption>Certain Words</caption>
<thead>
<tr><td></td><th>count</th></tr>
</thead>
<tbody>
<tr><th>--</th><td>0</td></tr>
<?php
foreach ($swears as $swear) {
	$howmany = preg_match_all($swear, $logfile, $matches);
	echo '<tr><th>'.htmlentities($swear).'</th><td>'.$howmany.'</td></tr>';
}
?>
</tbody>
</table>

</body>
</html>