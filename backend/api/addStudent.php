<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data["name"] ?? "";
$email = $data["email"] ?? "";
$course = $data["course"] ?? "";
$year = $data["year"] ?? "";

$db->students->insertOne([
    "name" => $name,
    "email" => $email,
    "course" => $course,
    "year" => $year
]);

echo json_encode([
    "status" => "success",
    "message" => "Student Added Successfully"
]);

?>