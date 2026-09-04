<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$username = trim($data["username"] ?? "");
$email = trim($data["email"] ?? "");
$course = trim($data["course"] ?? "");
$year = trim($data["year"] ?? "");
$password = trim($data["password"] ?? "");

if (
    $name === "" ||
    $username === "" ||
    $email === "" ||
    $course === "" ||
    $year === "" ||
    $password === ""
) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);

    exit();
}

try {

    $existingUser = $db->users->findOne([
        "username" => $username
    ]);

    if ($existingUser) {
        echo json_encode([
            "success" => false,
            "message" => "Username already exists"
        ]);

        exit();
    }

    $existingEmail = $db->users->findOne([
        "email" => $email
    ]);

    if ($existingEmail) {
        echo json_encode([
            "success" => false,
            "message" => "Email already exists"
        ]);

        exit();
    }

    $studentResult = $db->students->insertOne([
        "name" => $name,
        "email" => $email,
        "course" => $course,
        "year" => $year,
        "status" => "pending"
    ]);

    $studentId = $studentResult->getInsertedId();

    $db->users->insertOne([
        "name" => $name,
        "username" => $username,
        "email" => $email,
        "password" => password_hash($password, PASSWORD_DEFAULT),
        "role" => "student",
        "studentId" => (string)$studentId,
        "status" => "pending"
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Registration successful. Please wait for admin approval."
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>