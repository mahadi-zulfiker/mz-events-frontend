'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className={cn(
                        'fixed bottom-6 right-6 z-50',
                        'p-3 rounded-full',
                        'bg-slate-900/80 backdrop-blur-md',
                        'border border-indigo-500/30',
                        'shadow-lg shadow-indigo-500/20',
                        'text-indigo-400 hover:text-indigo-300',
                        'hover:bg-slate-800 hover:border-indigo-400/50',
                        'transition-colors duration-300',
                        'flex items-center justify-center',
                        'group'
                    )}
                    aria-label="Scroll to top"
                >
                    <FiArrowUp className="w-6 h-6 stroke-[3px] group-hover:-translate-y-0.5 transition-transform duration-300" />
                    <span className="absolute -top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                        Top
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    );
};
