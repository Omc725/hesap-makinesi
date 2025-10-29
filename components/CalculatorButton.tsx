import React from 'react';
import { ButtonConfig } from '../constants';

const CalculatorButton: React.FC<{
    config: ButtonConfig;
    onClick: (value: string) => void;
    style: React.CSSProperties;
    className?: string;
}> = ({ config, onClick, style, className }) => {
    const handlePress = () => {
        if (navigator.vibrate) navigator.vibrate(5);
        onClick(config.value);
    };

    let btnClass = 'flex items-center justify-center rounded-2xl font-bold text-2xl absolute transition-all duration-150 transform active:scale-90 active:rounded-3xl active:brightness-90';

    if (config.type === 'operator') {
        btnClass += ' bg-primary text-text-on-primary';
    } else if (config.type === 'special') {
        if (['AC', '+/-', '%', 'backspace', '()', 'shift'].includes(config.value)) {
            btnClass += ' bg-secondary text-text-on-secondary';
        } else {
            btnClass += ' bg-primary text-text-on-primary';
            if (config.value === '=') {
                btnClass += ' active:shadow-[0_0_25px_var(--color-primary)]';
            }
        }
    } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(config.value)) {
        btnClass += ' bg-number-key text-text-color hover:brightness-110 dark:hover:brightness-125';
    } else {
        btnClass += ' bg-surface text-text-color hover:brightness-110 dark:hover:brightness-125';
    }

    return <button onClick={handlePress} className={`${btnClass} ${className || ''}`} style={style}>{config.display}</button>;
};

export default CalculatorButton;
