import { Team, MatchResult, Player, PlayerStats } from '../types';
import { randomInRange, normalDistribution, clamp } from '../utils/helpers';

export class MatchSimulator {
  simulateMatch(homeTeam: Team, awayTeam: Team): MatchResult {
    const homeScore = this.calculateTeamScore(homeTeam, true);
    const awayScore = this.calculateTeamScore(awayTeam, false);

    const homeStats = this.generateMatchStats(homeTeam.players, homeScore);
    const awayStats = this.generateMatchStats(awayTeam.players, awayScore);

    const winner = homeScore > awayScore ? homeTeam.id : awayTeam.id;

    return {
      id: this.generateId(),
      homeTeam: { ...homeTeam },
      awayTeam: { ...awayTeam },
      homeScore,
      awayScore,
      homeStats,
      awayStats,
      date: new Date(),
      winner
    };
  }

  simulateMultipleMatches(teams: Team[]): MatchResult[] {
    const matches: MatchResult[] = [];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const match = this.simulateMatch(teams[i], teams[j]);
        matches.push(match);
      }
    }

    return matches;
  }

  private calculateTeamScore(team: Team, isHome: boolean): number {
    const teamAverage = team.players.reduce((sum, p) => sum + p.stats.points, 0);
    const homeAdvantage = isHome ? 3 : 0;

    const variance = normalDistribution(0, 8);
    const score = Math.round(teamAverage + homeAdvantage + variance);

    return Math.max(70, Math.min(140, score));
  }

  private generateMatchStats(players: Player[], teamScore: number): PlayerStats[] {
    const starters = this.selectStarters(players);
    const stats: PlayerStats[] = [];

    let totalPoints = 0;
    const playerScores: number[] = [];

    starters.forEach(player => {
      const expectedPoints = player.stats.points;
      const variance = normalDistribution(0, 5);
      const gamePoints = Math.max(0, Math.round(expectedPoints + variance));
      playerScores.push(gamePoints);
      totalPoints += gamePoints;
    });

    const scaleFactor = totalPoints > 0 ? teamScore / totalPoints : 1;

    starters.forEach((player, idx) => {
      const scaledPoints = Math.round(playerScores[idx] * scaleFactor);

      stats.push({
        points: scaledPoints,
        rebounds: Math.max(0, Math.round(player.stats.rebounds + normalDistribution(0, 2))),
        assists: Math.max(0, Math.round(player.stats.assists + normalDistribution(0, 1.5))),
        steals: Math.max(0, Math.round(player.stats.steals + normalDistribution(0, 0.5))),
        blocks: Math.max(0, Math.round(player.stats.blocks + normalDistribution(0, 0.5))),
        fieldGoalPercentage: parseFloat(clamp(
          player.stats.fieldGoalPercentage + normalDistribution(0, 0.08),
          0.2,
          0.8
        ).toFixed(3)),
        threePointPercentage: parseFloat(clamp(
          player.stats.threePointPercentage + normalDistribution(0, 0.1),
          0.1,
          0.6
        ).toFixed(3)),
        freeThrowPercentage: parseFloat(clamp(
          player.stats.freeThrowPercentage + normalDistribution(0, 0.08),
          0.5,
          1.0
        ).toFixed(3))
      });
    });

    return stats;
  }

  private selectStarters(players: Player[]): Player[] {
    const positions: ('PG' | 'SG' | 'SF' | 'PF' | 'C')[] = ['PG', 'SG', 'SF', 'PF', 'C'];
    const starters: Player[] = [];

    for (const position of positions) {
      const positionPlayers = players
        .filter(p => p.position === position)
        .sort((a, b) => b.overall - a.overall);

      if (positionPlayers.length > 0) {
        starters.push(positionPlayers[0]);
      }
    }

    while (starters.length < 5 && starters.length < players.length) {
      const remaining = players.filter(p => !starters.includes(p));
      if (remaining.length > 0) {
        starters.push(remaining[0]);
      } else {
        break;
      }
    }

    return starters;
  }

  private generateId(): string {
    return `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
