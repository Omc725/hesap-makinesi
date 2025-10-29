import React, { useState } from 'react';
import { View } from '../types';
import { ANIMATION_DURATION } from '../constants';

interface AppHeaderProps {
    onNavigate: (view: View, e: React.MouseEvent<HTMLButtonElement>) => void;
    calculatorMode: 'scientific' | 'basic';
    setCalculatorMode: (mode: 'scientific' | 'basic') => void;
    mainViewMode: 'calculator' | 'converter';
    setMainViewMode: (mode: 'calculator' | 'converter') => void;
    onSwapUnits: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onNavigate, calculatorMode, setCalculatorMode, mainViewMode, setMainViewMode, onSwapUnits }) => {
    const [isAnimatingSwap, setIsAnimatingSwap] = useState(false);
    const [rotation, setRotation] = useState(0);

    const handleMainViewToggle = () => {
        if (mainViewMode === 'calculator') {
            if (calculatorMode === 'scientific') {
                setCalculatorMode('basic');
                setMainViewMode('converter');
            } else {
                setMainViewMode('converter');
            }
        } else {
            setMainViewMode('calculator');
        }
    };

    const handleSwapClick = () => {
        if (isAnimatingSwap) return;
        setIsAnimatingSwap(true);
        setRotation(r => r + 180);
        onSwapUnits();
        setTimeout(() => setIsAnimatingSwap(false), 600);
    };

    return (
        <header className="grid grid-cols-3 items-center p-4 pt-6">
            <div className="relative flex justify-start h-12">
                <div className={`absolute inset-0 flex items-center transition-all duration-300 ease-out ${mainViewMode === 'converter' ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100'}`}>
                    <div className="relative flex items-center gap-1 rounded-full bg-surface p-1 text-sm">
                        <div className="absolute top-1 left-1 h-10 w-10 rounded-full bg-primary transition-transform duration-400 ease-out-back" style={{ transform: calculatorMode === 'basic' ? 'translateX(0%)' : 'translateX(calc(100% + 4px))' }} />
                        <button onClick={() => setCalculatorMode('basic')} className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${calculatorMode === 'basic' ? 'text-text-on-primary' : 'text-text-muted'}`}><span className="material-symbols-outlined !text-2xl">calculate</span></button>
                        <button onClick={() => setCalculatorMode('scientific')} className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${calculatorMode === 'scientific' ? 'text-text-on-primary' : 'text-text-muted'}`}><span className="material-symbols-outlined !text-2xl">science</span></button>
                    </div>
                </div>
                <div className={`absolute inset-0 flex items-center transition-all duration-300 ease-out ${mainViewMode === 'calculator' ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100'}`}>
                    <button onClick={handleSwapClick} className="flex h-12 w-24 items-center justify-center rounded-full bg-primary text-text-on-primary shadow-lg transition-transform active:scale-95">
                        <span style={{ transform: `rotate(${rotation}deg)` }} className="material-symbols-outlined !text-3xl transition-transform duration-300 ease-in-out">swap_horiz</span>
                    </button>
                </div>
            </div>
            <div className="flex justify-center items-center gap-4">
                <button onClick={handleMainViewToggle} className="flex h-12 w-24 items-center justify-center gap-1 rounded-full bg-secondary text-text-on-secondary shadow-lg transition-transform active:scale-95">
                    {mainViewMode === 'calculator' ? (<><span className="material-symbols-outlined !text-3xl">straighten</span><span className="material-symbols-outlined !text-xl">scale</span></>) : (<><span className="material-symbols-outlined !text-2xl">calculate</span><span className="material-symbols-outlined !text-base">functions</span></>)}
                </button>
            </div>
            <div className="flex justify-end">
                <div className="flex items-center">
                    <div className="flex h-12 w-24 items-center rounded-full bg-surface text-text-color">
                        <button onClick={(e) => onNavigate(View.HISTORY, e)} className="flex h-full w-1/2 items-center justify-center transition-colors hover:text-primary"><span className="material-symbols-outlined">history</span></button>
                        <div className="h-6 w-px bg-text-color/20" />
                        <button onClick={(e) => onNavigate(View.SETTINGS, e)} className="flex h-full w-1/2 items-center justify-center transition-colors hover:text-primary"><span className="material-symbols-outlined">settings</span></button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;