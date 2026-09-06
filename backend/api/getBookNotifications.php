<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "../config/db.php";
$studentId = trim($_GET["studentId"] ?? "");

if ($studentId === "") {
    echo json_encode([]);
    exit();
}

try {
    $notifications = $db->bookRequests->find(
        [
            "studentId" => $studentId,
            "status" => "Rejected"
        ],
        ["sort" => ["processedAt" => -1]]
    );
    $data = [];

    foreach ($notifications as $notification) {
        $data[] = [
            "_id" => (string)$notification["_id"],
            "bookTitle" => $notification["bookTitle"] ?? "",
            "status" => $notification["status"] ?? "Rejected",
            "rejectionReason" => $notification["rejectionReason"] ?? "No reason provided",
            "processedAt" => $notification["processedAt"] ?? ""
        ];
    }

    echo json_encode($data);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
