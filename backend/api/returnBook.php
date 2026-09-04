<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? "";

if (empty($id)) {
    echo json_encode([
        "status" => "error",
        "message" => "Issued Book ID is required"
    ]);
    exit;
}

try {

    $issuedBook = $db->issuedBooks->findOne([
        "_id" => new MongoDB\BSON\ObjectId($id)
    ]);

    if (!$issuedBook) {
        echo json_encode([
            "status" => "error",
            "message" => "Issued book not found"
        ]);
        exit;
    }

    if ($issuedBook->status === "Returned") {
        echo json_encode([
            "status" => "error",
            "message" => "Book is already returned"
        ]);
        exit;
    }

    $bookObjectId = new MongoDB\BSON\ObjectId($issuedBook->bookId);

    $today = date("Y-m-d");

    $dueDate = new DateTime($issuedBook->returnDate);
    $actualReturnDate = new DateTime($today);

    $lateDays = 0;

    if ($actualReturnDate > $dueDate) {
        $difference = $dueDate->diff($actualReturnDate);
        $lateDays = $difference->days;
    }

    $fine = $lateDays * 10;

    $bookResult = $db->books->updateOne(
        [
            "_id" => $bookObjectId
        ],
        [
            '$inc' => [
                "quantity" => 1
            ]
        ]
    );

    if ($bookResult->getModifiedCount() === 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Book quantity could not be updated"
        ]);
        exit;
    }

    $db->issuedBooks->updateOne(
        [
            "_id" => new MongoDB\BSON\ObjectId($id)
        ],
        [
            '$set' => [
                "status" => "Returned",
                "actualReturnDate" => $today,
                "lateDays" => $lateDays,
                "fine" => $fine,
                "fineStatus" => $fine > 0 ? "Unpaid" : "Paid",
                "paidDate" => ""
            ]
        ]
    );

    echo json_encode([
        "status" => "success",
        "message" => "Book Returned Successfully",
        "actualReturnDate" => $today,
        "lateDays" => $lateDays,
        "fine" => $fine
    ]);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>