import { useState, useMemo, useEffect } from 'react';
import { ShellRating } from './components/ShellRating';
import { PlayerCard } from './components/PlayerCard';
import { RollingCounter } from './components/RollingCounter';
import { ChamberTimeline } from './components/ChamberTimeline';
import { calculateProbability, getBestMove } from './lib/solver';
import { Player } from './lib/types';
import { ChamberShell, ShellState, calculateChamberProbabilities, initializeChambers } from './lib/chamber';
import { Plus, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import clsx from 'clsx';

function App() {
    // State
    const [liveShells, setLiveShells] = useState(0);
    const [blankShells, setBlankShells] = useState(0);
    const [players, setPlayers] = useState<Player[]>([
        { id: 1, name: 'YOU', hp: 4, maxHp: 4, skill: 0, isUser: true },
        { id: 2, name: 'DEALER', hp: 4, maxHp: 4, skill: 3, isUser: false },
    ]);
    const [soundEnabled, setSoundEnabled] = useState(false); // Default off to avoid autoplay issues
    const [chambers, setChambers] = useState<ChamberShell[]>([]);

    const [isRoundActive, setIsRoundActive] = useState(false);

    // Derived State
    const probabilities = useMemo(() => calculateProbability(liveShells, blankShells), [liveShells, blankShells]);
    const recommendation = useMemo(() => getBestMove(liveShells, blankShells, players, 1), [liveShells, blankShells, players]);

    // Handlers
    const updatePlayer = (id: number, updates: Partial<Player>) => {
        setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const addPlayer = () => {
        if (players.length >= 4) return;
        const newId = Math.max(...players.map(p => p.id)) + 1;
        setPlayers(prev => [...prev, { id: newId, name: `OPPONENT ${newId}`, hp: 2, maxHp: 4, skill: 1, isUser: false }]);
    };

    const removePlayer = (id: number) => {
        setPlayers(prev => prev.filter(p => p.id !== id));
    };

    const resetShells = () => {
        setLiveShells(0);
        setBlankShells(0);
        setChambers([]);
        setIsRoundActive(false);
    };

    const handleLiveChange = (newValue: number) => {
        if (isRoundActive) {
            if (newValue < liveShells) {
                // Shell spent/removed (Decreasing)
                setChambers(prev => prev.slice(1).map(c => ({ ...c, position: c.position - 1 })));
            } else if (newValue > liveShells) {
                // Shell added (Increasing) - Correction
                const diff = newValue - liveShells;
                setChambers(prev => {
                    const nextPos = prev.length > 0 ? Math.max(...prev.map(c => c.position)) + 1 : 1;
                    const newShells = Array.from({ length: diff }, (_, i) => ({
                        position: nextPos + i,
                        state: 'unknown' as ShellState,
                        probability: 50
                    }));
                    return [...prev, ...newShells];
                });
            }
        }
        setLiveShells(newValue);
    };

    const handleBlankChange = (newValue: number) => {
        if (isRoundActive) {
            if (newValue < blankShells) {
                // Shell spent/removed (Decreasing)
                setChambers(prev => prev.slice(1).map(c => ({ ...c, position: c.position - 1 })));
            } else if (newValue > blankShells) {
                // Shell added (Increasing) - Correction
                const diff = newValue - blankShells;
                setChambers(prev => {
                    const nextPos = prev.length > 0 ? Math.max(...prev.map(c => c.position)) + 1 : 1;
                    const newShells = Array.from({ length: diff }, (_, i) => ({
                        position: nextPos + i,
                        state: 'unknown' as ShellState,
                        probability: 50
                    }));
                    return [...prev, ...newShells];
                });
            }
        }
        setBlankShells(newValue);
    };

    const toggleRound = () => {
        if (!isRoundActive) {
            // Start Round
            if (liveShells + blankShells > 0) {
                setIsRoundActive(true);
            }
        } else {
            // End Round
            setIsRoundActive(false);
            // Optional: Reset? No, let user decide.
        }
    };

    // Update chambers when shell counts change (ONLY IF ROUND NOT ACTIVE)
    useEffect(() => {
        if (isRoundActive) return;

        const totalShells = liveShells + blankShells;
        if (totalShells > 0 && totalShells !== chambers.length) {
            setChambers(initializeChambers(totalShells));
        } else if (totalShells === 0) {
            setChambers([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [liveShells, blankShells, isRoundActive]);

    // Recalculate chamber probabilities when shells or chamber states change
    const knownShellsCount = useMemo(() =>
        chambers.filter(c => c.state !== 'unknown').length,
        [chambers]
    );

    useEffect(() => {
        const totalShells = liveShells + blankShells;

        // CRITICAL FIX: Prevent probability calculation from overwriting the chamber resize
        // If we are in setup mode (not active), the chamber count MUST match the total shells.
        // If it doesn't, we wait for the resizing effect to run first.
        if (!isRoundActive && chambers.length !== totalShells) {
            return;
        }

        if (chambers.length > 0) {
            const updated = calculateChamberProbabilities(liveShells, blankShells, chambers);
            // Only update if probabilities actually changed to avoid loops
            // Deep comparison or just check key values
            const hasChanges = updated.some((shell, i) =>
                shell.probability !== chambers[i].probability ||
                shell.conditionalProbs?.ifPrevLive !== chambers[i].conditionalProbs?.ifPrevLive ||
                shell.conditionalProbs?.ifPrevBlank !== chambers[i].conditionalProbs?.ifPrevBlank
            );
            if (hasChanges) {
                setChambers(updated);
            }
        }
    }, [liveShells, blankShells, knownShellsCount, chambers.length, isRoundActive, chambers]); // Removed chambers dependency to avoid loop, relying on length and counts

    const handleMarkShell = (position: number, state: ShellState) => {
        setChambers(prev => prev.map(chamber =>
            chamber.position === position
                ? { ...chamber, state }
                : chamber
        ));
    };

    const handleClearAllChambers = () => {
        setChambers(prev => prev.map(chamber => ({
            ...chamber,
            state: 'unknown' as ShellState
        })));
    };

    // Glitch effect for recommendation
    const [glitchText, setGlitchText] = useState(recommendation.description);
    useEffect(() => {
        // Simple glitch effect on text change
        let interval: any;
        let counter = 0;
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const originalText = recommendation.description;

        interval = setInterval(() => {
            setGlitchText(
                originalText.split('').map((char, index) => {
                    if (index < counter) return char;
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('')
            );
            counter += 1;
            if (counter > originalText.length) clearInterval(interval);
        }, 30);

        return () => clearInterval(interval);
    }, [recommendation.description]);

    return (
        <div className="min-h-screen bg-deep-black text-dirty-white p-8 relative overflow-hidden selection:bg-rusty-orange selection:text-black">
            {/* CRT Overlay */}
            <div className="crt-overlay pointer-events-none" />
            <div className="crt-flicker pointer-events-none fixed inset-0 bg-white/5 mix-blend-overlay opacity-5" />

            {/* Header */}
            <header className="mb-12 flex justify-between items-end border-b-2 border-gray-800 pb-4">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-glow-red glitch-text" data-text="BUCKSHOT SOLVER">
                        BUCKSHOT SOLVER
                    </h1>
                    <p className="text-gray-500 font-mono text-sm mt-2 tracking-widest">
                        PROBABILITY CALCULATOR // VER 1.1.0
                    </p>
                </div>
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 hover:text-rusty-orange transition-colors"
                >
                    {soundEnabled ? <Volume2 /> : <VolumeX />}
                </button>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                {/* Left Column: Inputs */}
                <div className="space-y-12">
                    <section className="bg-dark-gray/50 p-6 rounded-sm border border-gray-800 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-300 flex items-center gap-2">
                                <span className="w-2 h-2 bg-rusty-orange inline-block animate-pulse" />
                                SHELL CONFIGURATION
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={toggleRound}
                                    className={clsx(
                                        "text-xs border px-3 py-1 transition-colors flex items-center gap-1 font-bold tracking-wider",
                                        isRoundActive
                                            ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                            : "border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                                    )}
                                >
                                    {isRoundActive ? "END ROUND" : "START ROUND"}
                                </button>
                                <button
                                    onClick={resetShells}
                                    className="text-xs border border-gray-600 px-2 py-1 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <RotateCcw size={12} /> RESET
                                </button>
                            </div>
                        </div>

                        <ShellRating
                            label="LIVE ROUNDS"
                            value={liveShells}
                            onChange={handleLiveChange}
                            color="red"
                            max={16}
                        />
                        <ShellRating
                            label="BLANK ROUNDS"
                            value={blankShells}
                            onChange={handleBlankChange}
                            color="blue"
                            max={16}
                        />

                        <div className="mt-8">
                            <ChamberTimeline
                                chambers={chambers}
                                onMarkShell={handleMarkShell}
                                onClearAll={handleClearAllChambers}
                            />
                        </div>
                    </section>


                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-400">PLAYERS</h2>
                            {players.length < 4 && (
                                <button
                                    onClick={addPlayer}
                                    className="text-xs border border-gray-600 px-2 py-1 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <Plus size={12} /> ADD OPPONENT
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {players.map(player => (
                                <PlayerCard
                                    key={player.id}
                                    player={player}
                                    onUpdate={updatePlayer}
                                    onRemove={removePlayer}
                                    isTarget={recommendation.targetPlayerId === player.id}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Analysis */}
                <div className="space-y-8">
                    {/* Probability Display */}
                    <section className="bg-black border-2 border-gray-800 p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rusty-orange to-transparent opacity-50" />

                        <h2 className="text-gray-500 text-sm tracking-widest mb-8">PROBABILITY ANALYSIS</h2>

                        <div className="grid grid-cols-2 gap-8 text-center">
                            <div>
                                <div className="text-5xl md:text-7xl font-bold text-rusty-orange text-glow-red mb-2">
                                    <RollingCounter value={Math.round(probabilities.live)} color="text-rusty-orange" />%
                                </div>
                                <div className="text-sm text-gray-400 tracking-widest">LIVE</div>
                            </div>
                            <div>
                                <div className="text-5xl md:text-7xl font-bold text-blue-500 text-glow mb-2">
                                    <RollingCounter value={Math.round(probabilities.blank)} color="text-blue-500" />%
                                </div>
                                <div className="text-sm text-gray-400 tracking-widest">BLANK</div>
                            </div>
                        </div>
                    </section>

                    {/* Recommendation Engine */}
                    <section className="bg-gray-900/80 border border-gray-700 p-6 relative">
                        <div className="absolute -left-1 top-4 bottom-4 w-1 bg-dirty-white" />
                        <h2 className="text-gray-500 text-xs tracking-[0.2em] mb-4">TACTICAL SUGGESTION</h2>

                        <div className="min-h-[4rem] flex items-center">
                            <p className={clsx(
                                "text-2xl md:text-3xl font-bold font-mono",
                                recommendation.action === 'SHOOT_SELF' ? "text-blue-400" : "text-rusty-orange"
                            )}>
                                {glitchText}
                            </p>
                        </div>

                        {/* Decorative tech lines */}
                        <div className="mt-4 flex gap-1">
                            <div className="h-1 w-8 bg-gray-700" />
                            <div className="h-1 w-4 bg-gray-700" />
                            <div className="h-1 w-2 bg-gray-700" />
                            <div className="h-1 flex-grow bg-gray-800/50" />
                        </div>
                    </section>

                    {/* Log / History (Optional decoration) */}
                    <div className="font-mono text-xs text-gray-600 space-y-1 opacity-50 select-none">
                        <p>&gt; SYSTEM READY</p>
                        <p>&gt; CONNECTED TO TERMINAL</p>
                        <p>&gt; AWAITING INPUT...</p>
                        {liveShells > 0 && <p>&gt; DETECTED {liveShells} LIVE ROUNDS</p>}
                        {blankShells > 0 && <p>&gt; DETECTED {blankShells} BLANK ROUNDS</p>}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
