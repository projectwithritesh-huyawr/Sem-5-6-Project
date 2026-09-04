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
$password = trim($data["password"] ?? "");

if ($username === "" || $password === "") {

    echo json_encode([
        "status" => "error",
        "message" => "Username and Password are required"
    ]);

    exit();
}

try {

    $user = $db->users->findOne([
        "username" => $username
    ]);

    $storedPassword = $user["password"] ?? "";
    $passwordMatches = $user && (
        password_verify($password, $storedPassword) ||
        hash_equals($storedPassword, $password)
    );

    if (!$passwordMatches) {

        echo json_encode([
            "status" => "error",
            "message" => "Invalid Username or Password"
        ]);

        exit();
    }

    if (!password_get_info($storedPassword)["algo"]) {
        $db->users->updateOne(
            ["_id" => $user["_id"]],
            ['$set' => ["password" => password_hash($password, PASSWORD_DEFAULT)]]
        );
    }

    $role = $user["role"] ?? "";

    if ($role === "student") {

        $studentStatus = $user["status"] ?? "pending";

        if ($studentStatus === "pending") {

            echo json_encode([
                "status" => "error",
                "message" => "Your account is waiting for admin approval"
            ]);

            exit();
        }

        if ($studentStatus === "rejected") {

            echo json_encode([
                "status" => "error",
                "message" => "Your student account has been rejected"
            ]);

            exit();
        }

        if ($studentStatus !== "approved") {

            echo json_encode([
                "status" => "error",
                "message" => "Your account is not approved"
            ]);

            exit();
        }
    }

    echo json_encode([
        "status" => "success",
        "message" => "Login Successful",
        "role" => $role,
        "userId" => (string)$user["_id"],
        "studentId" => $user["studentId"] ?? "",
        "username" => $user["username"] ?? ""
    ]);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>