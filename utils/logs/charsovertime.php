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
table th {
	border-bottom: 1px solid #999;
}
table td {
	border-bottom: 1px solid #ccc;
}
#chars {
	display: none;
}
</style>
<!-- <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>-->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
<script type="text/javascript" src="visualize.jQuery.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	$('#charsbyday').visualize({type: 'line', width: 1500, height: 500, lineWeight: 1, colors: ['#ffffff','#ff0000','#009977','#92d5ea','#ee8310','#8d10ee','#5a3b16','#26a4ed','#f45a90','#e9e744', '#ee6600', '#773300']}).appendTo('#chart').trigger('visualizeRefresh');
});
</script>
</head>
<body>
<?php

echo '<h1>character count by day on #ac</h1>';
echo '<h2>brought to you by cylebot</h2>';

$logfilepath = '/node/logs/cylebot_chat.log';

$logfile = file_get_contents($logfilepath);

$lines = explode("\n", $logfile);

echo '<p>tracking since ' . substr($lines[0], 0, 19) . ', ';

//echo '<pre>'.print_r($lines, true).'</pre>';

$people = array();

$counter = 0;

$cyle_aliases = array('death', 'megatron', 'unicron', 'nope');
$zoe_aliases = array('zoedesk', 'zo3', 'zomg', 'zo3desk', 'zo3desk', 'zoemgr', 'zoepennsylvania', 'zoedeskmgr');
$paula_aliases = array('paulalala', 'paulaaa', 'puala', 'paulala', 'paulalalala', 'bombshellin', 'paula2');
$andrea_aliases = array('shea');
$hana_aliases = array('hanamena');
$thea_aliases = array('theahd', 'theaaa');

foreach ($lines as $line) {
	if (preg_match('/(\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}) (\[(\w+)\]) (.*)/i', $line, $matches)) {
		//echo '<pre>'.print_r($matches, true).'</pre>';
		$when = substr($matches[1], 0, 10);
		$username = strtolower($matches[3]);
		if (strpos($username, '_') !== false) {
			$username_pieces = explode('_', $username);
			$username = $username_pieces[0];
		}
		if (in_array($username, $cyle_aliases)) {
			$username = 'cyle';
		} else if (in_array($username, $zoe_aliases)) {
			$username = 'zoe';
		} else if (in_array($username, $paula_aliases)) {
			$username = 'paula';
		} else if (in_array($username, $andrea_aliases)) {
			$username = 'andrea';
		} else if (in_array($username, $hana_aliases)) {
			$username = 'hana';
		} else if (in_array($username, $thea_aliases)) {
			$username = 'thea';
		}
		$people[$username][$when] += strlen($matches[4]);
		$counter++;
	}
	unset($matches);
}

unset($line, $lines);

echo 'dealt with '.number_format($counter).' lines so far, updating as chat rolls on...</p>';

arsort($people);

//echo '<pre>'.print_r($people, true).'</pre>';

?>
<div id="chart"></div>

<table id="charsbyday">
<caption>Character Counts by Day</caption>
<thead>
<td></td>
<?php

$days = array();

foreach ($people['cylebot'] as $date => $count) {
	echo '<th scope="col">'.$date.'</th>';
	$days[] = $date;
}
?>
</thead>
<tbody>
<?php
$counter = 0;
foreach ($people as $person => $dates) {
	if ($counter > 7) {
		break;
	}
	$counter++;
	echo '<tr>';
	echo '<th scope="row">'.$person.'</th>';
	foreach ($days as $date) {
		echo '<td>';
		if (isset($dates[$date])) {
			echo $dates[$date];
		} else {
			echo '0';
		}
		echo '</td>';
	}
	echo '</tr>';
}
?>
</tbody>
</table>

</body>
</html>