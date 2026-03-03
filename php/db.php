<?php
/**
 * Database Connection Handler
 * Manages MySQL connections and queries
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'risk_game';
    private $username = 'root';
    private $password = '';
    private $conn;

    /**
     * Connect to database
     */
    public function connect() {
        $this->conn = null;

        try {
            $this->conn = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
            return false;
        }

        return $this->conn;
    }

    /**
     * Get all games
     */
    public function getAllGames() {
        $query = 'SELECT * FROM games ORDER BY created_at DESC';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get game by ID
     */
    public function getGameById($id) {
        $query = 'SELECT * FROM games WHERE id = :id';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Save game
     */
    public function saveGame($data) {
        $query = 'INSERT INTO games (game_data, created_at, updated_at)
                  VALUES (:game_data, NOW(), NOW())
                  ON DUPLICATE KEY UPDATE
                  game_data = :game_data, updated_at = NOW()';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':game_data', $data);
        $stmt->execute();

        return $this->conn->lastInsertId();
    }

    /**
     * Delete game
     */
    public function deleteGame($id) {
        $query = 'DELETE FROM games WHERE id = :id';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    /**
     * Save battle log
     */
    public function saveBattleLog($gameId, $attacking, $defending, $result) {
        $query = 'INSERT INTO battle_logs (game_id, attacking_territory, defending_territory, result, created_at)
                  VALUES (:game_id, :attacking, :defending, :result, NOW())';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':game_id', $gameId);
        $stmt->bindParam(':attacking', $attacking);
        $stmt->bindParam(':defending', $defending);
        $stmt->bindParam(':result', $result);

        return $stmt->execute();
    }

    /**
     * Get battle logs for a game
     */
    public function getBattleLogs($gameId) {
        $query = 'SELECT * FROM battle_logs WHERE game_id = :game_id ORDER BY created_at DESC';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':game_id', $gameId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create tables if they don't exist
     */
    public function createTables() {
        // Games table
        $query = 'CREATE TABLE IF NOT EXISTS games (
            id INT AUTO_INCREMENT PRIMARY KEY,
            game_data LONGTEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';

        $this->conn->exec($query);

        // Battle logs table
        $query = 'CREATE TABLE IF NOT EXISTS battle_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            game_id INT NOT NULL,
            attacking_territory VARCHAR(100) NOT NULL,
            defending_territory VARCHAR(100) NOT NULL,
            result VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            INDEX idx_game (game_id),
            INDEX idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';

        $this->conn->exec($query);

        return true;
    }

    /**
     * Initialize database
     */
    public function init() {
        // Create database if it doesn't exist
        $query = 'CREATE DATABASE IF NOT EXISTS ' . $this->db_name;
        $this->conn->exec($query);

        // Select the database
        $this->conn->exec('USE ' . $this->db_name);

        // Create tables
        $this->createTables();
    }
}

// Test database connection
if (php_sapi_name() === 'cli') {
    $db = new Database();
    if ($db->connect()) {
        $db->init();
        echo "Database connection successful!\n";
    }
}
?>
