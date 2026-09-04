<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "../config/db.php";

try {

    $students = $db->students->find();

    $data = [];

    foreach ($students as $student) {

        $data[] = [
            "_id" => (string)$student["_id"],
            "name" => $student["name"] ?? "",
            "email" => $student["email"] ?? "",
            "course" => $student["course"] ?? "",
            "year" => $student["year"] ?? ""
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