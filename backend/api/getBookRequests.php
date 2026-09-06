<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "../config/db.php";

try {
    $requests = $db->bookRequests->find(
        ["status" => "Pending"],
        ["sort" => ["createdAt" => -1]]
    );
    $data = [];

    foreach ($requests as $request) {
        $data[] = [
            "_id" => (string)$request["_id"],
            "type" => $request["type"] ?? "Issue",
            "studentId" => $request["studentId"] ?? "",
            "studentName" => $request["studentName"] ?? "",
            "bookId" => $request["bookId"] ?? "",
            "bookTitle" => $request["bookTitle"] ?? "",
            "returnDate" => $request["returnDate"] ?? "",
            "createdAt" => $request["createdAt"] ?? ""
        ];
    }

    echo json_encode($data);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
