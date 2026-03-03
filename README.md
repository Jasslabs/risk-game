# Risk Game - World Domination

A modern, animated Risk game built with HTML5, CSS3, JavaScript, PHP, and MySQL. Play online with beautiful animations and persistent game storage.

## Features

✨ **Beautiful Animations**
- Smooth territory selection and movement
- Attack and conquest animations
- Particle effects and visual feedback
- Pulsing territory highlights

🎮 **Rich Gameplay**
- Multiple players (2-6)
- Turn-based strategy
- Territory control and battles
- Troops management
- Game save/load functionality

📊 **Backend Storage**
- PHP API for game management
- MySQL database for persistence
- Battle log tracking
- Game history

🎨 **Modern UI**
- Responsive design
- Real-time game status
- Player information panel
- Territory details sidebar
- Game log with timestamps

## Project Structure

```
risk-game/
├── index.html          # Main game page
├── css/
│   └── styles.css      # Game styling and animations
├── js/
│   ├── game.js         # Main game logic
│   ├── graphics.js     # Canvas rendering engine
│   └── animations.js   # Animation system
├── php/
│   ├── api.php         # Game API endpoints
│   └── db.php          # Database connection
├── images/             # Game assets
└── README.md           # This file
```

## Setup Instructions

### Prerequisites
- XAMPP (or similar local server with PHP and MySQL)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Move project to XAMPP**
   ```
   Copy the project to: C:\xampp\htdocs\aiprojectcopilot\
   ```

2. **Create MySQL Database**
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - The database will be created automatically on first API call

3. **Configure Database (optional)**
   - Edit `php/db.php` if using non-default credentials:
   ```php
   private $host = 'localhost';
   private $db_name = 'risk_game';
   private $username = 'root';
   private $password = '';
   ```

4. **Start XAMPP Services**
   - Start Apache and MySQL from XAMPP Control Panel

5. **Access the Game**
   - Open: `http://localhost/aiprojectcopilot/`

## How to Play

### Game Setup
1. Click **"Start New Game"**
2. Select number of players (2-6)
3. Enter player names and choose colors
4. Click **"Start Game"**

### Gameplay
1. **Territory Selection**: Click on territories to view details
2. **Attacks**: Select an attacking territory, then click an adjacent enemy territory
3. **Movements**: Drag troops between your territories
4. **Battle Results**: Rolls determine victory (higher roll wins)
5. **Save Game**: Click "Save Game" to persist progress

### Game Rules
- **Territories**: Each territory is controlled by 1 player
- **Troops**: Represent military forces in each territory
- **Adjacent**: Only attack neighboring territories
- **Battle**: Attackers and defenders each roll 1d6
- **Conquest**: Attacker wins if roll > defender's roll

## Game Mechanics

### Attack System
- Select attacking territory
- Click adjacent enemy territory
- Both roll dice (higher wins)
- Successful attack: enemy loses 1 troop
- Failed attack: no change

### Territory Control
- Must own adjacent territory to attack
- Neutral territories start with 1 troop
- Player territories start with 1 troop
- Gain troops each turn

### Animations
- **Attack Animation**: Projectiles fly between territories
- **Victory Effect**: Gold particles on conquest
- **Defeat Effect**: Gray particles on loss
- **Troop Movement**: Units move between territories
- **Highlight Pulse**: Selected territory pulses

## API Endpoints

### Save Game
```
POST /php/api.php
Content-Type: application/json

{
  "action": "save_game",
  "gameData": { /* game state */ }
}
```

### Load Games
```
GET /php/api.php?action=load_games
```

### Load Game
```
GET /php/api.php?action=load_game&gameId=1
```

### Delete Game
```
POST /php/api.php
{
  "action": "delete_game",
  "gameId": 1
}
```

### Save Battle Log
```
POST /php/api.php
{
  "action": "save_battle_log",
  "gameId": 1,
  "attacking": "territory_name",
  "defending": "territory_name",
  "result": { /* battle data */ }
}
```

## Database Schema

### games table
- `id` (INT, PRIMARY KEY)
- `game_data` (LONGTEXT) - JSON-encoded game state
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### battle_logs table
- `id` (INT, PRIMARY KEY)
- `game_id` (INT, FOREIGN KEY)
- `attacking_territory` (VARCHAR)
- `defending_territory` (VARCHAR)
- `result` (VARCHAR) - JSON battle result
- `created_at` (TIMESTAMP)

## Customization

### Change Colors
Edit `js/game.js` in `initializeTerritories()`:
```javascript
{ id: 1, name: 'North America', x: 150, y: 150, color: '#e74c3c' }
```

### Add Territories
1. Add new position in `initializeTerritories()`
2. Add adjacencies in `getAdjacentTerritories()`
3. Adjust canvas size if needed

### Modify Animations
Edit `js/animations.js`:
- `AttackAnimation` - projectile animation
- `TroopMovement` - troop movement effect
- `Particle` - particle system
- Create custom animations inheriting from animation classes

### Change Styles
Edit `css/styles.css`:
- Color scheme (gradient, buttons)
- Canvas size and layout
- Animation timings
- Responsive breakpoints

## Features to Implement

- [ ] AI Players (easy, medium, hard)
- [ ] Multiplayer networking (WebSocket)
- [ ] Sound effects and music
- [ ] 3D map view
- [ ] Mobile app version
- [ ] Chat system
- [ ] Leaderboard
- [ ] Achievements system
- [ ] Replay system
- [ ] Tournament mode

## Performance Tips

- Optimize canvas rendering: batch operations
- Use RequestAnimationFrame (already implemented)
- Minimize DOM queries
- Lazy load images
- Compress game state data

## Troubleshooting

### Database Connection Error
- Check XAMPP MySQL is running
- Verify credentials in `php/db.php`
- Ensure `mysqli` or `PDO` extensions are enabled

### Canvas Not Rendering
- Check browser console for JS errors
- Verify canvas element exists in HTML
- Check canvas size and context

### Animations Not Showing
- Verify animations.js is loaded
- Check animation duration values
- Ensure render() is called in game loop

### Game Not Saving
- Check PHP error log
- Verify API endpoint URL is correct
- Ensure POST request includes Content-Type header

## Hosting Online

### Requirements
- Web hosting with PHP 7.4+ and MySQL 5.7+
- FTP/SSH access to upload files

### Steps
1. Upload all files to web server
2. Update database credentials in `php/db.php`
3. Create database on hosting
4. Set proper file permissions (644 for files, 755 for folders)
5. Access via your domain

### Recommended Hosting
- Bluehost
- SiteGround
- HostGator
- A2 Hosting

## License

This project is open source and available under the MIT License.

## Support

For issues, suggestions, or contributions, please create an issue in the repository.

## Future Improvements

- Real-time multiplayer with WebSockets
- Machine learning AI opponents
- Advanced graphics (3D WebGL rendering)
- Mobile responsive game board
- VR support
- Cloud save sync
- Social features

---

**Happy Strategic Gaming!** 🎮⚔️
