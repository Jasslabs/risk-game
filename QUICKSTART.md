# Risk Game - Quick Start Guide

## ⚡ Quick Setup (2 minutes)

### 1. Ensure XAMPP is Running
- Open XAMPP Control Panel
- Click "Start" for Apache
- Click "Start" for MySQL

### 2. Open The Game
- Open your browser
- Go to: **http://localhost/aiprojectcopilot/**

### 3. Play!
- Click "**Start New Game**"
- Select 2-6 players
- Enter player names and pick colors
- Click "**Start Game**"

## 🎮 How to Play

### Objective
Conquer all territories on the map to win the game!

### Game Flow
1. **Territory Distribution** - Territories are randomly assigned to players
2. **Battle Phase** - Click on your territory, then click an adjacent enemy territory to attack
3. **Battle Results** - Both sides roll dice; higher roll wins
4. **Repeat** - Continue attacking until someone wins

### Attack Rules
- You can only attack **adjacent** territories
- You need **at least 2 troops** to attack
- Attacker rolls up to 3 dice, defender rolls up to 2
- Highest rolls are compared
- Losses are applied to both sides

### Example
- Your territory (3 troops) attacks enemy (2 troops)
- You roll: 5, 4, 2 → Best is 5
- Enemy rolls: 3 → Defense is 3
- 5 > 3 → Enemy loses 1 troop (now 1 troop)
- Combat ends, click again to attack next round

## 💾 Save & Load

### Save Game
- Click **"Save Game"** button
- Game state is stored in MySQL database
- Can resume later with **"Load Game"** button

### Load Game
- Click **"Load Game"**
- Most recent save is loaded automatically

## 🎯 Game Status

### Status Bar (Top Right)
- **Players** - Total player count
- **Turn** - Current player name
- **Game Status** - Current game phase

### Sidebar (Right)
- **Game Controls** - Start, Load, Save, Reset
- **Players** - List of all players and their stats
- **Territory Info** - Details of selected territory
- **Game Log** - History of all actions

## ⚡ Animations

The game includes beautiful animations:
- ✨ **Attack Animation** - Projectiles fly between territories
- 💥 **Explosions** - Particle effects on hit/miss
- 🌟 **Victory Effect** - Golden particles on conquest
- ⭐ **Selection Glow** - Territory pulses when selected

## 🔧 Advanced Features

### Multi-Dice Battle System
- Attackers roll up to 3 dice (if they have 4+ troops)
- Defenders roll up to 2 dice (if they have 2+ troops)
- Each die is compared one-to-one
- Highest rolls compared first

### Territory Adjacency
Each territory can only attack neighbors:
- North America ↔ South America, Europe, Russia
- Europe ↔ North America, Africa, Russia, Middle East
- Africa ↔ Europe, Middle East, Asia, India
- Asia ↔ Middle East, Russia, India, Southeast Asia, Australia
- And more!

### Player Elimination
- Players with no territories are eliminated
- Last player standing wins!

## 🌐 Online Hosting

### Requirements
- Web hosting with PHP 7.4+
- MySQL 5.7+
- FTP access

### Setup Steps
1. Upload all files to web hosting
2. Create MySQL database (or use provided cpanel)
3. Edit `php/db.php` with your database credentials:
   ```php
   private $host = 'your-host.com';
   private $db_name = 'your-database';
   private $username = 'your-username';
   private $password = 'your-password';
   ```
4. Database tables auto-create on first save

### Recommended Hosts
- **Bluehost** - Good WordPress hosting, supports PHP
- **SiteGround** - Fast, reliable, great support
- **HostGator** - Affordable, good for games
- **A2 Hosting** - High-performance, turbo accounts

## 🐛 Troubleshooting

### Game won't load
**Problem**: Blank page or errors in console
- **Solution**: 
  - Check browser console (F12 → Console tab)
  - Ensure all .js files are loaded
  - Refresh page (Ctrl+F5)
  - Check XAMPP MySQL is running

### Can't click territories
**Problem**: Click doesn't select territory
- **Solution**:
  - Make sure game is started (not in menu)
  - Territory must be within 35px radius
  - Try clicking center of territory circle

### Battle not working
**Problem**: Can't attack enemy territory
- **Solutions**:
  - Territories must be adjacent (connected)
  - Need at least 2 troops to attack
  - Can only attack enemy territories
  - Click your territory first, then enemy

### Database connection error
**Problem**: Can't save game - database error
- **Solutions**:
  - Check MySQL is running in XAMPP
  - Verify credentials in php/db.php
  - Check database was created
  - Try refreshing and saving again

### Poor performance
**Problem**: Game lags or animations stutter
- **Solutions**:
  - Reduce browser zoom level
  - Close other tabs
  - Update graphics drivers
  - Use Chrome or Firefox (better performance)

## 📊 Stats & Leaderboard

### View Stats
- **Sidebar** shows player information
- Territory count displayed
- Actual troop numbers visible

### Game Log
- All actions logged with timestamps
- See attack results and conquests
- Track game progression

## 🎨 Customization

### Change Colors
Edit `js/game.js`, find `initializeTerritories()`:
```javascript
{ id: 1, name: 'North America', x: 150, y: 150, color: '#e74c3c' }
```
Change the hex color code.

### Change Territory Positions
Edit x,y coordinates in `initializeTerritories()`:
```javascript
{ id: 1, name: 'North America', x: 150, y: 150, ... }
                                    x      y
```

### Adjust Game Speed
Edit animation durations in `js/animations.js`:
```javascript
this.duration = 800; // milliseconds
```

## 💡 Tips & Tricks

1. **Spread Your Forces** - Don't concentrate troops in one territory
2. **Defend Borders** - Keep border territories well-defended
3. **Map Control** - Control chokepoints between regions
4. **Diplomatic Alliances** - In multiplayer, consider temporary alliances
5. **Late Game** - As map consolidates, big armies become powerful
6. **Save Often** - Save before risky battles

## 🏆 Winning Strategy

1. **Early Game** - Establish solid borders
2. **Mid Game** - Consolidate territories and build armies
3. **Late Game** - Use numerical advantage to expand
4. **Endgame** - Eliminate one opponent at a time

## 📞 Support

For issues or suggestions:
1. Check the troubleshooting section above
2. Check browser console for errors (F12)
3. Check README.md for more details
4. Verify all files are present

## 🚀 Coming Soon

- AI players (easy/medium/hard)
- Real-time multiplayer
- Mobile app version
- Sound and music
- 3D map view
- Tournament mode
- Achievements

Enjoy your conquest of the world! 🌍⚔️
