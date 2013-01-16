<?php

// show current poems

// add new poem

/*

poem:
	title, author, and text

*/

$m = new Mongo();
$db = $m->poetry;
$poems = $db->poems;

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
form > div {
	margin-bottom: 5px;
}
label {
	display: block;
	width: 75px;
	float: left;
}
input, textarea {
	padding: 3px;
	width: 300px;
}
input[type='submit'] {
	width: 100px;
}
textarea {
	height: 400px;
}
</style>
</head>
<body>
<div><h1>poetry</h1></div>
<div><p><?php echo $poems->count(); ?> so far</p></div>
<div>
<?php
$cursor = $poems->find();
foreach ($cursor as $poem) {
	echo '<li><i><a href="poem.php?i='.$poem['_id'].'">'.$poem['title'].'</a></i> by '.$poem['author'].' (<a href="delete.php?i='.$poem['_id'].'" onclick="return confirm(\'you sure?\')">delete</a>)</li>';
}
?>
</div>
<div>
<form method="post" action="add.php">
<div><label>title:</label><input type="text" name="t" /></div>
<div><label>author:</label><input type="text" name="a" /></div>
<div><label>poem:</label><textarea name="p"></textarea></div>
<div><input type="submit" value="add" /></div>
</form>
</div>
</body>
</html>

