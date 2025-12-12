const API_URL = 'http://localhost:3000/api';

let currentLeague = null;
let currentTeams = [];

// Event Listeners
document.getElementById('createLeague').addEventListener('click', createLeague);
document.getElementById('simulateSeason').addEventListener('click', simulateSeason);
document.getElementById('resetLeague').addEventListener('click', resetLeague);
document.getElementById('simulateMatchBtn').addEventListener('click', simulateMatch);

// Create League
async function createLeague() {
    const numTeams = document.getElementById('numTeams').value;
    const playersPerTeam = document.getElementById('playersPerTeam').value;
    const leagueName = document.getElementById('leagueName').value;

    try {
        const response = await fetch(`${API_URL}/league/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                numberOfTeams: parseInt(numTeams),
                playersPerTeam: parseInt(playersPerTeam),
                leagueName: leagueName || undefined
            })
        });

        const result = await response.json();
        if (result.success) {
            currentLeague = result.data;
            currentTeams = result.data.teams;
            updateUI();
            alert('Lega creata con successo!');
        }
    } catch (error) {
        console.error('Error creating league:', error);
        alert('Errore nella creazione della lega');
    }
}

// Simulate Season
async function simulateSeason() {
    try {
        const response = await fetch(`${API_URL}/season/simulate`, {
            method: 'POST'
        });

        const result = await response.json();
        if (result.success) {
            await loadLeagueData();
            alert(`Stagione simulata! ${result.data.length} partite giocate.`);
        }
    } catch (error) {
        console.error('Error simulating season:', error);
        alert('Errore nella simulazione della stagione');
    }
}

// Reset League
async function resetLeague() {
    if (!confirm('Vuoi davvero resettare le statistiche della lega?')) return;

    try {
        const response = await fetch(`${API_URL}/league/reset`, {
            method: 'POST'
        });

        const result = await response.json();
        if (result.success) {
            await loadLeagueData();
            alert('Statistiche resettate!');
        }
    } catch (error) {
        console.error('Error resetting league:', error);
        alert('Errore nel reset della lega');
    }
}

// Simulate Single Match
async function simulateMatch() {
    const homeTeamId = document.getElementById('homeTeamSelect').value;
    const awayTeamId = document.getElementById('awayTeamSelect').value;

    if (!homeTeamId || !awayTeamId) {
        alert('Seleziona entrambe le squadre');
        return;
    }

    if (homeTeamId === awayTeamId) {
        alert('Seleziona squadre diverse');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/matches/simulate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ homeTeamId, awayTeamId })
        });

        const result = await response.json();
        if (result.success) {
            await loadLeagueData();
            alert('Partita simulata con successo!');
        }
    } catch (error) {
        console.error('Error simulating match:', error);
        alert('Errore nella simulazione della partita');
    }
}

// Load League Data
async function loadLeagueData() {
    try {
        const [standingsRes, teamsRes, matchesRes] = await Promise.all([
            fetch(`${API_URL}/standings`),
            fetch(`${API_URL}/teams`),
            fetch(`${API_URL}/matches`)
        ]);

        const standings = await standingsRes.json();
        const teams = await teamsRes.json();
        const matches = await matchesRes.json();

        if (standings.success) displayStandings(standings.data);
        if (teams.success) {
            currentTeams = teams.data;
            displayTeams(teams.data);
            updateTeamSelects(teams.data);
        }
        if (matches.success) displayMatches(matches.data);
    } catch (error) {
        console.error('Error loading league data:', error);
    }
}

// Display Standings
function displayStandings(standings) {
    const container = document.getElementById('standingsTable');

    if (standings.length === 0) {
        container.innerHTML = '<p>Nessuna classifica disponibile. Crea una lega per iniziare.</p>';
        return;
    }

    let html = `
        <div class="standings-table">
            <table>
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Squadra</th>
                        <th>V</th>
                        <th>S</th>
                        <th>%</th>
                    </tr>
                </thead>
                <tbody>
    `;

    standings.forEach((team, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${team.city} ${team.name}</strong></td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td>${(team.winPercentage * 100).toFixed(1)}%</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

// Display Teams
function displayTeams(teams) {
    const container = document.getElementById('teamsContainer');

    if (teams.length === 0) {
        container.innerHTML = '<p>Nessuna squadra disponibile. Crea una lega per iniziare.</p>';
        return;
    }

    let html = '';

    teams.forEach(team => {
        const topPlayers = team.players
            .sort((a, b) => b.overall - a.overall)
            .slice(0, 5);

        html += `
            <div class="team-card">
                <div class="team-header">
                    <div class="team-name">${team.city} ${team.name}</div>
                    <div class="team-record">${team.wins}W - ${team.losses}L</div>
                </div>
                <div><strong>Top 5 Giocatori:</strong></div>
                <div class="players-grid">
        `;

        topPlayers.forEach(player => {
            html += `
                <div class="player-card">
                    <div class="player-name">${player.name}</div>
                    <div class="player-stats">
                        ${player.position} | OVR: ${player.overall}<br>
                        ${player.stats.points} PTS | ${player.stats.rebounds} REB | ${player.stats.assists} AST
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Display Matches
function displayMatches(matches) {
    const container = document.getElementById('matchesContainer');

    if (matches.length === 0) {
        container.innerHTML = '<p>Nessuna partita giocata. Simula partite o una stagione completa.</p>';
        return;
    }

    let html = '';

    matches.slice().reverse().slice(0, 10).forEach(match => {
        const homeWin = match.homeScore > match.awayScore;
        const awayWin = match.awayScore > match.homeScore;

        html += `
            <div class="match-card">
                <div class="match-teams">
                    <span class="${homeWin ? 'winner' : ''}">${match.homeTeam.city} ${match.homeTeam.name}</span>
                    <span class="match-score">${match.homeScore} - ${match.awayScore}</span>
                    <span class="${awayWin ? 'winner' : ''}">${match.awayTeam.city} ${match.awayTeam.name}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Update Team Selects
function updateTeamSelects(teams) {
    const homeSelect = document.getElementById('homeTeamSelect');
    const awaySelect = document.getElementById('awayTeamSelect');

    const options = teams.map(team =>
        `<option value="${team.id}">${team.city} ${team.name}</option>`
    ).join('');

    homeSelect.innerHTML = '<option value="">Seleziona squadra casa</option>' + options;
    awaySelect.innerHTML = '<option value="">Seleziona squadra trasferta</option>' + options;
}

// Update UI
function updateUI() {
    loadLeagueData();
}

// Initial check
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_URL}/health`);
        const result = await response.json();
        console.log('API Status:', result);
    } catch (error) {
        console.error('Cannot connect to API:', error);
        alert('Impossibile connettersi al server. Assicurati che il server sia avviato.');
    }
});
