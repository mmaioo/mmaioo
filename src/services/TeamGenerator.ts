import { Team, Player } from '../types';
import { PlayerGenerator } from './PlayerGenerator';
import { teamNames } from '../data/playerNames';

export class TeamGenerator {
  private playerGenerator: PlayerGenerator;
  private usedTeamNames: Set<string> = new Set();

  constructor() {
    this.playerGenerator = new PlayerGenerator();
  }

  generateTeam(playersPerTeam: number = 12): Team {
    const teamInfo = this.getUniqueTeamName();
    const players = this.playerGenerator.generateMultiplePlayers(playersPerTeam, true);

    const team: Team = {
      id: this.generateId(),
      name: teamInfo.name,
      city: teamInfo.city,
      players: players.map(p => ({ ...p, teamId: '' })),
      wins: 0,
      losses: 0
    };

    team.players.forEach(p => p.teamId = team.id);

    return team;
  }

  generateMultipleTeams(count: number, playersPerTeam: number = 12): Team[] {
    const teams: Team[] = [];
    for (let i = 0; i < count; i++) {
      teams.push(this.generateTeam(playersPerTeam));
    }
    return teams;
  }

  private generateId(): string {
    return `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUniqueTeamName(): { city: string; name: string } {
    const availableTeams = teamNames.filter(
      t => !this.usedTeamNames.has(`${t.city} ${t.name}`)
    );

    if (availableTeams.length === 0) {
      const randomCity = ['New', 'North', 'South', 'East', 'West'][Math.floor(Math.random() * 5)];
      const randomName = ['Stars', 'Thunder', 'Lightning', 'Storm', 'Fire'][Math.floor(Math.random() * 5)];
      return { city: randomCity, name: randomName };
    }

    const selected = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    this.usedTeamNames.add(`${selected.city} ${selected.name}`);
    return selected;
  }

  reset(): void {
    this.usedTeamNames.clear();
    this.playerGenerator.reset();
  }
}
