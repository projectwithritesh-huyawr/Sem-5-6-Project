<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "../config/db.php";

try {

    $books = $db->books->find();

    $data = [];

    foreach ($books as $book) {

        $bookId = (string)$book["_id"];

        // Currently issued copies count
        $issuedCount = $db->issuedBooks->countDocuments([
            "bookId" => $bookId,
            "status" => "Issued"
        ]);

        $available = (int)($book["quantity"] ?? 0);

        // Total = Available + Currently Issued
        $total = $available + $issuedCount;

        $data[] = [

            "_id" => $bookId,

            "title" => $book["title"] ?? "",

            "author" => $book["author"] ?? "",

            "category" => $book["category"] ?? "",

            "quantity" => $available,

            "available" => $available,

            "issued" => $issuedCount,

            "totalQuantity" => $total,

            "image" => $book["image"] ?? ""

        ];
    }

    echo json_encode($data);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>