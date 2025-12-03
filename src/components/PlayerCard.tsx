import React from 'react';
import { Player } from '../lib/types';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Star, Skull, User } from 'lucide-react';

interface PlayerCardProps {
    player: Player;
    onUpdate: (id: number, updates: Partial<Player>) => void;
    onRemove?: (id: number) => void;
    isTarget?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onUpdate, onRemove, isTarget }) => {
    return (
        <motion.div
            layout
            className={clsx(
                "p-4 border-2 relative bg-black/80 backdrop-blur-sm transition-colors duration-300",
                isTarget ? "border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]" : "border-gray-700",
                player.hp === 0 && "opacity-50 grayscale"
            )}
        >
            {isTarget && (
                <div className="absolute -top-3 left-0 right-0 text-center">
                    <span className="bg-red-600 text-black px-2 py-0.5 text-sm font-bold animate-pulse">
                        RECOMMENDED TARGET
                    </span>
                </div>
            )}

            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    {player.isUser ? <User size={16} /> : <Skull size={16} />}
                    <input
                        value={player.name}
                        onChange={(e) => onUpdate(player.id, { name: e.target.value })}
                        className="bg-transparent border-b border-transparent focus:border-gray-500 outline-none w-32 font-bold uppercase"
                    />
                </div>
                {!player.isUser && onRemove && (
                    <button onClick={() => onRemove(player.id)} className="text-red-500 hover:text-red-400 text-xs">[X]</button>
                )}
            </div>

            {/* HP Control */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400">HP:</span>
                <div className="flex gap-1">
                    {Array.from({ length: player.maxHp }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                // Toggle HP: if clicking current HP, reduce by 1. If clicking empty, set to that.
                                // Actually simpler: click to set HP.
                                onUpdate(player.id, { hp: i + 1 });
                            }}
                            className={clsx(
                                "w-3 h-6 border border-gray-600 transition-colors",
                                i < player.hp ? "bg-green-500/50 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "bg-transparent"
                            )}
                        />
                    ))}
                    {/* Button to set 0 (Dead) */}
                    <button
                        onClick={() => onUpdate(player.id, { hp: 0 })}
                        className="w-3 h-6 border border-red-900 bg-transparent hover:bg-red-900/50"
                        title="Kill"
                    />
                </div>
            </div>

            {/* Skill Rating (Only for opponents) */}
            {!player.isUser && (
                <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">SKILL:</span>
                    <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => onUpdate(player.id, { skill: i + 1 })}
                                className="p-0.5 hover:scale-110 transition-transform"
                            >
                                <Star
                                    size={12}
                                    className={clsx(
                                        i < player.skill ? "fill-yellow-500 text-yellow-500" : "text-gray-700"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};
