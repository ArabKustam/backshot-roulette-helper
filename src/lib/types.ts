export type Player = {
    id: number;
    name: string;
    hp: number;
    maxHp: number;
    skill: number; // 1-5
    isUser: boolean;
};

export type ShellType = 'live' | 'blank';

export type GameState = {
    players: Player[];
    liveShells: number;
    blankShells: number;
    currentTurnPlayerId: number;
};
