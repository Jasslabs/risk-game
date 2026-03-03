# 🎮 RISK GAME - Getting Started in 5 Minutes

## Step 1: Start Your Local Server (1 minute)

### Windows:
1. Open **XAMPP Control Panel**
2. Click the green "Start" button next to **Apache**
3. Click the green "Start" button next to **MySQL**
4. Wait for both to show "*Running" in green

### Mac/Linux:
```bash
sudo /Applications/XAMPP/xamppfiles/bin/apachectl start
sudo /Applications/XAMPP/xamppfiles/bin/mysqld_safe &
```

## Step 2: Open the Game (30 seconds)

1. Open your web browser (Chrome, Firefox, Safari, Edge)
2. Go to this URL:
   ```
   http://localhost/aiprojectcopilot/
   ```
3. You should see the game title "⚔️ RISK: World Domination" appear

## Step 3: Start Playing (2-3 minutes)

### Create a Game:
1. Click the blue **"Start New Game"** button
2. Select number of players (2-6)
3. Enter names for each player
4. Pick a color for each player (click the colored box)
5. Click **"Start Game"** (green button)

### Play the Game:
1. You'll see a map with colored circles (territories)
2. **Click on a territory you own** (it pulses with gold border)
3. **Click on an adjacent enemy territory** to attack it
4. **Battle happens automatically** - dice are rolled and losses applied
5. **Keep attacking** until you or an enemy is eliminated
6. **First to own ALL territories WINS!** 🏆

## Step 4: Save Your Game (optional)

- Click **"Save Game"** button to save progress
- Click **"Load Game"** button to resume later
- Games are stored in database

## 🎮 Basic Controls

| Action | How |
|--------|-----|
| Select Territory | Click on it |
| Attack | Click your territory, then click enemy |
| View Info | Click territory in sidebar |
| Save Game | Click "Save Game" button |
| Load Game | Click "Load Game" button |
| New Game | Click "Reset" then "Start New Game" |

## ⚡ Game Rules (Super Simple)

### How Battles Work:
1. You click your territory → click enemy
2. Both roll dice (you roll up to 3, they roll up to 2)
3. Highest number wins (loser loses 1 troop)
4. Repeat until one side is out of troops
5. When defender has 0 troops, you conquer territory!

### Example Battle:
```
Your Territory (4 troops) attacks Enemy (2 troops)

Round 1:
You roll: 5 (winner!)    Enemy: 3  → Enemy loses 1 troop (now 1)

Round 2: 
You roll: 2 (loser)      Enemy: 4  → You lose 1 troop (now 3)

You could attack again if you have ≥2 troops, or wait...
```

### How to Win:
- Control all 10 territories on the map
- Last player standing wins
- Defeated players are eliminated

## 🐛 Troubleshooting

### "Game won't load" or blank page?
1. Check XAMPP - Apache and MySQL must be running
2. Close other browser tabs
3. Hard refresh: Press **Ctrl+F5**
4. Try Chrome browser instead
5. Run diagnostics: go to `http://localhost/aiprojectcopilot/diagnostics.html`

### "Can't click territories"?
1. Make sure game is started (not in menu)
2. Click in the CENTER of the colored circle
3. Need at least 2 troops to attack
4. Can only attack ADJACENT territories (connected)

### "Can't save game"?
1. Make sure MySQL is running in XAMPP
2. Refresh page and try again
3. Check if you're seeing error in console (F12)
4. Try restarting XAMPP

### "Game is slow/laggy"?
1. Close other browser tabs
2. Reduce browser zoom to 100% (Ctrl+0)
3. Try Chrome (fastest)
4. Update your graphics drivers
5. Restart browser

## 📱 Can I play on my phone?

Not yet! But you can make it happen:
- Works on iPad/tablets in responsive mode
- Need to add mobile UI
- Need touch support code
- In future roadmap!

## 🌐 Can I play online with friends?

Not yet! Current version is:
- ✅ Local multiplayer (same computer)
- ❌ Online multiplayer (different computers)

**Future plans:**
- Real-time multiplayer with WebSockets
- Chat system
- Leaderboards
- Probably by next month!

## 📊 How do I know who's winning?

Check the **right sidebar**:
- **Players section** shows all players
- **Your territories** = number of lands you control
- **Your troops** = total military strength
- First to 10 territories wins!
- Green highlight = currently playing

## 💾 Where are my saved games?

Games are saved in MySQL database:
- Database: `risk_game`
- Table: `games`
- Auto-created on first save
- Store: Game state as JSON

To restore:
- Click **"Load Game"** button
- Most recent game loads automatically

## 🎨 Can I customize the game?

Yes! Edit these files:

**Change colors:**
- Edit `js/game.js`
- Find `initializeTerritories()`
- Change hex color codes like `'#e74c3c'`

**Change territory names/positions:**
- Edit positions in `initializeTerritories()`
- Update adjacency list in `getAdjacentTerritories()`

**Change game speed:**
- Edit animation durations in `js/animations.js`
- Change `this.duration = 800` (milliseconds)

## 🚀 Deploy Online

Want to host this on the internet?

### Quick Hosting Setup:
1. Buy hosting with PHP + MySQL support
   - Bluehost, SiteGround, HostGator all work
   - ~$5-10/month
2. Upload all files via FTP
3. Create MySQL database
4. Update `php/db.php` with database credentials
5. Visit yourdomain.com/aiprojectcopilot/
6. Done! Share the link!

### Detailed Hosting Guide:
See `README.md` for full deployment instructions

## 🎓 Want to learn the code?

The game is a great learning project:
- **JavaScript** game development
- **HTML5 Canvas** graphics
- **Web APIs** (fetch for backend)
- **PHP** backend development
- **MySQL** database design
- **OOP** programming patterns

**File to start with:**
1. `index.html` - Structure
2. `css/styles.css` - Styling
3. `js/game.js` - Main logic (500+ lines, well-commented)
4. `js/graphics.js` - Canvas rendering
5. `js/animations.js` - Visual effects
6. `js/ai.js` - AI strategy (framework)
7. `php/api.php` - Backend API
8. `php/db.php` - Database

## ❓ What's Next?

### Immediately Available:
- ✅ Play locally with 2-6 players
- ✅ Save/load games
- ✅ Beautiful animations
- ✅ Strategic gameplay

### Coming Soon:
- 🔄 AI opponents
- 🌐 Online multiplayer
- 🔊 Sound effects
- 📱 Mobile support
- 🎧 Music
- 🏆 Achievements
- 📊 Leaderboard

## 🆘 If You Get Stuck

1. **Check the Diagnostics Page:**
   - Go to: `http://localhost/aiprojectcopilot/diagnostics.html`
   - Tests all systems
   - Shows if something is broken

2. **Open Browser Console:**
   - Press **F12** → Click **Console** tab
   - Look for red error messages
   - Try searching for the error online

3. **Read Documentation:**
   - `README.md` - Full documentation
   - `QUICKSTART.md` - Quick reference
   - `IMPROVEMENTS.md` - What's new

4. **Check XAMPP:**
   - Make sure Apache is running (green)
   - Make sure MySQL is running (green)
   - Look for port conflicts

## 🎯 Pro Tips

1. **Save before risky moves** - Helps you learn strategy
2. **Control map center** - Hard to defend borders
3. **Don't spread thin** - Concentrate forces
4. **Plan routes** - Know how to expand
5. **Apply pressure** - Force enemies to fight
6. **Watch the sidebar** - Know enemy strength

---

## 🏁 You're Ready to Play!

1. ✅ Server running?
2. ✅ Game loaded at http://localhost/aiprojectcopilot/?
3. ✅ Started a new game?
4. ✅ Ready to conquer?

**GO DOMINATE THE WORLD!** 🌍⚔️👑

---

**Questions?** Check:
- QUICKSTART.md (common issues)
- README.md (full docs)
- diagnostics.html (system check)
- Browser console (errors)

**Happy gaming!** 🎮
