<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

try {

    $users = $db->users->find([
        "role" => "student",
        "status" => "rejected"
    ]);

    $data = [];

    foreach ($users as $user) {

        $data[] = [
            "_id" => (string)$user["_id"],
            "name" => $user["name"] ?? "",
            "username" => $user["username"] ?? "",
            "email" => $user["email"] ?? "",
            "status" => $user["status"] ?? ""
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