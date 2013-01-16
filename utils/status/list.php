<?php

// list items in a collection

// delete items from collection

// add new items to collection

if (!isset($_GET['w']) || trim($_GET['w']) == '') {
	header('Location: index.php');
}

$collection_name = strtolower(trim($_GET['w']));

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

?>
<html>
<head>
<title>oh lawds</title>
</head>
<body>

<div><a href="index.php">go back</a></div>

<div>

<h1>collection: <?php echo $collection->getName(); ?></h1>

<p><?php echo $collection->count(); ?> so far</p>

<?php
switch ($collection_name) {
	case 'books':
	case 'movies':
	echo '<p>just names, plz</p>';
	break;
	case 'adverbs':
	case 'adjectives':
	echo '<p>as it sounds, yeah</p>';
	break;
	case 'links':
	case 'statuses':
	echo '<p>keep it funny please, or serious.</p>';
	break;
	case 'endings':
	echo '<p>these have a chance to go at the end of any status update. keep it classy, please.</p>';
	break;
	case 'book_remarks':
	case 'movie_remarks':
	echo '<p>these go directly after a title, so they have to include any punctuation. read through to see examples.</p>';
	break;
}
?>

<ul>
<?php
$cursor = $collection->find();
foreach ($cursor as $item) {
	echo '<li>'.$item['name'].' (<a href="delete.php?c='.$collection_name.'&i='.$item['_id'].'" onclick="return confirm(\'you sure?\')">delete</a>)</li>';
}
?>
</ul>

<div>
<form action="add.php" method="post">
<input type="hidden" name="c" value="<?php echo $collection_name; ?>" />
<input type="text" name="t" /> <input type="submit" value="add!" />
</form>
</div>

</div>
</body>
</html>