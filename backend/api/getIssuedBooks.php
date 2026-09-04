<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

try {

    $issuedBooks = $db->issuedBooks->find();

    $data = [];

    $finePerDay = 10;
    $today = new DateTime();

    foreach ($issuedBooks as $book) {

        $returnDate = $book->returnDate ?? "";
        $status = $book->status ?? "Issued";

        $lateDays = 0;
        $fine = 0;
        $displayStatus = $status;

        /*
        =========================================
        CHECK OVERDUE
        =========================================
        */

        if ($status === "Issued" && !empty($returnDate)) {

            $dueDate = new DateTime($returnDate);

            // Date comparison only
            $todayDate = new DateTime($today->format("Y-m-d"));
            $dueDateOnly = new DateTime($dueDate->format("Y-m-d"));

            if ($todayDate > $dueDateOnly) {

                $difference = $dueDateOnly->diff($todayDate);

                $lateDays = $difference->days;

                $fine = $lateDays * $finePerDay;

                // IMPORTANT:
                // Database status remains "Issued"
                // Only display status becomes "Overdue"

                $displayStatus = "Overdue";

            } else {

                $lateDays = 0;
                $fine = 0;
                $displayStatus = "Issued";
            }

        } else {

            // Returned book
            $lateDays = $book->lateDays ?? 0;
            $fine = $book->fine ?? 0;

            if ($status === "Returned") {
                $displayStatus = "Returned";
            }
        }


        /*
        =========================================
        SEND DATA
        =========================================
        */

        $data[] = [

            "_id" => (string)$book->_id,

            "studentId" => $book->studentId ?? "",

            "studentName" => $book->studentName ?? "",

            "bookId" => $book->bookId ?? "",

            "bookTitle" => $book->bookTitle ?? "",

            "issueDate" => $book->issueDate ?? "",

            "returnDate" => $returnDate,

            "actualReturnDate" => $book->actualReturnDate ?? "",

            "lateDays" => $lateDays,

            "fine" => $fine,

            "fineStatus" => $book->fineStatus ?? "Unpaid",

            "paidDate" => $book->paidDate ?? "",

            // Original database status
            "status" => $status,

            // Calculated display status
            "displayStatus" => $displayStatus
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