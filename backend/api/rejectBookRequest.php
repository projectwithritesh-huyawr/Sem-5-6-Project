<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/db.php";
$data = json_decode(file_get_contents("php://input"), true);
$requestId = trim($data["requestId"] ?? "");
$rejectionReason = trim($data["rejectionReason"] ?? "");

if ($requestId === "") {
    echo json_encode(["status" => "error", "message" => "Request ID is required"]);
    exit();
}

if ($rejectionReason === "") {
    echo json_encode(["status" => "error", "message" => "Rejection reason is required"]);
    exit();
}

try {
    $result = $db->bookRequests->updateOne(
        ["_id" => new MongoDB\BSON\ObjectId($requestId), "status" => "Pending"],
        ['$set' => [
            "status" => "Rejected",
            "rejectionReason" => $rejectionReason,
            "processedAt" => date("Y-m-d H:i:s")
        ]]
    );

    echo json_encode($result->getModifiedCount() > 0
        ? ["status" => "success", "message" => "Book request rejected"]
        : ["status" => "error", "message" => "Pending book request not found"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
