<?php

if(isset($_POST['inputfile'])){
//    $inputfile = urldecode($_POST['inputfile']); 
 $inputfile = $_POST['inputfile']; 

 }
if(isset($_POST['sheet'])){
    $sheet = $_POST['sheet'];

}

//cURL is used call the grlc.io api endpoint, as load/load_from_file did not produce the desired results.
$ch = curl_init();
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); //Allows cURL to follow links
curl_setopt($ch, CURLOPT_HTTPGET, true); //Calls api endpoint with get request
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); //Returns the result of the api call

//Headers specifying the desired filetypes
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/xml',
    'Accept: application/xml'
));

curl_setopt($ch, CURLOPT_URL, $inputfile); //Desired url for cURL
$response = curl_exec($ch); //Execute cURL command and save response
curl_close($ch); //Close cURL instance

// Load XML file
$xml = new DOMDocument;
$xml->loadXML($response);
//$xml->load('http://grlc.io/api/digst/classification/Classifications');

// Load XSL file
$xsl = new DOMDocument;
$xsl->load($sheet);
//$xsl->load('trans1.xsl.xml');





// Configure the transformer
$proc = new XSLTProcessor;

// Attach the xsl rules
$proc->importStyleSheet($xsl);

echo $proc->transformToXML($xml);
?>
