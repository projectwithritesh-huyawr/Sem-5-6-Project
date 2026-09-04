<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/db.php";

try {
    $result = $db->issuedBooks->deleteMany([
        "status" => "Returned",
        '$or' => [
            ["fine" => ['$lte' => 0]],
            ["fine" => ['$exists' => false]],
            ["fineStatus" => "Paid"]
        ]
    ]);

    echo json_encode([
        "status" => "success",
        "message" => $result->getDeletedCount() . " returned book history record(s) cleared"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to clear issued books history"
    ]);
}

?>