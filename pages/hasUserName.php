<?php
$username='root';
$userpass='q12we3';
$host='127.0.0.1';
$database='music';
$conn=new mysqli($host,$username,$userpass,$database);
if(!$conn){
	echo '-1';
	exit;
}

$name = $_GET['name'];

$sql = "SELECT * FROM `user` WHERE `user_id` LIKE '$name'";

$result = $conn -> query($sql);
$row = $result -> fetch_row();

if($row[0]==""){
    echo "1";
}else {
    echo "0";
}

?>