import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ChamberShell, ShellState } from '../lib/chamber';
import { AlertTriangle } from 'lucide-react';

interface ChamberSlotProps {
    shell: ChamberShell;
    onMark: (position: number, state: ShellState) => void;
}

const ChamberSlot: React.FC<ChamberSlotProps> = ({ shell, onMark }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [displayProb, setDisplayProb] = useState(shell.probability || 50);
    const [isAnimating, setIsAnimating] = useState(false);

    // Ripple effect: cycle through random numbers before settling
    useEffect(() => {
        if (shell.state === 'unknown' && shell.probability !== displayProb) {
            setIsAnimating(true);
            let counter = 0;
            const maxIterations = 15;

            const interval = setInterval(() => {
                if (counter < maxIterations) {
                    // Decrypt effect: random numbers
                    setDisplayProb(Math.floor(Math.random() * 100));
                    counter++;
                } else {
                    // Settle on actual value
                    setDisplayProb(shell.probability || 50);
                    setIsAnimating(false);
                    clearInterval(interval);
                }
            }, 40);

            return () => clearInterval(interval);
        } else if (shell.state !== 'unknown') {
            setDisplayProb(shell.probability || 50);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shell.probability, shell.state]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMark = (state: ShellState) => {
        onMark(shell.position, state);
        setIsMenuOpen(false);
    };

    const getProbabilityColor = (prob: number, state: ShellState) => {
        if (state === 'known-live') return 'text-red-500';
        if (state === 'known-blank') return 'text-blue-500';

        if (prob > 50) return 'text-red-400';
        if (prob < 50) return 'text-blue-400';
        return 'text-white'; // 50/50 text color
    };

    const getBackgroundColor = (prob: number, state: ShellState) => {
        if (state === 'known-live') return 'bg-red-900/30 border-red-500';
        if (state === 'known-blank') return 'bg-blue-900/30 border-blue-500';

        if (prob > 50) return 'bg-red-900/10 border-red-700/30';
        if (prob < 50) return 'bg-blue-900/10 border-blue-700/30';

        // 50/50 Split: Sharp diagonal gradient - handled via inline style
        if (prob === 50) return 'shell-split border-purple-500/50';

        return 'bg-gray-800/20 border-gray-700';
    };

    const isUnsafe = (prob: number) => {
        // Unsafe if it's not a sure thing, but also NOT a perfect 50/50 split (which has its own visual)
        return prob > 0 && prob < 100 && prob !== 50;
    };

    return (
        <div className="relative">
            <motion.button
                onContextMenu={handleContextMenu}
                onClick={handleContextMenu}
                className={clsx(
                    "w-16 h-20 border-2 relative overflow-hidden transition-all duration-200",
                    !shell.conditionalProbs && getBackgroundColor(displayProb, shell.state),
                    "hover:scale-105 hover:shadow-lg bg-gray-900"
                )}
                style={
                    shell.state === 'unknown' && displayProb === 50 && !shell.conditionalProbs
                        ? { background: 'linear-gradient(135deg, #ef4444 50%, #3b82f6 50%)' }
                        : undefined
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Position label */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 border-2 border-transparent">
                    <div className="absolute top-1 left-1 text-[8px] text-gray-500 font-mono z-30 bg-black/50 px-0.5 rounded">
                        #{shell.position}
                    </div>
                </div>

                {/* Unsafe Warning Icon */}
                {shell.state === 'unknown' && isUnsafe(displayProb) && !shell.conditionalProbs && (
                    <div className="absolute top-1 right-1 z-30 text-yellow-500 animate-pulse">
                        <AlertTriangle size={10} />
                    </div>
                )}

                {/* Content */}
                {shell.state === 'unknown' && shell.conditionalProbs ? (
                    <>
                        {/* Top-Left: If Prev Live */}
                        <div
                            className={clsx(
                                "absolute inset-0 flex flex-col items-start justify-start p-1",
                                getBackgroundColor(shell.conditionalProbs.ifPrevLive, 'unknown')
                            )}
                            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                        >
                            <div className="mt-3 ml-1">
                                <div className="text-[8px] text-gray-400 leading-none mb-0.5">IF L</div>
                                <div className={clsx("text-lg font-bold font-mono leading-none", getProbabilityColor(shell.conditionalProbs.ifPrevLive, 'unknown'))}>
                                    {Math.round(shell.conditionalProbs.ifPrevLive)}
                                </div>
                            </div>
                        </div>

                        {/* Bottom-Right: If Prev Blank */}
                        <div
                            className={clsx(
                                "absolute inset-0 flex flex-col items-end justify-end p-1",
                                getBackgroundColor(shell.conditionalProbs.ifPrevBlank, 'unknown')
                            )}
                            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                        >
                            <div className="mb-1 mr-1 text-right">
                                <div className={clsx("text-lg font-bold font-mono leading-none", getProbabilityColor(shell.conditionalProbs.ifPrevBlank, 'unknown'))}>
                                    {Math.round(shell.conditionalProbs.ifPrevBlank)}
                                </div>
                                <div className="text-[8px] text-gray-400 leading-none mt-0.5">IF B</div>
                            </div>
                        </div>

                        {/* Diagonal Divider Line */}
                        <div className="absolute inset-0 pointer-events-none z-10">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(75,85,99,0.5)" strokeWidth="1" />
                            </svg>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        {shell.state === 'unknown' ? (
                            <div className="flex flex-col items-center">
                                <motion.div
                                    className={clsx(
                                        "text-3xl font-bold font-mono",
                                        isAnimating ? "blur-[1px]" : "",
                                        getProbabilityColor(displayProb, shell.state)
                                    )}
                                    animate={isAnimating ? { opacity: [0.5, 1, 0.5] } : {}}
                                    transition={{ duration: 0.1, repeat: isAnimating ? Infinity : 0 }}
                                >
                                    {Math.round(displayProb)}
                                </motion.div>
                                <div className="text-[10px] text-gray-500">%</div>
                            </div>
                        ) : shell.state === 'known-live' ? (
                            <div className="flex flex-col items-center">
                                <div className="text-2xl font-bold text-red-500">●</div>
                                <div className="text-[9px] text-red-400 font-bold mt-1">LIVE</div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="text-2xl font-bold text-blue-500">○</div>
                                <div className="text-[9px] text-blue-400 font-bold mt-1">BLANK</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Scanline overlay */}
                <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none z-20" />
            </motion.button>

            {/* Context Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-700 shadow-lg z-50 min-w-[120px]"
                    >
                        <button
                            onClick={() => handleMark('known-live')}
                            className="w-full px-3 py-2 text-left text-xs hover:bg-red-900/30 text-red-400 border-b border-gray-800"
                        >
                            ● MARK LIVE
                        </button>
                        <button
                            onClick={() => handleMark('known-blank')}
                            className="w-full px-3 py-2 text-left text-xs hover:bg-blue-900/30 text-blue-400 border-b border-gray-800"
                        >
                            ○ MARK BLANK
                        </button>
                        {shell.state !== 'unknown' && (
                            <button
                                onClick={() => handleMark('unknown')}
                                className="w-full px-3 py-2 text-left text-xs hover:bg-gray-800 text-gray-400"
                            >
                                ? CLEAR
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface ChamberTimelineProps {
    chambers: ChamberShell[];
    onMarkShell: (position: number, state: ShellState) => void;
    onClearAll: () => void;
}

export const ChamberTimeline: React.FC<ChamberTimelineProps> = ({
    chambers,
    onMarkShell,
    onClearAll
}) => {
    return (
        <div className="bg-dark-gray/50 p-6 rounded-sm border border-gray-800 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-300 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 inline-block animate-pulse" />
                        CHAMBER SEQUENCE
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        RIGHT-CLICK to mark known shells (Magnifying Glass / Burner Phone)
                    </p>
                </div>
                <button
                    onClick={onClearAll}
                    className="text-xs border border-gray-600 px-2 py-1 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    CLEAR ALL
                </button>
            </div>

            {/* Chambers container with extra height for context menu */}
            <div className="flex gap-2 overflow-x-auto pb-28 min-h-[180px]">
                {chambers.map((shell) => (
                    <ChamberSlot
                        key={shell.position}
                        shell={shell}
                        onMark={onMarkShell}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-900/30 border border-red-500" />
                    <span>&gt;75% Live</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-900/30 border border-blue-500" />
                    <span>&gt;75% Blank</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-br from-red-900/40 to-blue-900/40 border border-purple-500/50" />
                    <span>50/50 Split</span>
                </div>
            </div>
        </div>
    );
};
