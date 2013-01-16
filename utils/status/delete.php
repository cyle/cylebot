<?php

if (!isset($_GET['c']) || trim($_GET['c']) == '') {
	die('need a collection name!');
}

if (!isset($_GET['i']) || trim($_GET['i']) == '') {
	die('need an object id');
}

$collection_name = strtolower(trim($_GET['c']));
$what = new MongoId(trim($_GET['i']));

$m = new Mongo();
$db = $m->statusbot;

$collections = $db->listCollections();
$existing_collections = array();
foreach ($collections as $collection) {
	$existing_collections[] = $collection->getName();
}
unset($collection);

if (!in_array($collection_name, $existing_collections)) {
	die('dunno about that collection');
}

$collection = $db->selectCollection($collection_name);

$collection->remove(array('_id'=>$what));

header('Location: list.php?w='.$collection_name);

?>