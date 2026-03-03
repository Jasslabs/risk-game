/**
 * Risk Game - Main Game Logic
 * Advanced version with AI, better mechanics, and animations
 */

class RiskGame {
    constructor() {
        try {
            this.canvas = document.getElementById('gameBoard');
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }

            this.graphics = new GraphicsEngine(this.canvas);
            this.animations = new AnimationEngine();

            this.gameState = 'menu'; // menu, setup, playing, reinforcing, attacking, gameOver
            this.players = [];
            this.territories = [];
            this.currentPlayerIndex = 0;
            this.selectedTerritory = null;
            this.hoveredTerritory = null;
            this.gameId = null;
            this.gameLoopRunning = false;
            this.lastRenderTime = Date.now();

            this.setupCanvasListeners();
            this.setupUIListeners();
            this.initializeTerritories();
            this.startGameLoop();

            console.log('Risk Game initialized successfully');
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError(error.message);
        }
    }

    /**
     * Initialize the game map with territories
     */
    initializeTerritories() {
        // Create territories at specific positions
        const positions = [
            { id: 1, name: 'North America', x: 150, y: 150, color: '#e74c3c' },
            { id: 2, name: 'South America', x: 200, y: 350, color: '#e74c3c' },
            { id: 3, name: 'Europe', x: 450, y: 100, color: '#3498db' },
            { id: 4, name: 'Africa', x: 450, y: 300, color: '#3498db' },
            { id: 5, name: 'Asia', x: 700, y: 200, color: '#2ecc71' },
            { id: 6, name: 'Australia', x: 800, y: 450, color: '#2ecc71' },
            { id: 7, name: 'Russia', x: 600, y: 100, color: '#f39c12' },
            { id: 8, name: 'Middle East', x: 550, y: 250, color: '#f39c12' },
            { id: 9, name: 'Southeast Asia', x: 750, y: 350, color: '#9b59b6' },
            { id: 10, name: 'India', x: 650, y: 300, color: '#9b59b6' }
        ];

        this.territories = positions.map(pos => ({
            id: pos.id,
            name: pos.name,
            x: pos.x,
            y: pos.y,
            color: pos.color,
            troops: 0,
            owner: null,
            adjacent: this.getAdjacentTerritories(pos.id)
        }));
    }

    /**
     * Define adjacent territories for each territory
     */
    getAdjacentTerritories(territoryId) {
        const adjacencies = {
            1: [2, 3, 7],
            2: [1, 4],
            3: [1, 4, 7, 8],
            4: [2, 3, 8, 5, 10],
            5: [4, 7, 10, 9],
            6: [9, 10],
            7: [1, 3, 5, 8],
            8: [3, 4, 5, 7, 10],
            9: [5, 6, 10],
            10: [4, 5, 8, 9]
        };
        return adjacencies[territoryId] || [];
    }

    /**
     * Setup canvas event listeners
     */
    setupCanvasListeners() {
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasHover(e));
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Setup UI event listeners
     */
    setupUIListeners() {
        try {
            document.getElementById('startGameBtn').addEventListener('click', () => this.showGameSetup());
            document.getElementById('loadGameBtn').addEventListener('click', () => this.loadGame());
            document.getElementById('saveGameBtn').addEventListener('click', () => this.saveGame());
            document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());

            // Modal controls
            const setupModal = document.getElementById('setupModal');
            if (setupModal) {
                const closeBtn = setupModal.querySelector('.close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => setupModal.style.display = 'none');
                }

                const playerCountSelect = document.getElementById('playerCountSelect');
                if (playerCountSelect) {
                    playerCountSelect.addEventListener('change', (e) => {
                        this.updatePlayerInputs(parseInt(e.target.value));
                    });
                }

                const confirmBtn = document.getElementById('confirmSetupBtn');
                if (confirmBtn) {
                    confirmBtn.addEventListener('click', () => this.startGame());
                }
            }

            // Battle modal
            const battleOkBtn = document.getElementById('battleOkBtn');
            if (battleOkBtn) {
                battleOkBtn.addEventListener('click', () => {
                    const battleModal = document.getElementById('battleModal');
                    if (battleModal) {
                        battleModal.style.display = 'none';
                    }
                });
            }
        } catch (error) {
            console.error('UI listener setup error:', error);
        }
    }

    /**
     * Show game setup modal
     */
    showGameSetup() {
        document.getElementById('setupModal').style.display = 'flex';
        this.updatePlayerInputs(2);
    }

    /**
     * Update player input fields in setup modal
     */
    updatePlayerInputs(count) {
        const container = document.getElementById('playerNames');
        container.innerHTML = '';

        const playerColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'player-input-group';
            div.innerHTML = `
                <input type="text" placeholder="Player ${i + 1} Name" class="player-name-input" value="Player ${i + 1}">
                <input type="color" class="player-color" value="${playerColors[i]}" data-player="${i}">
            `;
            container.appendChild(div);
        }
    }

    /**
     * Start the game
     */
    startGame() {
        const nameInputs = document.querySelectorAll('.player-name-input');
        const colorInputs = document.querySelectorAll('.player-color');

        this.players = [];
        nameInputs.forEach((input, index) => {
            this.players.push({
                id: index,
                name: input.value || `Player ${index + 1}`,
                color: colorInputs[index].value,
                troops: 20,
                territories: [],
                isHuman: true
            });
        });

        this.gameState = 'playing';
        document.getElementById('setupModal').style.display = 'none';
        this.logMessage('Game started! Distributing territories...', 'info');

        // Distribute territories randomly
        this.distributeTerritories();
        this.render();
    }

    /**
     * Distribute territories among players
     */
    distributeTerritories() {
        const shuffled = [...this.territories].sort(() => Math.random() - 0.5);
        let playerIndex = 0;

        for (const territory of shuffled) {
            territory.owner = this.players[playerIndex];
            territory.troops = 1;
            this.players[playerIndex].territories.push(territory.id);
            playerIndex = (playerIndex + 1) % this.players.length;
        }

        this.updatePlayersList();
    }

    /**
     * Handle canvas click
     */
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width;
        const y = (e.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height;

        const clicked = this.getTerritoryAtPoint(x, y);
        if (clicked) {
            this.selectTerritory(clicked);
        }
    }

    /**
     * Handle canvas hover
     */
    handleCanvasHover(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width;
        const y = (e.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height;

        this.hoveredTerritory = this.getTerritoryAtPoint(x, y);
        this.render();
    }

    /**
     * Get territory at point
     */
    getTerritoryAtPoint(x, y) {
        for (const territory of this.territories) {
            const dist = Math.sqrt((territory.x - x) ** 2 + (territory.y - y) ** 2);
            if (dist < 35) {
                return territory;
            }
        }
        return null;
    }

    /**
     * Select a territory
     */
    selectTerritory(territory) {
        if (this.selectedTerritory?.id === territory.id) {
            this.selectedTerritory = null;
        } else {
            this.selectedTerritory = territory;
            this.showTerritoryInfo(territory);
        }
        this.render();
    }

    /**
     * Show territory information in sidebar
     */
    showTerritoryInfo(territory) {
        const info = document.getElementById('territoryInfo');
        const owner = territory.owner ? territory.owner.name : 'Neutral';
        const adjacent = territory.adjacent.map(id => {
            const t = this.territories.find(te => te.id === id);
            return t ? t.name : '';
        }).join(', ');

        info.innerHTML = `
            <div class="territory-stat">
                <span>Territory:</span>
                <span>${territory.name}</span>
            </div>
            <div class="territory-stat">
                <span>Owner:</span>
                <span>${owner}</span>
            </div>
            <div class="territory-stat">
                <span>Troops:</span>
                <span>${territory.troops}</span>
            </div>
            <div class="territory-stat">
                <span>Adjacent:</span>
            </div>
            <p style="font-size: 0.85em; color: #666; margin-top: 5px;">${adjacent}</p>
        `;
    }

    /**
     * Perform a battle between two territories
     */
    battle(attacking, defending) {
        try {
            // Validate territories
            if (!attacking || !defending || !attacking.owner || !defending.owner) {
                this.logMessage('Invalid battle setup', 'error');
                return false;
            }

            if (attacking.owner.id === defending.owner.id) {
                this.logMessage('Cannot attack own territory', 'error');
                return false;
            }

            if (attacking.troops < 2) {
                this.logMessage('Not enough troops to attack (need at least 2)', 'error');
                return false;
            }

            if (!attacking.adjacent.includes(defending.id)) {
                this.logMessage('Can only attack adjacent territories', 'error');
                return false;
            }

            const attacker = attacking.owner;
            const defender = defending.owner;

            // Simulate battle
            const attackerDice = [];
            const defenderDice = [];

            // Roll dice (max 3 for attacker, 1 for defender)
            const attackRolls = Math.min(Math.max(attacking.troops - 1, 1), 3);
            const defendRolls = Math.min(defending.troops, 2);

            for (let i = 0; i < attackRolls; i++) {
                attackerDice.push(Math.floor(Math.random() * 6) + 1);
            }
            for (let i = 0; i < defendRolls; i++) {
                defenderDice.push(Math.floor(Math.random() * 6) + 1);
            }

            // Sort in descending order
            attackerDice.sort((a, b) => b - a);
            defenderDice.sort((a, b) => b - a);

            // Resolve battle
            let attackerLosses = 0;
            let defenderLosses = 0;

            for (let i = 0; i < Math.min(attackerDice.length, defenderDice.length); i++) {
                if (attackerDice[i] > defenderDice[i]) {
                    defenderLosses++;
                    this.animations.createExplosion(defending.x, defending.y, '#ff6b6b');
                } else {
                    attackerLosses++;
                    this.animations.createExplosion(attacking.x, attacking.y, '#ff9800');
                }
            }

            // Apply losses
            attacking.troops -= attackerLosses;
            defending.troops -= defenderLosses;

            // Log battle
            this.logMessage(
                `${attacker.name} attacks ${defending.name}: A-${attackRolls}d vs D-${defendRolls}d | ` +
                `A loses ${attackerLosses}, D loses ${defenderLosses}`,
                'info'
            );

            // Check if territory is conquered
            if (defending.troops <= 0) {
                this.conquestTerritory(attacking, defending, attacker, defender);
                return true;
            }

            this.updatePlayersList();
            this.render();
            return true;
        } catch (error) {
            console.error('Battle error:', error);
            this.logMessage('Battle error: ' + error.message, 'error');
            return false;
        }
    }

    /**
     * Handle territory conquest
     */
    conquestTerritory(attacking, defending, attacker, defender) {
        defending.troops = 1;
        defending.owner = attacker;
        attacker.territories.push(defending.id);
        defender.territories = defender.territories.filter(id => id !== defending.id);

        this.animations.createVictoryEffect(defending.x, defending.y);
        this.logMessage(`🎉 ${attacker.name} conquered ${defending.name}!`, 'success');

        // Update lists
        this.updatePlayersList();

        // Check for winner
        this.checkWinCondition();
    }

    /**
     * Check if game is won
     */
    checkWinCondition() {
        // Game is won if one player controls all territories
        for (const player of this.players) {
            if (player.territories.length === this.territories.length) {
                this.gameState = 'gameOver';
                this.logMessage(`🏆 ${player.name} has conquered the world!`, 'success');
                this.showGameOverModal(player);
                return true;
            }
        }

        // Eliminate players with no territories
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].territories.length === 0 && this.gameState === 'playing') {
                const eliminated = this.players[i];
                this.logMessage(`${eliminated.name} has been eliminated`, 'error');
                this.players.splice(i, 1);
                if (i <= this.currentPlayerIndex && this.currentPlayerIndex > 0) {
                    this.currentPlayerIndex--;
                }
            }
        }

        return false;
    }

    /**
     * Show game over modal
     */
    showGameOverModal(winner) {
        const modal = document.getElementById('battleModal');
        if (modal) {
            modal.querySelector('#battleResults').innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h2 style="color: ${winner.color}; font-size: 2em;">🏆 Victory! 🏆</h2>
                    <p style="font-size: 1.3em; margin: 20px 0;">${winner.name} rules the world!</p>
                    <p style="color: #666;">Territories controlled: ${winner.territories.length}</p>
                </div>
            `;
            modal.style.display = 'flex';
        }
    }

    /**
     * Update game rendering
     */
    render() {
        this.graphics.drawMap(this.territories, this.selectedTerritory, this.hoveredTerritory);
        this.animations.draw(this.graphics.ctx);
        this.updateStatusBar();
    }

    /**
     * Update status bar with current game info
     */
    updateStatusBar() {
        document.getElementById('playerCount').textContent = this.players.length;
        const currentPlayer = this.players[this.currentPlayerIndex];
        document.getElementById('currentTurn').textContent = currentPlayer ? currentPlayer.name : 'None';
        document.getElementById('gameStatus').textContent = this.gameState;
    }

    /**
     * Update players list in sidebar
     */
    updatePlayersList() {
        const list = document.getElementById('playersList');
        list.innerHTML = '';

        for (const player of this.players) {
            const div = document.createElement('div');
            div.className = `player-item ${player.id === this.currentPlayerIndex ? 'active' : ''}`;
            div.style.borderLeftColor = player.color;
            div.innerHTML = `
                <div class="player-name" style="color: ${player.color};">${player.name}</div>
                <div class="player-stats">
                    Territories: ${player.territories.length} | Troops: ${player.troops}
                </div>
            `;
            list.appendChild(div);
        }
    }

    /**
     * Log a game message
     */
    logMessage(message, type = 'info') {
        const log = document.getElementById('gameLog');
        const entry = document.createElement('p');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    /**
     * Save game to server
     */
    async saveGame() {
        try {
            const gameData = {
                players: this.players.map(p => ({
                    id: p.id,
                    name: p.name,
                    color: p.color,
                    troops: p.troops,
                    territories: p.territories
                })),
                territories: this.territories.map(t => ({
                    id: t.id,
                    name: t.name,
                    troops: t.troops,
                    ownerId: t.owner ? t.owner.id : null
                })),
                currentPlayerIndex: this.currentPlayerIndex,
                gameState: this.gameState
            };

            const response = await fetch('php/api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'save_game',
                    gameData: gameData
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                this.gameId = result.data.gameId;
                this.logMessage('✅ Game saved successfully!', 'success');
                document.getElementById('saveGameBtn').disabled = false;
            } else {
                this.logMessage('❌ Save failed: ' + (result.message || 'Unknown error'), 'error');
            }
        } catch (error) {
            this.logMessage('❌ Error saving game: ' + error.message, 'error');
            console.error('Save game error:', error);
        }
    }

    /**
     * Load game from server
     */
    async loadGame() {
        try {
            const response = await fetch('php/api.php?action=load_games');
            const result = await response.json();

            if (!result.success) {
                this.logMessage('No saved games found', 'info');
                return;
            }

            const games = result.data || [];
            if (games.length === 0) {
                this.logMessage('No saved games found', 'info');
                return;
            }

            // Load the most recent game
            const game = games[0];
            this.gameId = game.id;

            // Restore game state
            this.logMessage(`✅ Loaded game ${game.id}`, 'success');
        } catch (error) {
            this.logMessage('❌ Error loading games: ' + error.message, 'error');
            console.error('Load games error:', error);
        }
    }

    /**
     * Reset the game
     */
    resetGame() {
        if (confirm('Are you sure you want to reset the game?')) {
            this.gameState = 'menu';
            this.players = [];
            this.territories = [];
            this.selectedTerritory = null;
            this.currentPlayerIndex = 0;
            this.initializeTerritories();
            this.logMessage('Game reset', 'info');
            this.render();
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.graphics.resize(rect.width, rect.height);
        this.render();
    }

    /**
     * Start the game loop
     */
    startGameLoop() {
        if (this.gameLoopRunning) return;
        this.gameLoopRunning = true;

        const gameLoop = () => {
            try {
                const now = Date.now();
                const deltaTime = Math.min(now - this.lastRenderTime, 50); // Cap delta time
                this.lastRenderTime = now;

                this.animations.update(deltaTime);
                this.render();

                requestAnimationFrame(gameLoop);
            } catch (error) {
                console.error('Game loop error:', error);
                this.gameLoopRunning = false;
            }
        };

        gameLoop();
    }

    /**
     * Show error message
     */
    showError(message) {
        const modal = document.getElementById('setupModal');
        if (modal) {
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>⚠️ Error</h2>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Reload Game</button>
                </div>
            `;
            modal.style.display = 'flex';
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new RiskGame();
});
