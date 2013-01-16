<?php

if (!isset($_GET['i']) || trim($_GET['i']) == '') {
	die('need an object id');
}

$what = new MongoId(trim($_GET['i']));

$m = new Mongo();
$db = $m->poetry;
$poems = $db->poems;

$poems->remove(array('_id'=>$what));

header('Location: index.php');

?>