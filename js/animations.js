/**
 * Animation Engine for Risk Game
 * Advanced animation and particle system
 */

class AnimationEngine {
    constructor() {
        this.animations = [];
        this.particles = [];
        this.startTime = Date.now();
        this.elapsedTime = 0;
    }

    /**
     * Add an animation
     */
    addAnimation(animation) {
        if (animation) {
            this.animations.push(animation);
            animation.startTime = Date.now();
        }
    }

    /**
     * Remove animation
     */
    removeAnimation(animation) {
        const index = this.animations.indexOf(animation);
        if (index > -1) {
            this.animations.splice(index, 1);
        }
    }

    /**
     * Update all animations
     */
    update(deltaTime) {
        this.elapsedTime += deltaTime;

        // Update animations
        for (let i = this.animations.length - 1; i >= 0; i--) {
            try {
                const animation = this.animations[i];
                if (animation && typeof animation.update === 'function') {
                    animation.update(deltaTime);
                    if (animation.isComplete && animation.isComplete()) {
                        this.removeAnimation(animation);
                    }
                }
            } catch (error) {
                console.error('Animation update error:', error);
                this.animations.splice(i, 1);
            }
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            try {
                const particle = this.particles[i];
                if (particle && typeof particle.update === 'function') {
                    particle.update(deltaTime);
                    if (particle.isDead && particle.isDead()) {
                        this.particles.splice(i, 1);
                    }
                }
            } catch (error) {
                console.error('Particle update error:', error);
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Draw all animations
     */
    draw(ctx) {
        if (!ctx) return;

        try {
            // Draw animations
            for (const animation of this.animations) {
                if (animation && typeof animation.draw === 'function') {
                    try {
                        animation.draw(ctx);
                    } catch (error) {
                        console.error('Animation draw error:', error);
                    }
                }
            }

            // Draw particles
            for (const particle of this.particles) {
                if (particle && typeof particle.draw === 'function') {
                    try {
                        particle.draw(ctx);
                    } catch (error) {
                        console.error('Particle draw error:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Draw system error:', error);
        }
    }

    /**
     * Create attack animation
     */
    createAttackAnimation(fromX, fromY, toX, toY, success = true) {
        this.addAnimation(new AttackAnimation(fromX, fromY, toX, toY, success));
    }

    /**
     * Create troop movement
     */
    createTroopMovement(fromX, fromY, toX, toY, count) {
        this.addAnimation(new TroopMovement(fromX, fromY, toX, toY, count));
    }

    /**
     * Create explosion
     */
    createExplosion(x, y, color = '#ff6b6b') {
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            const speed = 3 + Math.random() * 3;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            this.particles.push(new Particle(x, y, velocity, color, 0.8));
        }
    }

    /**
     * Create victory effect
     */
    createVictoryEffect(x, y) {
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = 2 + Math.random() * 2;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            this.particles.push(new Particle(x, y, velocity, '#ffd700', 1));
        }
    }

    /**
     * Create defeat effect
     */
    createDefeatEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = {
                x: Math.cos(angle) * (2 + Math.random() * 2),
                y: Math.random() * 4 + 1
            };
            this.particles.push(new Particle(x, y, velocity, '#808080', 0.7));
        }
    }

    /**
     * Clear all animations
     */
    clear() {
        this.animations = [];
        this.particles = [];
    }
}

/**
 * Attack Animation - Projectiles between territories
 */
class AttackAnimation {
    constructor(fromX, fromY, toX, toY, success = true) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.success = success;
        this.progress = 0;
        this.duration = 800;
        this.startTime = Date.now();
        this.projectiles = [];

        for (let i = 0; i < 3; i++) {
            this.projectiles.push({
                offsetX: (Math.random() - 0.5) * 50,
                offsetY: (Math.random() - 0.5) * 50,
                delay: i * 100
            });
        }
    }

    update(deltaTime) {
        const elapsed = Date.now() - this.startTime;
        this.progress = Math.min(elapsed / this.duration, 1);
    }

    draw(ctx) {
        try {
            for (const projectile of this.projectiles) {
                const adjustedProgress = Math.max(0, (this.progress * 1000 - projectile.delay) / 800);
                if (adjustedProgress <= 1) {
                    const x = this.fromX + (this.toX - this.fromX) * adjustedProgress;
                    const y = this.fromY + (this.toY - this.fromY) * adjustedProgress;

                    ctx.save();
                    ctx.globalAlpha = 1 - adjustedProgress;
                    ctx.fillStyle = this.success ? '#ff6b6b' : '#ffa500';
                    ctx.beginPath();
                    ctx.arc(x + projectile.offsetX, y + projectile.offsetY, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            if (this.progress > 0.7) {
                const impactAlpha = 1 - (this.progress - 0.7) / 0.3;
                ctx.save();
                ctx.globalAlpha = impactAlpha * 0.6;
                ctx.fillStyle = this.success ? '#ff6b6b' : '#ffa500';
                ctx.beginPath();
                ctx.arc(this.toX, this.toY, 20 * impactAlpha, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        } catch (error) {
            console.error('AttackAnimation draw error:', error);
        }
    }

    isComplete() {
        return this.progress >= 1;
    }
}

/**
 * Troop Movement Animation
 */
class TroopMovement {
    constructor(fromX, fromY, toX, toY, count) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.count = count;
        this.progress = 0;
        this.duration = 1000;
        this.startTime = Date.now();
        this.troops = [];

        for (let i = 0; i < Math.min(count, 10); i++) {
            this.troops.push({
                offsetX: (Math.random() - 0.5) * 60,
                offsetY: (Math.random() - 0.5) * 60,
                delay: i * 50,
                speed: 0.8 + Math.random() * 0.4
            });
        }
    }

    update(deltaTime) {
        const elapsed = Date.now() - this.startTime;
        this.progress = Math.min(elapsed / this.duration, 1);
    }

    draw(ctx) {
        try {
            for (const troop of this.troops) {
                const adjustedProgress = Math.max(0, (this.progress * 1000 - troop.delay) / 800) * troop.speed;
                if (adjustedProgress <= 1) {
                    const x = this.fromX + (this.toX - this.fromX) * adjustedProgress;
                    const y = this.fromY + (this.toY - this.fromY) * adjustedProgress;

                    ctx.save();
                    ctx.globalAlpha = 1 - Math.abs(adjustedProgress - 0.5) * 0.3;
                    ctx.fillStyle = '#4CAF50';
                    ctx.beginPath();
                    ctx.arc(x + troop.offsetX, y + troop.offsetY, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        } catch (error) {
            console.error('TroopMovement draw error:', error);
        }
    }

    isComplete() {
        return this.progress >= 1;
    }
}

/**
 * Particle System
 */
class Particle {
    constructor(x, y, velocity, color, gravity = 0.1) {
        this.x = x;
        this.y = y;
        this.vx = velocity.x;
        this.vy = velocity.y;
        this.color = color;
        this.gravity = gravity;
        this.life = 100;
        this.decay = 100 / 500;
        this.size = 6;
    }

    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= this.decay;
        this.size = Math.max(1, this.size * 0.98);
    }

    draw(ctx) {
        try {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.life / 100);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } catch (error) {
            console.error('Particle draw error:', error);
        }
    }

    isDead() {
        return this.life <= 0;
    }
}

/**
 * Pulse Effect
 */
class PulseEffect {
    constructor(x, y, maxRadius = 50, color = 'rgba(255, 255, 255, 0.5)', duration = 500) {
        this.x = x;
        this.y = y;
        this.maxRadius = maxRadius;
        this.color = color;
        this.duration = duration;
        this.startTime = Date.now();
        this.progress = 0;
    }

    update(deltaTime) {
        const elapsed = Date.now() - this.startTime;
        this.progress = elapsed / this.duration;
    }

    draw(ctx) {
        try {
            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - this.progress);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.maxRadius * this.progress, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        } catch (error) {
            console.error('PulseEffect draw error:', error);
        }
    }

    isComplete() {
        return this.progress >= 1;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationEngine;
}
