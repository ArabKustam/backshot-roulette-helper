export type ShellState = 'unknown' | 'known-live' | 'known-blank';

export interface ChamberShell {
    position: number;
    state: ShellState;
    probability?: number; // Calculated probability for unknown shells
    conditionalProbs?: {
        ifPrevLive: number;
        ifPrevBlank: number;
    };
}

export const calculateChamberProbabilities = (
    totalLive: number,
    totalBlank: number,
    chambers: ChamberShell[]
): ChamberShell[] => {
    // 1. Oracle Filter: Calculate Initial Pool by removing ALL known shells
    // These are fixed points in time and must be subtracted first.
    let oracleLive = totalLive;
    let oracleBlank = totalBlank;

    chambers.forEach(shell => {
        if (shell.state === 'known-live') oracleLive--;
        if (shell.state === 'known-blank') oracleBlank--;
    });

    // Ensure we don't go below zero (safety check)
    oracleLive = Math.max(0, oracleLive);
    oracleBlank = Math.max(0, oracleBlank);

    // 2. Greedy Simulation: Iterate and update pool based on most likely outcome
    let currentLive = oracleLive;
    let currentBlank = oracleBlank;

    // We also need to track the "State Entering Step i" to calculate conditionals
    const stateHistory: { live: number, blank: number }[] = [];

    // First Pass: Calculate the "Greedy Path" of pool states
    for (const shell of chambers) {
        stateHistory.push({ live: currentLive, blank: currentBlank });

        if (shell.state === 'known-live') {
            // Known shells don't consume from the *unknown* pool (they were removed in Oracle step)
            // But they DO advance the timeline.
            continue;
        } else if (shell.state === 'known-blank') {
            continue;
        } else {
            // Unknown Shell: Consumes from the pool based on probability
            const total = currentLive + currentBlank;
            const prob = total > 0 ? currentLive / total : 0;

            if (prob > 0.5) {
                currentLive = Math.max(0, currentLive - 1);
            } else if (prob < 0.5) {
                currentBlank = Math.max(0, currentBlank - 1);
            } else {
                // 50/50 Split: Weighted Approach
                currentLive = Math.max(0, currentLive - 0.5);
                currentBlank = Math.max(0, currentBlank - 0.5);
            }
        }
    }

    // Second Pass: Assign Probabilities and Conditionals
    return chambers.map((shell, index) => {
        // Known shells are fixed
        if (shell.state === 'known-live') {
            return { ...shell, probability: 100, conditionalProbs: undefined };
        }
        if (shell.state === 'known-blank') {
            return { ...shell, probability: 0, conditionalProbs: undefined };
        }

        // Unknown Shell
        const state = stateHistory[index];
        const total = state.live + state.blank;
        const baseProb = total > 0 ? (state.live / total) * 100 : 0;

        // Calculate Conditional Split (If Prev Live / If Prev Blank)
        let conditionalProbs = undefined;

        if (index > 0) {
            const prevShell = chambers[index - 1];

            // Only show split if previous shell was also Unknown
            if (prevShell.state === 'unknown') {
                // We need the state that *entered* the previous step
                const prevState = stateHistory[index - 1];

                // Scenario A: Previous was Live
                // We subtract 1 Live from the state that entered the previous step
                const poolIfLive_L = Math.max(0, prevState.live - 1);
                const poolIfLive_Total = poolIfLive_L + prevState.blank;
                const probIfPrevLive = poolIfLive_Total > 0
                    ? (poolIfLive_L / poolIfLive_Total) * 100
                    : 0;

                // Scenario B: Previous was Blank
                // We subtract 1 Blank from the state that entered the previous step
                const poolIfBlank_B = Math.max(0, prevState.blank - 1);
                const poolIfBlank_Total = prevState.live + poolIfBlank_B;
                const probIfPrevBlank = poolIfBlank_Total > 0
                    ? (prevState.live / poolIfBlank_Total) * 100
                    : 0;

                conditionalProbs = {
                    ifPrevLive: probIfPrevLive,
                    ifPrevBlank: probIfPrevBlank
                };
            }
        }

        return {
            ...shell,
            probability: baseProb,
            conditionalProbs
        };
    });
};

export const initializeChambers = (total: number): ChamberShell[] => {
    return Array.from({ length: total }, (_, i) => ({
        position: i + 1,
        state: 'unknown' as ShellState,
        probability: 50,
    }));
};
