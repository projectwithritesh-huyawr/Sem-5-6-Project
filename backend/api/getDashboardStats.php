<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

try {

    // Total books
    $totalBooks = $db->books->countDocuments();

    // Total students
    $totalStudents = $db->students->countDocuments();

    // Issued books
    $issuedBooks = $db->issuedBooks->countDocuments([
        "status" => "Issued"
    ]);

    // Returned books
    $returnedBooks = $db->issuedBooks->countDocuments([
        "status" => "Returned"
    ]);

    // Recent activity
    $recentCursor = $db->issuedBooks->find(
        [],
        [
            "sort" => [
                "_id" => -1
            ],
            "limit" => 5
        ]
    );

    $recentActivity = [];

    foreach ($recentCursor as $book) {

        $recentActivity[] = [
            "studentName" => $book->studentName ?? "",
            "bookTitle" => $book->bookTitle ?? "",
            "status" => $book->status ?? "",
            "date" => $book->issueDate ?? ""
        ];
    }

    echo json_encode([
        "status" => "success",
        "totalBooks" => $totalBooks,
        "totalStudents" => $totalStudents,
        "issuedBooks" => $issuedBooks,
        "returnedBooks" => $returnedBooks,
        "recentActivity" => $recentActivity
    ]);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>