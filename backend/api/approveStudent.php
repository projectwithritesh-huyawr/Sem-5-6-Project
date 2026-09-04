<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$userId = $data["userId"] ?? "";

if (empty($userId)) {

    echo json_encode([
        "status" => "error",
        "message" => "User ID is required"
    ]);

    exit();
}

try {

    $objectId = new MongoDB\BSON\ObjectId($userId);

    $result = $db->users->updateOne(
        [
            "_id" => $objectId,
            "role" => "student"
        ],
        [
            '$set' => [
                "status" => "approved"
            ]
        ]
    );

    if ($result->getModifiedCount() > 0) {

        echo json_encode([
            "status" => "success",
            "message" => "Student approved successfully"
        ]);

    } else {

        echo json_encode([
            "status" => "error",
            "message" => "Student could not be approved"
        ]);
    }

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>