import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ShellRatingProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    color: 'red' | 'blue';
    max?: number;
}

export const ShellRating: React.FC<ShellRatingProps> = ({ label, value, onChange, color, max = 8 }) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    // Sound hooks
    // const [playLoad] = useSound(LOAD_SOUND);
    // const [playEject] = useSound(EJECT_SOUND);
    // const [playClick] = useSound(CLICK_SOUND);

    const handleMouseEnter = (index: number) => {
        setHoverValue(index + 1);
        // playClick();
    };

    const handleMouseLeave = () => {
        setHoverValue(null);
    };

    const handleClick = (index: number) => {
        const newValue = index + 1;
        if (newValue > value) {
            // playLoad();
        } else if (newValue < value) {
            // playEject();
        }
        onChange(newValue === value ? 0 : newValue); // Toggle off if clicking same
    };

    return (
        <div className="flex flex-col gap-2 mb-4">
            <label className={clsx("text-xl font-bold tracking-widest uppercase", color === 'red' ? 'text-rusty-orange' : 'text-blue-500', "text-glow")}>
                {label}
            </label>
            <div className="flex gap-2 flex-wrap">
                {Array.from({ length: max }).map((_, i) => {
                    const isActive = (hoverValue !== null ? i < hoverValue : i < value);

                    return (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseEnter={() => handleMouseEnter(i)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClick(i)}
                            className={clsx(
                                "w-8 h-12 border-2 rounded-sm transition-all duration-100 relative overflow-hidden",
                                isActive
                                    ? (color === 'red' ? "border-rusty-orange bg-rusty-orange/20 shadow-[0_0_10px_rgba(194,65,12,0.5)]" : "border-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.5)]")
                                    : "border-gray-700 bg-black/50"
                            )}
                        >
                            {/* Shell Visual */}
                            {isActive && (
                                <div className={clsx(
                                    "absolute inset-0 m-auto w-4 h-8 rounded-sm opacity-80",
                                    color === 'red' ? "bg-rusty-orange" : "bg-blue-500"
                                )} />
                            )}
                            {/* Scanline overlay for the shell */}
                            <div className="absolute inset-0 bg-scanlines opacity-30 pointer-events-none" />
                        </motion.button>
                    );
                })}
            </div>
            <div className="text-right font-mono text-2xl">
                {value}
            </div>
        </div>
    );
};
