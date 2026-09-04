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
$username = trim($data["username"] ?? "");
$currentPassword = trim($data["currentPassword"] ?? "");
$newPassword = trim($data["newPassword"] ?? "");

if ($username === "" || $currentPassword === "" || $newPassword === "") {
    echo json_encode([
        "status" => "error",
        "message" => "All password fields are required"
    ]);
    exit();
}

if (strlen($newPassword) < 6) {
    echo json_encode([
        "status" => "error",
        "message" => "New password must be at least 6 characters"
    ]);
    exit();
}

try {
    $user = $db->users->findOne([
        "username" => $username
    ]);

    $storedPassword = $user["password"] ?? "";
    $passwordMatches = $user && (
        password_verify($currentPassword, $storedPassword) ||
        hash_equals($storedPassword, $currentPassword)
    );

    if (!$passwordMatches) {
        echo json_encode([
            "status" => "error",
            "message" => "Current password is incorrect"
        ]);
        exit();
    }

    $db->users->updateOne(
        ["_id" => $user["_id"]],
        ["$set" => ["password" => password_hash($newPassword, PASSWORD_DEFAULT)]]
    );

    echo json_encode([
        "status" => "success",
        "message" => "Password changed successfully"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to change password"
    ]);
}

?>