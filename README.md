# 🏀 Fantasy Basketball League

Un'applicazione completa per gestire una lega di fantabasket con generazione AI di giocatori, squadre e simulazione di partite.

## 🎯 Caratteristiche

- **Generazione AI di Giocatori**: Crea giocatori con statistiche realistiche basate su posizione e overall
- **Gestione Squadre**: Genera squadre complete con roster bilanciati
- **Simulazione Partite**: Motore di simulazione che calcola i risultati delle partite
- **Classifica**: Sistema di classifica con vittorie, sconfitte e percentuali
- **API REST**: API completa per gestire tutti gli aspetti della lega
- **Interfaccia Web**: Frontend intuitivo per gestire la lega

## 🚀 Installazione

### Prerequisiti

- Node.js (v16 o superiore)
- npm o yarn

### Setup

1. Clona il repository:
```bash
git clone <repository-url>
cd mmaioo
```

2. Installa le dipendenze:
```bash
npm install
```

3. Crea il file `.env` (opzionale):
```bash
cp .env.example .env
```

4. Compila il progetto TypeScript:
```bash
npm run build
```

## 📦 Comandi Disponibili

- `npm run build` - Compila il progetto TypeScript
- `npm start` - Avvia l'applicazione (richiede compilazione)
- `npm run dev` - Avvia in modalità sviluppo con ts-node

## 🎮 Utilizzo

### Avvio del Server

```bash
npm run dev
```

Il server sarà disponibile su `http://localhost:3000`

### Interfaccia Web

Apri il browser e vai su `http://localhost:3000`

L'interfaccia permette di:
- Creare una nuova lega con un numero personalizzato di squadre
- Simulare partite singole tra due squadre
- Simulare un'intera stagione (round-robin)
- Visualizzare la classifica in tempo reale
- Vedere i dettagli delle squadre e dei giocatori
- Resettare le statistiche della lega

## 🔌 API Endpoints

### League Management

**Crea una nuova lega**
```http
POST /api/league/create
Content-Type: application/json

{
  "numberOfTeams": 8,
  "playersPerTeam": 12,
  "leagueName": "My League"
}
```

**Ottieni informazioni sulla lega**
```http
GET /api/league
```

**Reset statistiche**
```http
POST /api/league/reset
```

### Teams

**Lista tutte le squadre**
```http
GET /api/teams
```

**Dettagli squadra specifica**
```http
GET /api/teams/:teamId
```

### Matches

**Lista tutte le partite**
```http
GET /api/matches
```

**Dettagli partita specifica**
```http
GET /api/matches/:matchId
```

**Simula una partita**
```http
POST /api/matches/simulate
Content-Type: application/json

{
  "homeTeamId": "team_123",
  "awayTeamId": "team_456"
}
```

**Simula un'intera stagione**
```http
POST /api/season/simulate
```

### Standings

**Ottieni la classifica**
```http
GET /api/standings
```

## 🏗️ Struttura del Progetto

```
mmaioo/
├── src/
│   ├── data/
│   │   └── playerNames.ts       # Database nomi giocatori e squadre
│   ├── services/
│   │   ├── PlayerGenerator.ts   # Generatore AI di giocatori
│   │   ├── TeamGenerator.ts     # Generatore di squadre
│   │   ├── MatchSimulator.ts    # Motore simulazione partite
│   │   └── LeagueManager.ts     # Gestore della lega
│   ├── types/
│   │   └── index.ts             # Definizioni TypeScript
│   ├── utils/
│   │   └── helpers.ts           # Funzioni di utilità
│   └── index.ts                 # Server Express
├── public/
│   ├── index.html               # Frontend HTML
│   ├── styles.css               # Stili CSS
│   └── app.js                   # Logica frontend
├── dist/                        # File compilati (generati)
├── package.json
├── tsconfig.json
└── README.md
```

## 🎲 Come Funziona

### Generazione Giocatori

I giocatori vengono generati con:
- **Nomi realistici**: Combinazione di nomi e cognomi da un database di giocatori NBA
- **Posizioni**: PG, SG, SF, PF, C
- **Overall**: Valutazione generale del giocatore (60-99)
- **Statistiche**:
  - Punti, rimbalzi, assist, rubate, stoppate
  - Percentuali di tiro (campo, tre punti, tiri liberi)
  - Le statistiche variano in base alla posizione e all'overall

### Generazione Squadre

Le squadre vengono create con:
- Nome e città da un database di squadre NBA
- Roster bilanciato con giocatori in tutte le posizioni
- Record iniziale di 0-0 (vittorie-sconfitte)

### Simulazione Partite

Il motore di simulazione:
- Calcola il punteggio totale della squadra basandosi sulle statistiche dei giocatori
- Applica un vantaggio casuale per la squadra di casa
- Aggiunge varianza realistica ai risultati
- Genera statistiche individuali per i giocatori titolari
- Aggiorna i record delle squadre

### Sistema di Classifica

La classifica ordina le squadre per:
1. Percentuale di vittorie
2. Numero totale di vittorie (in caso di parità)

## 🎨 Personalizzazione

### Modificare i Nomi dei Giocatori

Edita `src/data/playerNames.ts` per aggiungere o modificare nomi:

```typescript
export const firstNames = ['LeBron', 'Stephen', ...];
export const lastNames = ['James', 'Curry', ...];
```

### Modificare le Statistiche

Modifica `src/services/PlayerGenerator.ts` per cambiare la generazione delle statistiche:

```typescript
private generateStats(position: string, overall: number): PlayerStats {
  // Personalizza qui la logica di generazione
}
```

### Modificare il Motore di Simulazione

Edita `src/services/MatchSimulator.ts` per cambiare come vengono simulate le partite.

## 📊 Esempio di Risposta API

### Partita Simulata

```json
{
  "success": true,
  "data": {
    "id": "match_12345",
    "homeTeam": {
      "id": "team_1",
      "name": "Lakers",
      "city": "Los Angeles",
      "wins": 5,
      "losses": 3
    },
    "awayTeam": {
      "id": "team_2",
      "name": "Celtics",
      "city": "Boston",
      "wins": 6,
      "losses": 2
    },
    "homeScore": 108,
    "awayScore": 105,
    "winner": "team_1",
    "date": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🤝 Contributi

Contributi, issues e feature requests sono benvenuti!

## 📝 Licenza

MIT

## 👨‍💻 Autore

Creato con ❤️ per gli appassionati di basket e fantasy sports
