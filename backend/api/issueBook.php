<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$studentId = $data["studentId"] ?? "";
$bookId = $data["bookId"] ?? "";
$issueDate = $data["issueDate"] ?? "";
$returnDate = $data["returnDate"] ?? "";

if (empty($studentId) || empty($bookId)) {
    echo json_encode([
        "status" => "error",
        "message" => "Student ID and Book ID are required"
    ]);
    exit;
}

if (empty($issueDate) || empty($returnDate)) {
    echo json_encode([
        "status" => "error",
        "message" => "Issue Date and Return Date are required"
    ]);
    exit;
}

try {
    $studentObjectId = new MongoDB\BSON\ObjectId($studentId);
    $bookObjectId = new MongoDB\BSON\ObjectId($bookId);

    // 1. Student check
    $student = $db->students->findOne([
        "_id" => $studentObjectId
    ]);

    if (!$student) {
        echo json_encode([
            "status" => "error",
            "message" => "Student not found"
        ]);
        exit;
    }

    // 2. Book check
    $book = $db->books->findOne([
        "_id" => $bookObjectId
    ]);

    if (!$book) {
        echo json_encode([
            "status" => "error",
            "message" => "Book not found"
        ]);
        exit;
    }

    // 3. Quantity check (Integer Typecast added)
    $currentQuantity = isset($book["quantity"]) ? (int)$book["quantity"] : 0;

    if ($currentQuantity <= 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Book is not available (Out of stock)"
        ]);
        exit;
    }

    // 4. Already issued check
    $alreadyIssued = $db->issuedBooks->findOne([
        "studentId" => $studentId,
        "bookId" => $bookId,
        "status" => "Issued"
    ]);

    if ($alreadyIssued) {
        echo json_encode([
            "status" => "error",
            "message" => "You have already issued this book"
        ]);
        exit;
    }

    // 5. Add issued book record
    $insertResult = $db->issuedBooks->insertOne([
        "studentId" => $studentId,
        "studentName" => $student["name"] ?? "",
        "bookId" => $bookId,
        "bookTitle" => $book["title"] ?? ($book["name"] ?? ""),
        "issueDate" => $issueDate,
        "returnDate" => $returnDate,
        "status" => "Issued",
        "createdAt" => date("Y-m-d H:i:s")
    ]);

    // 6. Quantity decrease ($inc requires numeric field)
    $updateResult = $db->books->updateOne(
        ["_id" => $bookObjectId],
        ['$inc' => ["quantity" => -1]]
    );

    if ($updateResult->getModifiedCount() > 0) {
        echo json_encode([
            "status" => "success",
            "message" => "Book Issued Successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Book quantity could not be updated in Database"
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Server Error: " . $e->getMessage()
    ]);
}
