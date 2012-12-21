<?php
$inputdata = fopen("php://input", "r");
$s = "";
$k = 0;
while ($data = fread($inputdata, 1024)) {
	$s .= $data;
	$k++;
	if ($k == 20) {
		header("HTTP/1.0 403 Forbidden");
		exit();
	}
}
fclose($inputdata);
$r = "";
for ($i = 0; $i < strlen($s);) {
	$c = ord($s[$i]);
	if ($c < 128) {
		$r .= chr($c);
		$i++;
	} else {
		if(($c > 191) && ($c < 224)) {
			$r .= chr((($c & 31) << 6) | (ord($s[$i+1]) & 63));
			$i += 2;
		} else {
			$r .= chr((($c & 15) << 12) | ((ord($s[$i+1]) & 63) << 6) | (ord($s[$i+2]) & 63));
			$i += 3;
		}
	}
}
$dir = opendir("c:/www/zip");
$files = array();
while ($file = readdir($dir)) {
	if ($file != "." && $file !="..") {
		$files[filemtime($file)] = $file;
	}
}
closedir($dir);
krsort($files);
$fnum = 0;
foreach($files as $file) {
	if ($fnum > 10) {
		unlink($file);
	}
	$fnum++;
}
$param = array();
parse_str($_SERVER['QUERY_STRING'], $param);
$sname = uniqid()."-".$param['filename'];
$name = "/zip/".$sname;
$outputdata = fopen("c:/www".$name, "w");
fwrite($outputdata, $r);
fclose($outputdata);
?>
<html>
	<body>
		<p>Thank you for posting a file which has been named "<?php echo $sname; ?>"</p>
		<a href="<?php echo $name; ?>">Your file</a>
	</body>
</html>