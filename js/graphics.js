/**
 * Graphics & Rendering Engine for Risk Game
 * Advanced canvas rendering with optimizations
 */

class GraphicsEngine {
    constructor(canvas) {
        if (!canvas) {
            throw new Error('Canvas element required');
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('Could not get 2D context from canvas');
        }

        this.width = canvas.width || canvas.parentElement.offsetWidth;
        this.height = canvas.height || canvas.parentElement.offsetHeight;
        this.dpi = window.devicePixelRatio || 1;

        // Set canvas size
        canvas.width = this.width;
        canvas.height = this.height;

        // Handle high DPI
        if (this.dpi > 1) {
            canvas.style.width = this.width + 'px';
            canvas.style.height = this.height + 'px';
        }
    }

    /**
     * Clear canvas with gradient
     */
    clear() {
        try {
            const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
            gradient.addColorStop(0, '#f5f7fa');
            gradient.addColorStop(1, '#c3cfe2');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        } catch (error) {
            console.error('Clear error:', error);
            this.ctx.fillStyle = '#f0f0f0';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    /**
     * Draw entire map
     */
    drawMap(territories, selectedTerritory = null, hoveredTerritory = null) {
        try {
            this.clear();
            this.drawGrid();
            this.drawConnections(territories);

            for (const territory of territories) {
                const isSelected = selectedTerritory && selectedTerritory.id === territory.id;
                const isHovered = hoveredTerritory && hoveredTerritory.id === territory.id;
                this.drawTerritory(territory, isSelected, isHovered);
            }
        } catch (error) {
            console.error('Map draw error:', error);
        }
    }

    /**
     * Draw background grid
     */
    drawGrid() {
        try {
            this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.08)';
            this.ctx.lineWidth = 1;

            for (let x = 0; x < this.width; x += 50) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.height);
                this.ctx.stroke();
            }

            for (let y = 0; y < this.height; y += 50) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
                this.ctx.stroke();
            }
        } catch (error) {
            console.error('Grid draw error:', error);
        }
    }

    /**
     * Draw territory connections
     */
    drawConnections(territories) {
        try {
            this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.15)';
            this.ctx.lineWidth = 2;

            for (const territory of territories) {
                if (territory.adjacent && territory.adjacent.length > 0) {
                    for (const adjacentId of territory.adjacent) {
                        const adjacent = territories.find(t => t.id === adjacentId);
                        if (adjacent && territory.id < adjacent.id) {
                            this.ctx.beginPath();
                            this.ctx.moveTo(territory.x, territory.y);
                            this.ctx.lineTo(adjacent.x, adjacent.y);
                            this.ctx.stroke();
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Connection draw error:', error);
        }
    }

    /**
     * Draw single territory
     */
    drawTerritory(territory, isSelected = false, isHovered = false) {
        try {
            const radius = isSelected ? 35 : isHovered ? 32 : 30;
            const x = territory.x;
            const y = territory.y;

            // Shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            this.ctx.beginPath();
            this.ctx.arc(x + 2, y + 2, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Territory circle
            this.ctx.fillStyle = territory.color || '#999';
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Border
            this.ctx.strokeStyle = isSelected ? '#FFD700' : isHovered ? '#fff' : '#333';
            this.ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1.5;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.stroke();

            // Gradient shine
            const gradient = this.ctx.createRadialGradient(x - 10, y - 10, 0, x, y, radius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Troops
            this.drawTroopCount(territory, radius);

            // Selection glow
            if (isSelected) {
                this.drawSelectionGlow(territory);
            }
        } catch (error) {
            console.error('Territory draw error:', error);
        }
    }

    /**
     * Draw troop count
     */
    drawTroopCount(territory, radius) {
        try {
            this.ctx.save();
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 18px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            this.ctx.shadowBlur = 4;
            this.ctx.shadowOffsetX = 1;
            this.ctx.shadowOffsetY = 1;
            this.ctx.fillText(territory.troops, territory.x, territory.y);
            this.ctx.restore();
        } catch (error) {
            console.error('Troop count draw error:', error);
        }
    }

    /**
     * Draw selection glow
     */
    drawSelectionGlow(territory) {
        try {
            const time = Date.now() / 500;
            const pulse = 0.3 + 0.3 * Math.sin(time * Math.PI);

            this.ctx.save();
            this.ctx.strokeStyle = `rgba(255, 215, 0, ${pulse})`;
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(territory.x, territory.y, 45, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();
        } catch (error) {
            console.error('Selection glow draw error:', error);
        }
    }

    /**
     * Draw center text
     */
    drawCenterText(text, fontSize = 24, color = '#333') {
        try {
            this.ctx.save();
            this.ctx.fillStyle = color;
            this.ctx.font = `bold ${fontSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(text, this.width / 2, this.height / 2);
            this.ctx.restore();
        } catch (error) {
            console.error('Center text draw error:', error);
        }
    }

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GraphicsEngine;
}
