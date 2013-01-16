<?php

//print_r($_POST);

if (!isset($_POST['c']) || trim($_POST['c']) == '') {
	die('need a collection name!');
}

if (!isset($_POST['t']) || trim($_POST['t']) == '') {
	die('need something to add!');
}

$collection_name = strtolower(trim($_POST['c']));
$whattoadd = $_POST['t'];

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

$collection->insert(array('name'=>$whattoadd));

header('Location: list.php?w='.$collection_name);

?>