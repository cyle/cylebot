<?php

if (!isset($_GET['i']) || trim($_GET['i']) == '') {
	die('no ID provided');
}

$m = new Mongo();
$db = $m->poetry;
$poems = $db->poems;

$id = new MongoId(trim($_GET['i']));

$poem = $poems->findOne(array('_id' => $id));

//print_r($poem);

?>
<!DOCTYPE html>
<html>
<head>
<title>poetry</title>
<style type="text/css">
* {
	padding: 0;
	margin: 0;
}
body > div {
	margin: 20px;
}
</style>
</head>
<body>
<div><a href="index.php">back</a></div>
<div><h1><i><?php echo $poem['title']; ?></i> by <?php echo $poem['author']; ?></h1></div>
<div><?php echo str_replace("\n", '<br />', $poem['poem']); ?></div>
</body>
</html>