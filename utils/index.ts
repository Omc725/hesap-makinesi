import React from 'react';
import { ButtonConfig, scientificButtons, basicButtons } from '../constants';

export const formatNumber = (numStr: string): string => {
    if (!numStr || numStr === 'Error') return numStr;
    const [integer, decimal] = numStr.split('.');
    if (integer === '' || integer === '-') return numStr;
    try {
        const formattedInteger = new Intl.NumberFormat('en-US').format(BigInt(integer.replace(/,/g, '')));
        return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
    } catch (error) {
        return numStr;
    }
};

export const evaluateExpression = (expr: string): string => {
    try {
        let evalExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\^/g, '**').replace(/sqrt/g, 'Math.sqrt').replace(/cbrt/g, 'Math.cbrt').replace(/log10/g, 'Math.log10').replace(/log/g, 'Math.log').replace(/abs/g, 'Math.abs').replace(/floor/g, 'Math.floor').replace(/ceil/g, 'Math.ceil').replace(/round/g, 'Math.round').replace(/random/g, 'Math.random').replace(/pi/g, 'Math.PI').replace(/e/g, 'Math.E');
        evalExpr = evalExpr.replace(/(sin|cos|tan)\(([^)]+)\)/g, (_, func, angle) => `Math.${func}(${angle} * Math.PI / 180)`);
        evalExpr = evalExpr.replace(/(asin|acos|atan)\(([^)]+)\)/g, (_, func, val) => `(Math.${func}(${val}) * 180 / Math.PI)`);
        const result = (new Function('return ' + evalExpr) as () => number)();
        if (isNaN(result) || !isFinite(result)) return 'Error';
        return parseFloat(result.toPrecision(15)).toString();
    } catch (error) { return 'Error'; }
};


export const calculateLayout = (mode: 'scientific' | 'basic' | 'converter', containerWidth: number, btnHeight: number, btnGap: number): Record<string, React.CSSProperties> => {
    const styles: Record<string, React.CSSProperties> = {};
    let buttons: ButtonConfig[];
    let COLS: number;
    const PADDING = 16;

    if (mode === 'scientific') {
        buttons = scientificButtons;
        COLS = 5;
    } else if (mode === 'basic') {
        buttons = basicButtons;
        COLS = 4;
    } else { // converter mode
        buttons = basicButtons
            .filter(btn => btn.type !== 'operator' && btn.value !== '=');
        COLS = 3;
    }

    const totalGapWidth = (COLS - 1) * btnGap;
    const btnWidth = (containerWidth - (PADDING * 2) - totalGapWidth) / COLS;

    let x = PADDING, y = PADDING, col = 0;

    buttons.forEach(btn => {
        const isWide = !!btn.wide;
        const colSpan = isWide ? 2 : 1;

        if (col > 0 && col + colSpan > COLS) {
            x = PADDING;
            y += btnHeight + btnGap;
            col = 0;
        }

        const currentBtnWidth = isWide ? (btnWidth * 2) + btnGap : btnWidth;

        styles[btn.value] = {
            width: currentBtnWidth,
            height: btnHeight,
            '--tw-translate-x': `${x}px`,
            '--tw-translate-y': `${y}px`,
        } as any;

        x += currentBtnWidth + btnGap;
        col += colSpan;

        if (col >= COLS) {
            x = PADDING;
            y += btnHeight + btnGap;
            col = 0;
        }
    });

    return styles;
};