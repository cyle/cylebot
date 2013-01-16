<?php

//echo '<pre>'.print_r($_POST, true).'</pre>';
//die();

if (!isset($_POST['a']) || trim($_POST['a']) == '') {
	die('need an author name!');
}

if (!isset($_POST['t']) || trim($_POST['t']) == '') {
	die('need a title!');
}

if (!isset($_POST['p']) || trim($_POST['p']) == '') {
	die('need a poem!');
}

function convert_smart_quotes($string) { 
    $search = array(chr(145), 
                    chr(146), 
                    chr(147), 
                    chr(148), 
                    chr(151)); 
 
    $replace = array("'", 
                     "'", 
                     '"', 
                     '"', 
                     '-'); 
 
    return str_replace($search, $replace, $string); 
} 

$m = new Mongo();
$db = $m->poetry;
$poems = $db->poems;

$poem_content = utf8_encode(str_ireplace(array("\r\n", "\n\r", "\r", '<br />', '<br>'), "\n", convert_smart_quotes(trim($_POST['p']))));
$poem_title = trim($_POST['t']);
$poem_author = trim($_POST['a']);

$poems->insert(array('title' => $poem_title, 'author' => $poem_author, 'poem' => $poem_content));

header('Location: index.php');

?>