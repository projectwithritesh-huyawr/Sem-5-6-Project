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

$id = $data["id"] ?? "";

$title = trim($data["title"] ?? "");
$author = trim($data["author"] ?? "");
$category = trim($data["category"] ?? "");

$totalQuantity = (int)($data["quantity"] ?? 0);

if (empty($id)) {

    echo json_encode([
        "status" => "error",
        "message" => "Book ID is required"
    ]);

    exit();
}

if ($totalQuantity <= 0) {

    echo json_encode([
        "status" => "error",
        "message" => "Total quantity must be greater than 0"
    ]);

    exit();
}

try {

    $bookId = new MongoDB\BSON\ObjectId($id);

    // Find existing book
    $book = $db->books->findOne([
        "_id" => $bookId
    ]);

    if (!$book) {

        echo json_encode([
            "status" => "error",
            "message" => "Book not found"
        ]);

        exit();
    }

    /*
    Calculate currently issued books

    Issued = Total - Available
    */

    $oldTotal = (int)($book["totalQuantity"] ?? $book["quantity"] ?? 0);

    $oldAvailable = (int)($book["quantity"] ?? 0);

    $issued = $oldTotal - $oldAvailable;

    if ($issued < 0) {
        $issued = 0;
    }

    /*
    New available quantity

    New Total - Already Issued
    */

    $newAvailable = $totalQuantity - $issued;

    if ($newAvailable < 0) {

        echo json_encode([
            "status" => "error",
            "message" =>
                "Total quantity cannot be less than currently issued books (" .
                $issued .
                ")"
        ]);

        exit();
    }

    $result = $db->books->updateOne(
        [
            "_id" => $bookId
        ],
        [
            '$set' => [

                "title" => $title,

                "author" => $author,

                "category" => $category,

                "totalQuantity" => $totalQuantity,

                "quantity" => $newAvailable
            ]
        ]
    );

    if ($result->getMatchedCount() > 0) {

        echo json_encode([
            "status" => "success",
            "message" => "Book Updated Successfully"
        ]);

    } else {

        echo json_encode([
            "status" => "error",
            "message" => "Book not found"
        ]);
    }

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>