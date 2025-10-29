import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface UnitSelectionModalProps {
    isOpen: boolean;
    units: string[];
    selectedUnit: string;
    onSelect: (unit: string) => void;
    onClose: () => void;
    category: string;
}

const UnitSelectionModal: React.FC<UnitSelectionModalProps> = ({ isOpen, units, selectedUnit, onSelect, onClose, category }) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="flex flex-col w-11/12 max-w-sm max-h-[80dvh] rounded-2xl bg-surface shadow-2xl opacity-0 animate-fade-scale-in-up" onClick={(e) => e.stopPropagation()}>
                <header className="flex-shrink-0 p-4 border-b border-text-color/10">
                    <h3 className="text-xl font-bold text-center">{t('unitSelectionTitle', { category })}</h3>
                </header>
                <div className="flex-grow p-2 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-1">
                        {units.map((unit, index) => (
                            <li key={unit} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 30}ms` }}>
                                <button onClick={() => onSelect(unit)} className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-lg font-semibold ${unit === selectedUnit ? 'bg-primary text-text-on-primary' : 'hover:bg-text-color/10'}`}>
                                    {unit}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <footer className="flex-shrink-0 p-3">
                    <button onClick={onClose} className="w-full py-3 text-xl font-bold rounded-full bg-secondary/80 hover:bg-secondary text-text-on-secondary transition-colors active:scale-95">
                        {t('close')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default UnitSelectionModal;
