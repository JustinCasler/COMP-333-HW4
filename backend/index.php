<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods:POST,GET,OPTIONS,DELETE");
header("Access-Control-Allow-Credentials: true");

include 'includes/DbConnect.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === "POST") {
    // Parse the incoming JSON data
    $data = json_decode(file_get_contents('php://input'));

    if (isset($data->action)) {
        $action = $data->action;

        switch ($action) {
            case "register":
                register($data);
                break;
            case "login":
                login($data);
                break;
            case "addnew":
                addnew($data);
                break;
            case "update":
                update($data);
                break;
            case "delete":
                delete($data);
                break;
        }
    }
}

if ($method === "GET") {
    $action = $_GET['action'] ?? '';
    $sort_by = $_GET['sort_by'] ?? null; ;
    switch ($action) {
        case "overview":
            loadOverview($sort_by);
            break;
        case "getRating":
            getRating();
            break;
    }
}

function register($data) {
    $objDb = new DbConnect;
    $conn = $objDb->connect();

    // Check if the username already exists
    $checkUsernameQuery = "SELECT * FROM users WHERE username = :username";
    $checkUsernameStmt = $conn->prepare($checkUsernameQuery);
    $checkUsernameStmt->bindParam(':username', $data->inputs->username);
    $checkUsernameStmt->execute();

    if ($checkUsernameStmt->rowCount() > 0) {
        // Username already exists, return an error response
        $response = ['status' => 0, 'message' => 'Username is already taken.'];
        echo json_encode($response);
        return;
    }

    // Hash the password
    $hashedPassword = password_hash($data->inputs->password, PASSWORD_DEFAULT);

    // Username is not taken, proceed with the registration
    $sql = "INSERT INTO users(username, password) VALUES(:username, :password)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':username', $data->inputs->username);
    // Store the hashed password
    $stmt->bindParam(':password', $hashedPassword);

    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'Registration successful.'];
    } else {
        $response = ['status' => 0, 'message' => 'Failed to create record.'];
    }

    echo json_encode($response);
}

function login($data) {
    $objDb = new DbConnect;
    $conn = $objDb->connect();

    // Retrieve the hashed password for the username (case-sensitive)
    $getPasswordQuery = "SELECT password FROM users WHERE BINARY username = :username";
    $getPasswordStmt = $conn->prepare($getPasswordQuery);
    $getPasswordStmt->bindParam(':username', $data->inputs->username);
    $getPasswordStmt->execute();

    if ($getPasswordStmt->rowCount() === 1) {
        $row = $getPasswordStmt->fetch(PDO::FETCH_ASSOC);
        $hashedPassword = $row['password'];

        // Verify the password
        if (password_verify($data->inputs->password, $hashedPassword)) {
            // Password is correct, return a success response
            $response = ['status' => 1, 'message' => 'Login successful.', 'username' => $data->inputs->username];
        } else {
            // Password is incorrect, return an error response
            $response = ['status' => 0, 'message' => 'Invalid username or password.'];
        }
    } else {
        // Username not found, return an error response
        $response = ['status' => 0, 'message' => 'Invalid username or password.'];
    }

    echo json_encode($response);
}



function addnew($data) {

    // Extract necessary information from the $data object
    $username = $data->username;
    $artist = $data->inputs->artist ?? null;
    $song = $data->inputs->song ?? null;
    $rating = $data->inputs->rating ?? null;

    if ($username === null || $artist === null || $song === null || $rating === null) {
        $response = ['status' => 0, 'message' => 'Incomplete data provided'];
        echo json_encode($response);
        return;
    }

    $objDb = new DbConnect;
    $conn = $objDb->connect();

    // Check if the user has already rated the same song by the same artist
    $sql_check = "SELECT id FROM ratings WHERE username = :username AND artist = :artist AND song = :song";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bindParam(':username', $username);
    $stmt_check->bindParam(':artist', $artist);
    $stmt_check->bindParam(':song', $song);
    $stmt_check->execute();

    if ($stmt_check->rowCount() > 0) {
        $response = ['status' => 0, 'message' => 'You have already rated this song by the same artist.'];
        echo json_encode($response);
        return;
    } else {
        // Insert the new rating into the "ratings" table using a prepared statement
        $sql = "INSERT INTO ratings (username, artist, song, rating) VALUES (:username, :artist, :song, :rating)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':artist', $artist);
        $stmt->bindParam(':song', $song);
        $stmt->bindParam(':rating', $rating);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'New Song Rating added'];
            echo json_encode($response);
        } else {
            $response = ['status' => 0, 'message' => 'Error adding new song rating'];
            echo json_encode($response);
        }
    }  
}


function loadOverview($sort_by) {
    $objDb = new DbConnect;
    $conn = $objDb->connect();

    $sort = '';

    switch ($sort_by) {
        case 'artist':
            $sort = ' ORDER BY artist ASC';
            break;
        case '-artist':
            $sort = ' ORDER BY artist DESC';
            break;
        case 'song':
            $sort = ' ORDER BY song ASC';
            break;
        case '-song':
            $sort = ' ORDER BY song DESC';
            break;
        default:
            // Default sorting or no sorting
            $sort = '';
    }

    $sql = "SELECT ID, username, artist, song, rating FROM ratings $sort";
    $stmt = $conn->prepare($sql);
    

    if ($stmt) {
        if ($stmt->execute()) {
            $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($response);
        } else {
            echo "Error executing the query: " . $stmt->error;
        }
    } else {
        echo "Error preparing the statement: " . $conn->error;
    }
}

function getRating() {
    // Retrieve the song details based on the provided ID
    $objDb = new DbConnect;
    $conn = $objDb->connect();

    $id = $_GET['id'] ?? null;
    
    if ($id === null) {
        echo json_encode(['error' => 'ID not provided']);
        return;
    }

    $sql = "SELECT ID, username, artist, song, rating FROM ratings WHERE ID = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id);

    if ($stmt) {
        if ($stmt->execute()) {
            $response = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($response);
        } else {
            echo json_encode(['error' => 'Error fetching song details']);
        }
    } else {
        echo "Error preparing the statement: " . $conn->error;
    }
}

function update($data) {
    $objDb = new DbConnect;
    $conn = $objDb->connect();

    $id = $data->id ?? null;
    $artist = $data->inputs->artist ?? null;
    $song = $data->inputs->song ?? null;
    $rating = $data->inputs->rating ?? null;

    if ($id === null || $artist === null || $song === null || $rating === null) {
        $response = ['status' => 0, 'message' => 'Incomplete data provided'];
        echo json_encode($response);
        return;
    }

    $sql = "UPDATE ratings SET artist = :artist, song = :song, rating = :rating WHERE ID = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':artist', $artist);
    $stmt->bindParam(':song', $song);
    $stmt->bindParam(':rating', $rating);
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'Song Rating updated'];
        echo json_encode($response);
    } else {
        $response = ['status' => 0, 'message' => 'Error updating song rating'];
        echo json_encode($response);
    }
}

function delete($data) {
    $objDb = new DbConnect;
    $conn = $objDb->connect();

    $id = $data->id ?? null;

    if ($id === null) {
        $response = ['status' => 0, 'message' => 'Incomplete data provided'];
        echo json_encode($response);
        return;
    }

    $sql = "DELETE FROM ratings WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'Rating deleted'];
        echo json_encode($response);
    } else {
        $response = ['status' => 0, 'message' => 'Error during deletion'];
        echo json_encode($response);
    }
}
