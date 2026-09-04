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

$title = trim($data["title"] ?? "");
$author = trim($data["author"] ?? "");
$category = trim($data["category"] ?? "");
$quantity = (int)($data["quantity"] ?? 0);

if (
    $title === "" ||
    $author === "" ||
    $category === "" ||
    $quantity <= 0
) {
    echo json_encode([
        "status" => "error",
        "message" => "Please enter valid book details"
    ]);

    exit();
}

try {

    $result = $db->books->insertOne([
        "title" => $title,
        "author" => $author,
        "category" => $category,

        // Total copies
        "totalQuantity" => $quantity,

        // Currently available copies
        "quantity" => $quantity
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Book Added Successfully"
    ]);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>