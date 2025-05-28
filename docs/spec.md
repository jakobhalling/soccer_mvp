## 1. Core Features & Functional Scope

### **1.1 Match setup and results (Admin Only)**
- Display all matches from schedule as a list.
  - Clicking a match line from list opens modal with two sub-sections:
  - **Match Setup**:
    - Assign players from the team’s extended squad to positions for this match.
    - This setup is expected to be completed before the match.
    - Assign players to positions. Drag and drop players from list to area representing goal keeper (restricted to one person), defenders (any number), midfielders (any number), forward (any number)
    - Adjust the visual representation of the pitch with the formation based on selected formation. Players can only be dragged to positions in the formation.
    - Multiple players can occupy the same position on the pitch.
    - One player can't occupy multiple positions.
  - **Match Results**:
    - Input event counts per player (based on assigned positions and event list).
      - All events except the ones automatically applied (see below) should be manually entered per player
    - MVP points are calculated based on the current point model.
    - Match can be marked as completed once results are entered.
    - Following rules and logic applies automatically to point attribution for players based on the defined point configuration model:
	- All players are automatically attributed points for match won
	- All players are automatically attributed points for match draw
 	- If zero goals conceded in match (clean sheet), goal keeper is automatically assigned corresponding points
	- If zero goals conceded in match (clean sheet), defenders are automatically assigned corresponding points
  

### **1.2 Administration (Admin Only)**
- **Team Setup**
  - Create/edit team name and logo.
  - Each team has its own unique public scoreboard URL. Allow to see and copy URL for sharing with non-admin players (domain.com/team/"team-name")
  - Add/edit/delete players in the extended squad for the team.
  - (players are not assigned to matches here)
- **Match Schedule**
  - Create/edit/delete season/tournament (with name)
  - Create/edit/delete matches within season/tournament (with date/time, opponent, optional location).
- **Point Model Configuration**
  - Admin UI to manage points per event per position (based on table provided).
  - Includes shared "All" events (cards, own goals).
  - Events Clean sheet, match win, goals conceded, is deducted based on match result

### **1.3 Scoreboard (Public Viewer Access)**
- Display cumulative MVP points for all players across all completed matches.
- Sorted by total MVP points (descending).
- Includes breakdown of events per player.
- Optional filter: show MVP points per match (via dropdown or match selector).
- Scoreboard is team-specific and accessible without login.
- Score is calucated using point model on page load.
- Scoreboard shows only unique events, as events such as assist, goal scored etc. overlap across positions.

### **1.4 Frontpage (Find your team)**
- Simple search functionality (search bar) with auto-suggest helping user to find existing clubs and teams by name

### **1.5 Login **
- Simple login feature for team administrators
- Accessible in right corner of topbar 
---

## 🔐 3. User Management

- **Administrator (Admin only - Login Required)**
  - Can manage all admin functionality listed above.
  - Login is scoped to a single team.
- **Viewer (No Login)**
  - Can view scoreboard only via public URL.

---

## 🖥️ 4. Interface Breakdown

### Web App Pages:
## Public pages
1. **Frontpage** Contains "Find your team" search functionality
2. **Scoreboard**
   - Team branding at top
   - see 1.3
## Administrator pages (accessible via top bar when logged in)
1. **Administration**
   - See 1.2
2. **Match Setup and Results**
   - See 1.1
   
