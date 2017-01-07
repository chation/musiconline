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

$user_id = trim($_GET['user_id']);
$user_pass = $_GET['user_pass'];

$sql="SELECT * FROM `user` WHERE `user_id` = '".$user_id."' ";
$result=$conn -> query($sql);
$row = $result -> fetch_row();

if($row[0]==""||$user_pass!=$row[2]){
    echo "0";
}else{
    $test = $row[0].'|'.$row[1].'|'.$row[2].'|'.$row[3].'|'.$row[4];
    echo $test;
}

?>