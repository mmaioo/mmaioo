import { League, Team, MatchResult } from '../types';
import { TeamGenerator } from './TeamGenerator';
import { MatchSimulator } from './MatchSimulator';

export class LeagueManager {
  private league: League;
  private teamGenerator: TeamGenerator;
  private matchSimulator: MatchSimulator;

  constructor(leagueName: string = 'Fantasy Basketball League') {
    this.teamGenerator = new TeamGenerator();
    this.matchSimulator = new MatchSimulator();

    this.league = {
      id: this.generateId(),
      name: leagueName,
      teams: [],
      matches: []
    };
  }

  createLeague(numberOfTeams: number, playersPerTeam: number = 12): League {
    this.league.teams = this.teamGenerator.generateMultipleTeams(numberOfTeams, playersPerTeam);
    this.league.matches = [];
    return this.getLeague();
  }

  getLeague(): League {
    return { ...this.league };
  }

  getTeams(): Team[] {
    return [...this.league.teams];
  }

  getTeam(teamId: string): Team | undefined {
    return this.league.teams.find(t => t.id === teamId);
  }

  getMatches(): MatchResult[] {
    return [...this.league.matches];
  }

  getMatch(matchId: string): MatchResult | undefined {
    return this.league.matches.find(m => m.id === matchId);
  }

  simulateMatch(homeTeamId: string, awayTeamId: string): MatchResult | null {
    const homeTeam = this.league.teams.find(t => t.id === homeTeamId);
    const awayTeam = this.league.teams.find(t => t.id === awayTeamId);

    if (!homeTeam || !awayTeam) {
      return null;
    }

    const match = this.matchSimulator.simulateMatch(homeTeam, awayTeam);
    this.league.matches.push(match);

    this.updateTeamRecords(match);

    return match;
  }

  simulateSeason(): MatchResult[] {
    const seasonMatches = this.matchSimulator.simulateMultipleMatches(this.league.teams);

    seasonMatches.forEach(match => {
      this.league.matches.push(match);
      this.updateTeamRecords(match);
    });

    return seasonMatches;
  }

  getStandings(): Array<Team & { winPercentage: number }> {
    return this.league.teams
      .map(team => ({
        ...team,
        winPercentage: team.wins + team.losses > 0
          ? parseFloat((team.wins / (team.wins + team.losses)).toFixed(3))
          : 0
      }))
      .sort((a, b) => b.winPercentage - a.winPercentage || b.wins - a.wins);
  }

  private updateTeamRecords(match: MatchResult): void {
    const homeTeam = this.league.teams.find(t => t.id === match.homeTeam.id);
    const awayTeam = this.league.teams.find(t => t.id === match.awayTeam.id);

    if (!homeTeam || !awayTeam) return;

    if (match.homeScore > match.awayScore) {
      homeTeam.wins++;
      awayTeam.losses++;
    } else {
      awayTeam.wins++;
      homeTeam.losses++;
    }
  }

  private generateId(): string {
    return `league_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  reset(): void {
    this.league.matches = [];
    this.league.teams.forEach(team => {
      team.wins = 0;
      team.losses = 0;
    });
  }
}
