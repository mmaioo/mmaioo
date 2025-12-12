import { Player, PlayerStats } from '../types';
import { randomInRange, randomInt, normalDistribution, clamp } from '../utils/helpers';
import { firstNames, lastNames } from '../data/playerNames';

export class PlayerGenerator {
  private usedNames: Set<string> = new Set();

  generatePlayer(position?: 'PG' | 'SG' | 'SF' | 'PF' | 'C'): Player {
    const selectedPosition = position || this.randomPosition();
    const overall = this.generateOverall();
    const name = this.generateUniqueName();

    return {
      id: this.generateId(),
      name,
      position: selectedPosition,
      overall,
      stats: this.generateStats(selectedPosition, overall)
    };
  }

  generateMultiplePlayers(count: number, balancePositions: boolean = true): Player[] {
    const players: Player[] = [];

    if (balancePositions) {
      const positions: ('PG' | 'SG' | 'SF' | 'PF' | 'C')[] = ['PG', 'SG', 'SF', 'PF', 'C'];
      const playersPerPosition = Math.floor(count / 5);
      const remainder = count % 5;

      for (const position of positions) {
        const numPlayers = playersPerPosition + (positions.indexOf(position) < remainder ? 1 : 0);
        for (let i = 0; i < numPlayers; i++) {
          players.push(this.generatePlayer(position));
        }
      }
    } else {
      for (let i = 0; i < count; i++) {
        players.push(this.generatePlayer());
      }
    }

    return players;
  }

  private generateId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateUniqueName(): string {
    let name: string;
    let attempts = 0;

    do {
      const firstName = firstNames[randomInt(0, firstNames.length - 1)];
      const lastName = lastNames[randomInt(0, lastNames.length - 1)];
      name = `${firstName} ${lastName}`;
      attempts++;

      if (attempts > 100) {
        name = `${firstName} ${lastName} ${randomInt(1, 99)}`;
        break;
      }
    } while (this.usedNames.has(name));

    this.usedNames.add(name);
    return name;
  }

  private randomPosition(): 'PG' | 'SG' | 'SF' | 'PF' | 'C' {
    const positions: ('PG' | 'SG' | 'SF' | 'PF' | 'C')[] = ['PG', 'SG', 'SF', 'PF', 'C'];
    return positions[randomInt(0, positions.length - 1)];
  }

  private generateOverall(): number {
    const overall = normalDistribution(75, 8);
    return Math.round(clamp(overall, 60, 99));
  }

  private generateStats(position: string, overall: number): PlayerStats {
    const baseFactor = overall / 80;

    const positionModifiers = {
      PG: { points: 0.9, rebounds: 0.5, assists: 1.5, steals: 1.2, blocks: 0.3 },
      SG: { points: 1.2, rebounds: 0.6, assists: 0.8, steals: 1.0, blocks: 0.4 },
      SF: { points: 1.0, rebounds: 0.8, assists: 0.9, steals: 0.9, blocks: 0.6 },
      PF: { points: 0.9, rebounds: 1.2, assists: 0.6, steals: 0.7, blocks: 1.0 },
      C: { points: 0.8, rebounds: 1.5, assists: 0.4, steals: 0.5, blocks: 1.5 }
    };

    const modifier = positionModifiers[position as keyof typeof positionModifiers];

    const points = clamp(normalDistribution(18 * baseFactor * modifier.points, 4), 5, 35);
    const rebounds = clamp(normalDistribution(8 * baseFactor * modifier.rebounds, 2), 1, 15);
    const assists = clamp(normalDistribution(5 * baseFactor * modifier.assists, 2), 1, 12);
    const steals = clamp(normalDistribution(1.5 * baseFactor * modifier.steals, 0.5), 0.3, 3);
    const blocks = clamp(normalDistribution(1 * baseFactor * modifier.blocks, 0.5), 0.1, 4);

    const fgBase = 0.40 + (overall - 60) / 100;
    const fieldGoalPercentage = clamp(normalDistribution(fgBase, 0.05), 0.35, 0.65);

    const tpBase = position === 'PG' || position === 'SG' ? 0.36 : 0.32;
    const threePointPercentage = clamp(normalDistribution(tpBase + (overall - 70) / 200, 0.05), 0.25, 0.50);

    const ftBase = 0.70 + (overall - 60) / 80;
    const freeThrowPercentage = clamp(normalDistribution(ftBase, 0.05), 0.60, 0.95);

    return {
      points: parseFloat(points.toFixed(1)),
      rebounds: parseFloat(rebounds.toFixed(1)),
      assists: parseFloat(assists.toFixed(1)),
      steals: parseFloat(steals.toFixed(1)),
      blocks: parseFloat(blocks.toFixed(1)),
      fieldGoalPercentage: parseFloat(fieldGoalPercentage.toFixed(3)),
      threePointPercentage: parseFloat(threePointPercentage.toFixed(3)),
      freeThrowPercentage: parseFloat(freeThrowPercentage.toFixed(3))
    };
  }

  reset(): void {
    this.usedNames.clear();
  }
}
