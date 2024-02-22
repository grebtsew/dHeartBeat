<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow all HTTP methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Allow credentials (if needed)
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

header("Content-Type: application/json");


$url = $_GET['url'];

// Determine the HTTP method used by the client
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Determine the URL based on the client's request
if ($requestMethod == 'POST' || $requestMethod == 'PUT') {
    // For POST and PUT requests, use the request body to determine the URL
    $data = file_get_contents('php://input');
    $options = [
        'http' => [
            'method' => $requestMethod,
            'header' => "Content-Type: application/json\r\n" .
                        "Access-Control-Allow-Origin: *\r\n" .
                        "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept\r\n" .
                        "Access-Control-Allow-Credentials: true",
            'content' =>  $data,
        ]
    ];
    // Create a stream context with CORS headers


// Create a stream context
$context = stream_context_create($options);

// Fetch the content of the URL using the same HTTP method as the client
$content = @file_get_contents($url, false, $context);
} else {
 
    $content = @file_get_contents($url);
}

// Check for errors in fetching content
if ($content === false) {
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(['error' => 'Error fetching content']);
    exit;
}

// Get all headers from the original request
$headers = getallheaders();

// Print debug information
echo json_encode(['headers' => $headers, 'content' => $content]);
?>
