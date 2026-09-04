<?php

require __DIR__ . '/../vendor/autoload.php';

try {
    // 1. Local MongoDB connection (Default Port 27017)
    $client = new MongoDB\Client("mongodb://localhost:27017");

    // 2. Compass mein jo database hai usse connect kar rahe hain
    $db = $client->librarymanagement;
} catch (Exception $e) {
    die("Database Connection Error: " . $e->getMessage());
}
