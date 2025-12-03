import { Player } from './types';

export type MoveRecommendation = {
    action: 'SHOOT_SELF' | 'SHOOT_OPPONENT' | 'RELOAD' | 'WINNER';
    targetPlayerId?: number;
    description: string;
};

export const calculateProbability = (live: number, blank: number) => {
    const total = live + blank;
    if (total === 0) return { live: 0, blank: 0 };
    return {
        live: (live / total) * 100,
        blank: (blank / total) * 100,
    };
};

export const getBestMove = (live: number, blank: number, players: Player[], currentPlayerId: number): MoveRecommendation => {
    const total = live + blank;
    if (total === 0) return { action: 'RELOAD', description: "RELOAD REQUIRED" };

    const pLive = live / total;
    const pBlank = blank / total;

    // Simple heuristic
    if (pBlank > pLive) {
        return {
            action: 'SHOOT_SELF',
            description: "SHOOT SELF (RISK FREE TURN)"
        };
    } else {
        // Find best target
        const opponents = players.filter(p => !p.isUser && p.hp > 0);
        if (opponents.length === 0) return { action: 'WINNER', description: "ALL OPPONENTS ELIMINATED" };

        // Priority: 1) Highest skill (biggest threat), 2) Lowest HP (easiest to eliminate)
        const target = opponents.reduce((prev, current) => {
            // If skill is different, choose higher skill
            if (current.skill !== prev.skill) {
                return current.skill > prev.skill ? current : prev;
            }
            // If skill is equal, choose lower HP
            return current.hp < prev.hp ? current : prev;
        });

        return {
            action: 'SHOOT_OPPONENT',
            targetPlayerId: target.id,
            description: `SHOOT ${target.name.toUpperCase()}`
        };
    }
};
