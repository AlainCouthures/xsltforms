<?php
$inputdata = fopen("php://input", "r");
$s = "";
while ($data = fread($inputdata, 1024)) {
	$s .= $data;
}
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
header("Content-Type: application/octet-stream");
header("Content-Disposition: attachment; filename=\"myfile.zip\"");
header("Content-Length: ".strlen($r));
echo $r;
?>