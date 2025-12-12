import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { LeagueManager } from './services/LeagueManager';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let leagueManager = new LeagueManager();

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Fantasy Basketball League API is running' });
});

// Create new league
app.post('/api/league/create', (req: Request, res: Response) => {
  const { numberOfTeams = 8, playersPerTeam = 12, leagueName } = req.body;

  if (leagueName) {
    leagueManager = new LeagueManager(leagueName);
  } else {
    leagueManager = new LeagueManager();
  }

  const league = leagueManager.createLeague(numberOfTeams, playersPerTeam);
  res.json({
    success: true,
    message: `League created with ${numberOfTeams} teams`,
    data: league
  });
});

// Get league info
app.get('/api/league', (req: Request, res: Response) => {
  const league = leagueManager.getLeague();
  res.json({ success: true, data: league });
});

// Get all teams
app.get('/api/teams', (req: Request, res: Response) => {
  const teams = leagueManager.getTeams();
  res.json({ success: true, data: teams });
});

// Get specific team
app.get('/api/teams/:teamId', (req: Request, res: Response) => {
  const team = leagueManager.getTeam(req.params.teamId);
  if (!team) {
    res.status(404).json({ success: false, message: 'Team not found' });
    return;
  }
  res.json({ success: true, data: team });
});

// Get all matches
app.get('/api/matches', (req: Request, res: Response) => {
  const matches = leagueManager.getMatches();
  res.json({ success: true, data: matches });
});

// Get specific match
app.get('/api/matches/:matchId', (req: Request, res: Response) => {
  const match = leagueManager.getMatch(req.params.matchId);
  if (!match) {
    res.status(404).json({ success: false, message: 'Match not found' });
    return;
  }
  res.json({ success: true, data: match });
});

// Simulate a single match
app.post('/api/matches/simulate', (req: Request, res: Response) => {
  const { homeTeamId, awayTeamId } = req.body;

  if (!homeTeamId || !awayTeamId) {
    res.status(400).json({
      success: false,
      message: 'homeTeamId and awayTeamId are required'
    });
    return;
  }

  const match = leagueManager.simulateMatch(homeTeamId, awayTeamId);

  if (!match) {
    res.status(404).json({
      success: false,
      message: 'One or both teams not found'
    });
    return;
  }

  res.json({ success: true, data: match });
});

// Simulate entire season
app.post('/api/season/simulate', (req: Request, res: Response) => {
  const matches = leagueManager.simulateSeason();
  res.json({
    success: true,
    message: `Simulated ${matches.length} matches`,
    data: matches
  });
});

// Get standings
app.get('/api/standings', (req: Request, res: Response) => {
  const standings = leagueManager.getStandings();
  res.json({ success: true, data: standings });
});

// Reset league
app.post('/api/league/reset', (req: Request, res: Response) => {
  leagueManager.reset();
  res.json({ success: true, message: 'League statistics reset' });
});

app.listen(port, () => {
  console.log(`🏀 Fantasy Basketball League API running on http://localhost:${port}`);
  console.log(`📊 API Documentation: http://localhost:${port}/`);
});
