/**
 * AI Player Logic for Risk Game
 * Provides intelligent computer player strategies
 */

class AIPlayer {
    constructor(player, game) {
        this.player = player;
        this.game = game;
        this.difficulty = 'medium'; // easy, medium, hard
    }

    /**
     * Make AI move
     */
    makeMove() {
        // Analyze current state
        const myTerritories = this.game.territories.filter(t => t.owner?.id === this.player.id);
        const enemyTerritories = this.game.territories.filter(t => t.owner && t.owner.id !== this.player.id);
        const weakTerritories = myTerritories.filter(t => t.troops <= 2);

        // Decide action based on difficulty
        if (this.difficulty === 'easy') {
            return this.makeEasyMove(myTerritories, enemyTerritories);
        } else if (this.difficulty === 'medium') {
            return this.makeMediumMove(myTerritories, enemyTerritories, weakTerritories);
        } else {
            return this.makeHardMove(myTerritories, enemyTerritories, weakTerritories);
        }
    }

    /**
     * Easy difficulty - random moves
     */
    makeEasyMove(myTerritories, enemyTerritories) {
        const attackTerritories = myTerritories.filter(t => 
            t.adjacent.some(id => this.game.territories.find(te => te.id === id).owner?.id !== this.player.id)
        );

        if (attackTerritories.length === 0) return null;

        const attacking = attackTerritories[Math.floor(Math.random() * attackTerritories.length)];
        const defendingId = attacking.adjacent.find(id => {
            const t = this.game.territories.find(te => te.id === id);
            return t.owner?.id !== this.player.id;
        });

        if (defendingId) {
            const defending = this.game.territories.find(t => t.id === defendingId);
            return { attacking, defending };
        }
        return null;
    }

    /**
     * Medium difficulty - balanced strategy
     */
    makeMediumMove(myTerritories, enemyTerritories, weakTerritories) {
        // Prioritize defending weak territory
        if (weakTerritories.length > 0) {
            const weak = weakTerritories[0];
            const reinforcements = myTerritories.find(t => 
                t.troops > 3 && t.adjacent.includes(weak.id)
            );
            if (reinforcements) {
                return { attacking: reinforcements, defending: weak, reinforce: true };
            }
        }

        // Attack weakest adjacent enemy
        let bestAttack = null;
        let minDefense = Infinity;

        for (const attacking of myTerritories.filter(t => t.troops > 2)) {
            for (const defendingId of attacking.adjacent) {
                const defending = this.game.territories.find(t => t.id === defendingId);
                if (defending.owner?.id !== this.player.id && defending.troops < minDefense) {
                    minDefense = defending.troops;
                    bestAttack = { attacking, defending };
                }
            }
        }

        return bestAttack;
    }

    /**
     * Hard difficulty - aggressive strategy
     */
    makeHardMove(myTerritories, enemyTerritories, weakTerritories) {
        // Consolidate troops defensively
        const strongTerritories = myTerritories.filter(t => t.troops > 3);
        if (weakTerritories.length > 0 && strongTerritories.length > 0) {
            const weak = weakTerritories[0];
            const strong = strongTerritories.find(t => t.adjacent.includes(weak.id));
            if (strong && strong.troops > weak.troops + 2) {
                return { attacking: strong, defending: weak, reinforce: true };
            }
        }

        // Aggressive expansion
        let bestAttack = null;
        let bestScore = -Infinity;

        for (const attacking of myTerritories.filter(t => t.troops > 2)) {
            for (const defendingId of attacking.adjacent) {
                const defending = this.game.territories.find(t => t.id === defendingId);
                if (defending.owner?.id !== this.player.id) {
                    const score = (attacking.troops - defending.troops) * 2 + defending.troops;
                    if (score > bestScore) {
                        bestScore = score;
                        bestAttack = { attacking, defending };
                    }
                }
            }
        }

        return bestAttack;
    }

    /**
     * Calculate territory value (many neighbors, centrality, etc.)
     */
    calculateTerritoryValue(territory) {
        let value = 0;
        
        // Adjacent enemy count
        const enemyNeighbors = territory.adjacent.filter(id => {
            const t = this.game.territories.find(te => te.id === id);
            return t.owner?.id !== this.player.id;
        }).length;
        value += enemyNeighbors * 10;

        // Strategic position
        value += territory.adjacent.length * 5;

        // Current troops (how hard to defend)
        value -= territory.troops * 2;

        return value;
    }
}
