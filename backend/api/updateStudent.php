<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["_id"] ?? "";
$name = $data["name"] ?? "";
$email = $data["email"] ?? "";
$course = $data["course"] ?? "";
$year = $data["year"] ?? "";

$db->students->updateOne(
    ["_id" => new MongoDB\BSON\ObjectId($id)],
    [
        '$set' => [
            "name" => $name,
            "email" => $email,
            "course" => $course,
            "year" => $year
        ]
    ]
);

echo json_encode([
    "status" => "success",
    "message" => "Student Updated Successfully"
]);

?>