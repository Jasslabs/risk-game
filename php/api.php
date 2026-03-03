<?php
/**
 * Risk Game API
 * Handles all game save/load operations
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

class GameAPI {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->connect();
        
        // Initialize database and tables
        $db = new Database();
        $db->connect();
        $db->init();
    }

    /**
     * Handle API requests
     */
    public function handleRequest($method, $action, $data = null) {
        switch ($action) {
            case 'save_game':
                return $this->saveGame($data);
            
            case 'load_games':
                return $this->loadGames();
            
            case 'load_game':
                return $this->loadGame($data['gameId'] ?? null);
            
            case 'delete_game':
                return $this->deleteGame($data['gameId'] ?? null);
            
            case 'save_battle_log':
                return $this->saveBattleLog($data);
            
            case 'get_battle_logs':
                return $this->getBattleLogs($data['gameId'] ?? null);
            
            case 'get_leaderboard':
                return $this->getLeaderboard();
            
            default:
                return $this->error('Unknown action: ' . $action);
        }
    }

    /**
     * Save game
     */
    private function saveGame($data) {
        try {
            if (!isset($data['gameData'])) {
                return $this->error('Game data is required');
            }

            $gameJson = json_encode($data['gameData']);
            
            $query = 'INSERT INTO games (game_data, created_at, updated_at)
                      VALUES (:game_data, NOW(), NOW())';
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':game_data', $gameJson);
            $stmt->execute();

            $gameId = $this->db->lastInsertId();

            return $this->success('Game saved successfully', ['gameId' => $gameId]);
        } catch (Exception $e) {
            return $this->error('Error saving game: ' . $e->getMessage());
        }
    }

    /**
     * Load all games
     */
    private function loadGames() {
        try {
            $query = 'SELECT id, created_at, updated_at FROM games ORDER BY updated_at DESC LIMIT 10';
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $games = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $this->success('Games loaded', $games);
        } catch (Exception $e) {
            return $this->error('Error loading games: ' . $e->getMessage());
        }
    }

    /**
     * Load specific game
     */
    private function loadGame($gameId) {
        try {
            if (!$gameId) {
                return $this->error('Game ID is required');
            }

            $query = 'SELECT * FROM games WHERE id = :id';
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $gameId);
            $stmt->execute();

            $game = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$game) {
                return $this->error('Game not found');
            }

            $game['game_data'] = json_decode($game['game_data'], true);

            return $this->success('Game loaded', $game);
        } catch (Exception $e) {
            return $this->error('Error loading game: ' . $e->getMessage());
        }
    }

    /**
     * Delete game
     */
    private function deleteGame($gameId) {
        try {
            if (!$gameId) {
                return $this->error('Game ID is required');
            }

            $query = 'DELETE FROM games WHERE id = :id';
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $gameId);
            $stmt->execute();

            return $this->success('Game deleted successfully');
        } catch (Exception $e) {
            return $this->error('Error deleting game: ' . $e->getMessage());
        }
    }

    /**
     * Save battle log
     */
    private function saveBattleLog($data) {
        try {
            if (!isset($data['gameId']) || !isset($data['attacking']) || !isset($data['defending'])) {
                return $this->error('Missing required battle data');
            }

            $result = json_encode($data['result'] ?? []);

            $query = 'INSERT INTO battle_logs (game_id, attacking_territory, defending_territory, result, created_at)
                      VALUES (:game_id, :attacking, :defending, :result, NOW())';

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':game_id', $data['gameId']);
            $stmt->bindParam(':attacking', $data['attacking']);
            $stmt->bindParam(':defending', $data['defending']);
            $stmt->bindParam(':result', $result);
            $stmt->execute();

            return $this->success('Battle log saved');
        } catch (Exception $e) {
            return $this->error('Error saving battle log: ' . $e->getMessage());
        }
    }

    /**
     * Get battle logs
     */
    private function getBattleLogs($gameId) {
        try {
            if (!$gameId) {
                return $this->error('Game ID is required');
            }

            $query = 'SELECT * FROM battle_logs WHERE game_id = :game_id ORDER BY created_at DESC';
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':game_id', $gameId);
            $stmt->execute();

            $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($logs as &$log) {
                $log['result'] = json_decode($log['result'], true);
            }

            return $this->success('Battle logs retrieved', $logs);
        } catch (Exception $e) {
            return $this->error('Error retrieving battle logs: ' . $e->getMessage());
        }
    }

    /**
     * Get leaderboard
     */
    private function getLeaderboard() {
        try {
            // This would be a more complex query in production
            return $this->success('Leaderboard retrieved', []);
        } catch (Exception $e) {
            return $this->error('Error retrieving leaderboard: ' . $e->getMessage());
        }
    }

    /**
     * Success response
     */
    private function success($message, $data = []) {
        return [
            'success' => true,
            'message' => $message,
            'data' => $data
        ];
    }

    /**
     * Error response
     */
    private function error($message) {
        return [
            'success' => false,
            'message' => $message,
            'error' => true
        ];
    }
}

// Handle request
try {
    $api = new GameAPI();
    
    $method = $_SERVER['REQUEST_METHOD'];
    $action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : null);

    if (!$action) {
        http_response_code(400);
        echo json_encode(['error' => 'Action not specified']);
        exit;
    }

    // Get request data
    $data = null;
    if ($method === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
    } else if ($method === 'GET') {
        $data = $_GET;
    }

    $response = $api->handleRequest($method, $action, $data);
    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
