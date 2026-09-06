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

if ($requestId === "") {
    echo json_encode(["status" => "error", "message" => "Request ID is required"]);
    exit();
}

try {
    $request = $db->bookRequests->findOne([
        "_id" => new MongoDB\BSON\ObjectId($requestId),
        "status" => "Pending",
        "type" => "Issue"
    ]);

    if (!$request) {
        echo json_encode(["status" => "error", "message" => "Pending book request not found"]);
        exit();
    }

    $bookObjectId = new MongoDB\BSON\ObjectId($request["bookId"]);
    $book = $db->books->findOne(["_id" => $bookObjectId]);
    if (!$book || (int)($book["quantity"] ?? 0) <= 0) {
        echo json_encode(["status" => "error", "message" => "Book is no longer available"]);
        exit();
    }

    $db->issuedBooks->insertOne([
        "studentId" => $request["studentId"],
        "studentName" => $request["studentName"],
        "bookId" => $request["bookId"],
        "bookTitle" => $request["bookTitle"],
        "issueDate" => date("Y-m-d"),
        "returnDate" => $request["returnDate"],
        "status" => "Issued",
        "createdAt" => date("Y-m-d H:i:s")
    ]);

    $quantityUpdate = $db->books->updateOne(
        ["_id" => $bookObjectId, "quantity" => ['$gt' => 0]],
        ['$inc' => ["quantity" => -1]]
    );

    if ($quantityUpdate->getModifiedCount() === 0) {
        echo json_encode(["status" => "error", "message" => "Book quantity could not be updated"]);
        exit();
    }

    $db->bookRequests->updateOne(
        ["_id" => new MongoDB\BSON\ObjectId($requestId)],
        ['$set' => ["status" => "Approved", "processedAt" => date("Y-m-d H:i:s")]]
    );

    echo json_encode(["status" => "success", "message" => "Book request approved and book issued"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
