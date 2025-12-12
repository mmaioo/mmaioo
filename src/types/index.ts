export interface PlayerStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fieldGoalPercentage: number;
  threePointPercentage: number;
  freeThrowPercentage: number;
}

export interface Player {
  id: string;
  name: string;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  overall: number;
  stats: PlayerStats;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  city: string;
  players: Player[];
  wins: number;
  losses: number;
}

export interface MatchResult {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  homeStats: PlayerStats[];
  awayStats: PlayerStats[];
  date: Date;
  winner: string;
}

export interface League {
  id: string;
  name: string;
  teams: Team[];
  matches: MatchResult[];
}
