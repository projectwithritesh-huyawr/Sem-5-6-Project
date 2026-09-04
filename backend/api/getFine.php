<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

try {

    $cursor = $db->issuedBooks->find();

    $fines = [];

    foreach ($cursor as $book) {
        $status = $book->status ?? "Issued";
        $returnDate = $book->returnDate ?? "";
        $lateDays = $book->lateDays ?? 0;
        $fine = $book->fine ?? 0;

        // Overdue issued books have not been returned yet, so calculate their
        // current fine without waiting for returnBook.php to persist it.
        if ($status === "Issued" && !empty($returnDate)) {
            $dueDate = new DateTime($returnDate);
            $today = new DateTime(date("Y-m-d"));

            if ($today > $dueDate) {
                $lateDays = $dueDate->diff($today)->days;
                $fine = $lateDays * 10;
            }
        }

        if ($fine <= 0) {
            continue;
        }

        $fines[] = [
            "_id" => (string)$book->_id,
            "studentId" => $book->studentId ?? "",
            "studentName" => $book->studentName ?? "",
            "bookTitle" => $book->bookTitle ?? "",
            "issueDate" => $book->issueDate ?? "",
            "returnDate" => $returnDate,
            "actualReturnDate" => $book->actualReturnDate ?? "",
            "lateDays" => $lateDays,
            "fine" => $fine,
            "fineStatus" => $book->fineStatus ?? "Unpaid",
            "paidDate" => $book->paidDate ?? "",
            "status" => $status
        ];
    }

    echo json_encode([
        "status" => "success",
        "fines" => $fines
    ]);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>