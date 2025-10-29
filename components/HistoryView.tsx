import React, { useState } from 'react';
import { View, HistoryEntry } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { formatNumber } from '../utils';

type AnimationOrigin = { top: string; right: string; bottom: string; left: string; } | null;

interface HistoryViewProps {
    setView: () => void;
    history: HistoryEntry[];
    setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
    animationOrigin: AnimationOrigin;
}

const HistoryView: React.FC<HistoryViewProps> = ({ setView, history, setHistory, animationOrigin }) => {
    const { t } = useLanguage();
    const [isClosing, setIsClosing] = useState(false);
    
    const handleClearHistory = () => {
        const items = Array.from(document.querySelectorAll('.history-item'));
        if (items.length === 0) return;
        items.forEach((item, index) => {
            (item as HTMLElement).style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            (item as HTMLElement).style.transitionDelay = `${(items.length - 1 - index) * 50}ms`;
            (item as HTMLElement).style.opacity = '0';
            (item as HTMLElement).style.transform = 'translateX(20px)';
        });
        setTimeout(() => {
            setHistory([]);
        }, (items.length * 50) + 300);
    };

    const handleClose = () => {
        setIsClosing(true);
    };

    return (
        <div
            className={`absolute inset-0 z-20 flex h-full flex-col bg-background ${isClosing ? 'animate-reveal-out' : 'animate-reveal-in'}`}
            style={animationOrigin ? {
                '--clip-top': animationOrigin.top,
                '--clip-right': animationOrigin.right,
                '--clip-bottom': animationOrigin.bottom,
                '--clip-left': animationOrigin.left,
            } as React.CSSProperties : {}}
            onAnimationEnd={() => { if (isClosing) setView(); }}
        >
            <header className="flex items-center justify-between p-4 pt-6 pb-4 opacity-0 animate-fade-scale-in-up" style={{ animationDelay: '50ms' }}>
                <button onClick={handleClose} className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-text-on-secondary shadow-lg transition-transform active:scale-95"><span className="material-symbols-outlined">arrow_back</span></button>
                <h2 className="text-2xl font-bold">{t('historyTitle')}</h2>
                <div className="w-12" />
            </header>
            <main className="flex-grow space-y-4 overflow-y-auto px-4 custom-scrollbar">
                {history.length === 0 ? (
                    <div className="flex h-full items-center justify-center"><p className="text-text-muted text-lg">{t('noHistory')}</p></div>
                ) : (
                    history.map((item, index) => (
                        <div key={index} className="history-item opacity-0 animate-fade-scale-in-up cursor-pointer rounded-xl bg-surface p-4 text-right transition-all duration-100 hover:brightness-110 dark:hover:brightness-125 active:scale-[0.98]" style={{ animationDelay: `${100 + index * 75}ms` }}>
                            <p className="text-xl text-text-muted truncate">{item.expression}</p>
                            <p className="text-4xl font-bold">= {formatNumber(item.result)}</p>
                        </div>
                    ))
                )}
            </main>
            <footer className="p-4 opacity-0 animate-fade-scale-in-up" style={{ animationDelay: `${100 + (history.length > 0 ? history.length : 1) * 75}ms` }}>
                <button onClick={handleClearHistory} className="w-full flex items-center justify-center rounded-full border-2 border-primary/50 py-3 text-xl font-bold text-primary transition-all hover:border-primary hover:bg-primary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" disabled={history.length === 0}>
                    {t('clearHistory')}
                </button>
            </footer>
        </div>
    );
};

export default HistoryView;
