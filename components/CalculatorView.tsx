import React, { useState } from 'react';
import { View, HistoryEntry } from '../types';
import AppHeader from './AppHeader';
import MainView from './MainView';

interface CalculatorViewProps {
    onNavigate: (view: View, e: React.MouseEvent<HTMLButtonElement>) => void;
    history: HistoryEntry[];
    setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
}

const CalculatorView: React.FC<CalculatorViewProps> = ({ onNavigate, history, setHistory }) => {
    const [calculatorMode, setCalculatorMode] = useState<'scientific' | 'basic'>('basic');
    const [mainViewMode, setMainViewMode] = useState<'calculator' | 'converter'>('calculator');
    const [swapUnitsTrigger, setSwapUnitsTrigger] = useState<() => void>(() => () => {});

    return (
        <div className="flex h-full flex-col">
            <AppHeader
                onNavigate={onNavigate}
                calculatorMode={calculatorMode}
                setCalculatorMode={setCalculatorMode}
                mainViewMode={mainViewMode}
                setMainViewMode={setMainViewMode}
                onSwapUnits={swapUnitsTrigger}
            />
            <MainView
                history={history}
                setHistory={setHistory}
                calculatorMode={calculatorMode}
                mainViewMode={mainViewMode}
                setSwapUnitsTrigger={(fn) => setSwapUnitsTrigger(() => fn)}
            />
        </div>
    );
};

export default CalculatorView;
