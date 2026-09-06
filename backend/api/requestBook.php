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
$studentId = trim($data["studentId"] ?? "");
$bookId = trim($data["bookId"] ?? "");
$returnDate = trim($data["returnDate"] ?? "");

if ($studentId === "" || $bookId === "" || $returnDate === "") {
    echo json_encode(["status" => "error", "message" => "Student, book and due date are required"]);
    exit();
}

try {
    $student = $db->students->findOne(["_id" => new MongoDB\BSON\ObjectId($studentId)]);
    $approvedUser = $db->users->findOne([
        "studentId" => $studentId,
        "role" => "student",
        "status" => "approved"
    ]);
    if (!$student || (!$approvedUser && ($student["status"] ?? "") !== "approved")) {
        echo json_encode(["status" => "error", "message" => "Student account is not approved"]);
        exit();
    }

    $book = $db->books->findOne(["_id" => new MongoDB\BSON\ObjectId($bookId)]);
    if (!$book || (int)($book["quantity"] ?? 0) <= 0) {
        echo json_encode(["status" => "error", "message" => "Book is not available"]);
        exit();
    }

    $activeIssue = $db->issuedBooks->findOne([
        "studentId" => $studentId,
        "bookId" => $bookId,
        "status" => "Issued"
    ]);
    $pendingRequest = $db->bookRequests->findOne([
        "studentId" => $studentId,
        "bookId" => $bookId,
        "type" => "Issue",
        "status" => "Pending"
    ]);

    if ($activeIssue || $pendingRequest) {
        echo json_encode(["status" => "error", "message" => "This book is already issued or requested"]);
        exit();
    }

    $db->bookRequests->insertOne([
        "type" => "Issue",
        "studentId" => $studentId,
        "studentName" => $student["name"] ?? "",
        "bookId" => $bookId,
        "bookTitle" => $book["title"] ?? "",
        "returnDate" => $returnDate,
        "status" => "Pending",
        "createdAt" => date("Y-m-d H:i:s")
    ]);

    echo json_encode(["status" => "success", "message" => "Book request sent to admin for approval"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Unable to send book request: " . $e->getMessage()]);
}
