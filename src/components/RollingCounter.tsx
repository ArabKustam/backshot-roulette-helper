import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RollingCounterProps {
    value: number | string;
    color?: string;
}

export const RollingCounter: React.FC<RollingCounterProps> = ({ value, color = 'text-dirty-white' }) => {
    return (
        <div className="relative inline-block overflow-hidden h-[1.2em] align-bottom">
            <AnimatePresence mode='popLayout'>
                <motion.span
                    key={value}
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    className={`block ${color}`}
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};
