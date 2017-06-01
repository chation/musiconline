<?php
//引入方法库，用于DOM
include_once 'simple_html_dom.php';

$html = new simple_html_dom();

$html -> load_file('https://www.zhihu.com/question/34243513');
$re = $html -> find('img.content_image');
//echo $re[0]->src;
//var_dump($re);
foreach ($html -> find('.content_image') as $i){
    echo '<img src="'.$i -> src.'"/>';

}