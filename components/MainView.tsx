import React, { useState, useCallback, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { HistoryEntry, UnitCategoryKey, TranslationKey } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { allButtons, scientificButtons, basicButtons, conversionData, MAX_EXPRESSION_LENGTH, MAX_HISTORY_ITEMS, ANIMATION_DURATION } from '../constants';
import { formatNumber, evaluateExpression, calculateLayout } from '../utils';
import CalculatorButton from './CalculatorButton';
import UnitSelectionModal from './UnitSelectionModal';

interface MainViewProps {
    history: HistoryEntry[];
    setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
    calculatorMode: 'scientific' | 'basic';
    mainViewMode: 'calculator' | 'converter';
    setSwapUnitsTrigger: (fn: () => void) => void;
}

const MainView: React.FC<MainViewProps> = ({ history, setHistory, calculatorMode, mainViewMode, setSwapUnitsTrigger }) => {
    const { t } = useLanguage();
    const [expression, setExpression] = useState('');
    const [display, setDisplay] = useState('0');
    const [lastActionWasEquals, setLastActionWasEquals] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isShifted, setIsShifted] = useState(false);
    const [category, setCategory] = useState<UnitCategoryKey>('Length');
    const [fromUnit, setFromUnit] = useState('Kilometer');
    const [toUnit, setToUnit] = useState('Meter');
    const [outputValue, setOutputValue] = useState('1000');
    const [isSwapping, setIsSwapping] = useState(false);
    const [isSelectingUnit, setIsSelectingUnit] = useState<'from' | 'to' | null>(null);
    const keypadRef = useRef<HTMLDivElement>(null);
    const [keypadWidth, setKeypadWidth] = useState(0);
    const [dynamicBtnHeight, setDynamicBtnHeight] = useState(48);
    const [dynamicBtnGap, setDynamicBtnGap] = useState(12);
    const isConverterMode = mainViewMode === 'converter';
    
    useEffect(() => { if (mainViewMode === 'converter') { setExpression(''); setIsShifted(false); } }, [mainViewMode]);
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => { setIsAnimating(false); }, ANIMATION_DURATION + 50);
        return () => clearTimeout(timer);
    }, [calculatorMode, mainViewMode]);

    const calculateConversion = useCallback(() => {
        const inputNum = parseFloat(display);
        if (isNaN(inputNum)) {
            setOutputValue('');
            return;
        }

        const actualFromUnit = fromUnit;
        const actualToUnit = toUnit;

        if (category === 'Temperature') {
            let result: number;
            if (actualFromUnit === 'Celsius') {
                if (actualToUnit === 'Fahrenheit') result = inputNum * 9 / 5 + 32;
                else if (actualToUnit === 'Kelvin') result = inputNum + 273.15;
                else result = inputNum;
            } else if (actualFromUnit === 'Fahrenheit') {
                if (actualToUnit === 'Celsius') result = (inputNum - 32) * 5 / 9;
                else if (actualToUnit === 'Kelvin') result = (inputNum - 32) * 5 / 9 + 273.15;
                else result = inputNum;
            } else { // Kelvin
                if (actualToUnit === 'Celsius') result = inputNum - 273.15;
                else if (actualToUnit === 'Fahrenheit') result = (inputNum - 273.15) * 9 / 5 + 32;
                else result = inputNum;
            }
            setOutputValue(parseFloat(result.toPrecision(12)).toString());
        } else {
            const data = conversionData[category];
            const baseValue = inputNum * data.units[actualFromUnit];
            const result = baseValue / data.units[actualToUnit];
            setOutputValue(parseFloat(result.toPrecision(12)).toString());
        }
    }, [display, fromUnit, toUnit, category]);

    useEffect(() => {
        if (isConverterMode) {
            calculateConversion();
        }
    }, [isConverterMode, calculateConversion]);

    useLayoutEffect(() => {
        const handleResize = () => {
            if (keypadRef.current) {
                const containerHeight = keypadRef.current.offsetHeight;
                const containerWidth = keypadRef.current.offsetWidth;
                const PADDING = 16;
                const numRows = isConverterMode ? 5 : (calculatorMode === 'scientific' ? 7 : 5);
                const totalParts = (numRows * 4) + (numRows - 1) * 1;
                const availableHeight = containerHeight - (PADDING * 2);
                const partHeight = availableHeight / totalParts;
                const newHeight = Math.max(20, partHeight * 4);
                const newGap = Math.max(4, partHeight * 1);
                setDynamicBtnHeight(newHeight);
                setDynamicBtnGap(newGap);
                setKeypadWidth(containerWidth);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        const resizeObserver = new ResizeObserver(handleResize);
        if (keypadRef.current) resizeObserver.observe(keypadRef.current);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (keypadRef.current) resizeObserver.unobserve(keypadRef.current);
        };
    }, [calculatorMode, mainViewMode, isConverterMode]);

    const buttonStyles = useMemo(() => {
        if (keypadWidth === 0) return {};
        const sciLayout = calculateLayout('scientific', keypadWidth, dynamicBtnHeight, dynamicBtnGap);
        const basicLayout = calculateLayout('basic', keypadWidth, dynamicBtnHeight, dynamicBtnGap);
        const converterLayout = calculateLayout('converter', keypadWidth, dynamicBtnHeight, dynamicBtnGap);
        const styles: Record<string, React.CSSProperties> = {};

        allButtons.forEach(btn => {
            let targetStyle: React.CSSProperties | undefined;
            const isBasicOperator = (btn.type === 'operator' || btn.value === '=') && basicButtons.some(b => b.value === btn.value);
            const currentLayout = isConverterMode ? converterLayout : calculatorMode === 'basic' ? basicLayout : sciLayout;

            targetStyle = currentLayout[btn.value];

            if (!targetStyle) {
                // This button is not in the current layout, so it should be hidden (animated out).
                if (isConverterMode && isBasicOperator) {
                    const sourceStyle = basicLayout[btn.value];
                    if (sourceStyle) {
                        const sourceTranslateX = sourceStyle['--tw-translate-x'] as string || '0px';
                        const sourceTranslateY = sourceStyle['--tw-translate-y'] as string || '0px';
                        targetStyle = { ...sourceStyle, opacity: 0, transform: `translate(calc(${sourceTranslateX} + 100px), ${sourceTranslateY})`, pointerEvents: 'none' };
                    }
                } else {
                    const sourceLayout = (isConverterMode || calculatorMode === 'basic') ? sciLayout : basicLayout;
                    const sourceStyle = sourceLayout[btn.value] || basicLayout[btn.value] || sciLayout[btn.value];
                    if (sourceStyle) {
                        const sourceTranslateX = sourceStyle['--tw-translate-x'] as string || '0px';
                        const sourceTranslateY = sourceStyle['--tw-translate-y'] as string || '0px';
                        targetStyle = { ...sourceStyle, opacity: 0, transform: `translate(${sourceTranslateX}, ${sourceTranslateY}) scale(0.5)`, pointerEvents: 'none' };
                    }
                }
            }

            if (targetStyle) {
                const smootherEase = 'cubic-bezier(0.4, 0, 0.2, 1)';
                styles[btn.value] = {
                    ...targetStyle,
                    transition: `transform ${ANIMATION_DURATION}ms ${smootherEase}, opacity 300ms ease-out, width ${ANIMATION_DURATION}ms ${smootherEase}, height ${ANIMATION_DURATION}ms ${smootherEase}`,
                    willChange: 'transform, opacity, width, height',
                };
            }
        });
        return styles;
    }, [calculatorMode, keypadWidth, isConverterMode, dynamicBtnHeight, dynamicBtnGap]);

    const swapUnits = useCallback(() => {
        if (isSwapping) return;
        const SWAP_ANIMATION_DURATION = 400;

        setIsSwapping(true);

        setTimeout(() => {
            const currentFromUnit = fromUnit;
            const currentToUnit = toUnit;
            const currentOutputValue = outputValue;
            setFromUnit(currentToUnit);
            setToUnit(currentFromUnit);
            setDisplay(currentOutputValue);
        }, SWAP_ANIMATION_DURATION / 2);

        setTimeout(() => {
            setIsSwapping(false);
        }, SWAP_ANIMATION_DURATION);
    }, [fromUnit, toUnit, outputValue, isSwapping]);


    useEffect(() => { setSwapUnitsTrigger(swapUnits); }, [swapUnits, setSwapUnitsTrigger]);

    const handleButtonClick = (value: string) => {
        if (isAnimating) return; setLastActionWasEquals(false); if (display.length > MAX_EXPRESSION_LENGTH && !['AC', '=', 'backspace'].includes(value)) return;
        if (isConverterMode) {
            switch (value) {
                case 'AC': setIsClearing(true); setTimeout(() => { setDisplay('0'); setIsClearing(false); }, 200); break;
                case 'backspace': setDisplay(val => val.length > 1 ? val.slice(0, -1) : '0'); break;
                case '+/-': if (display !== '0') setDisplay(val => val.startsWith('-') ? val.slice(1) : '-' + val); break;
                case '.': if (!display.includes('.')) setDisplay(val => val + '.'); break;
                default: if (value >= '0' && value <= '9') { if (display === '0') setDisplay(value); else setDisplay(val => val + value); }
            }
        } else {
            switch (value) {
                case 'AC': setIsClearing(true); setTimeout(() => { setExpression(''); setDisplay('0'); setIsClearing(false); }, 200); break;
                case 'backspace': {
                    if (lastActionWasEquals) { setExpression(''); setDisplay('0'); setLastActionWasEquals(false); break; }
                    if (expression.length > 0) {
                        const newExpression = expression.slice(0, -1);
                        setExpression(newExpression);
                        const lastNumber = newExpression.match(/(\d+(\.\d+)?|pi|e)$/);
                        if(lastNumber) setDisplay(lastNumber[0]);
                        else if (newExpression.length === 0) setDisplay('0');
                        else {
                             const prevNumber = newExpression.match(/(\d+(\.\d+)?|pi|e)(?=[^0-9.]*$)/);
                             if (prevNumber) setDisplay(prevNumber[0]);
                             else setDisplay('0');
                        }
                    }
                    break;
                }
                case 'shift': setIsShifted(prev => !prev); break;
                case '()': { const openCount = (expression.match(/\(/g) || []).length; const closeCount = (expression.match(/\)/g) || []).length; if (openCount > closeCount && (/\d$/.test(expression) || expression.endsWith(')') || expression.endsWith('pi') || expression.endsWith('e'))) { handleButtonClick(')'); } else { handleButtonClick('('); } break; }
                case '=': if (expression) { const result = evaluateExpression(expression); setDisplay(result); setLastActionWasEquals(true); if (result !== 'Error') { setHistory([{ expression, result }, ...history.slice(0, MAX_HISTORY_ITEMS - 1)]); } setExpression(result !== 'Error' ? result : ''); } break;
                case '+/-': if (display !== '0' && display !== 'Error') { const newDisplay = display.startsWith('-') ? display.slice(1) : '-' + display; setDisplay(newDisplay); if (expression.endsWith(display)) { setExpression(prev => prev.slice(0, prev.length - display.length) + newDisplay); } } break;
                case '%': if (display !== 'Error' && display !== '0') { const num = parseFloat(display) / 100; setDisplay(num.toString()); setExpression(prev => prev.slice(0, prev.length - display.length) + num.toString()); } break;
                case '.': if (!display.includes('.')) { setExpression(expression + '.'); setDisplay(display + '.'); } break;
                default: if (lastActionWasEquals && !['+', '−', '×', '÷', '^'].includes(value)) { setExpression(value); setDisplay(value); return; }
                if (display === '0' || display === 'Error' || (['+', '−', '×', '÷'].some(op => expression.endsWith(op)) && !value.endsWith('('))) setDisplay(value);
                else { if (!['sin(', 'cos(', 'tan(', 'sqrt(', 'log(', 'asin(', 'acos(', 'atan(', 'cbrt(', 'log10(', 'abs(', 'floor(', 'ceil(', 'round('].includes(value)) setDisplay(prev => prev + value); }
                if (expression === '0' || expression === 'Error') setExpression(value);
                else setExpression(prev => prev + value);
            }
        }
    };

    const handleUnitSelect = (unit: string) => {
        if (isSelectingUnit === 'from') { if (unit === toUnit) setToUnit(fromUnit); setFromUnit(unit); } else { if (unit === fromUnit) setFromUnit(toUnit); setToUnit(unit); }
        setIsSelectingUnit(null);
    };

    return (
        <div className="flex h-full flex-col">
            <main className="flex-1 overflow-hidden relative">
                <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${mainViewMode === 'converter' ? '-translate-y-full' : 'translate-y-0'}`}>
                    <div className="h-full flex flex-col justify-end p-6 text-right overflow-hidden">
                        <div className={`mb-2 h-10 text-2xl font-bold text-text-muted truncate transition-opacity duration-300 ${isClearing ? 'animate-clear-out' : ''}`}>{expression || ' '}</div>
                        <div key={display} className={`font-bold break-all text-5xl ${isClearing ? 'animate-clear-out' : lastActionWasEquals ? 'animate-pop-in' : 'animate-pop-in-fast'} transition-all duration-200 ease-out`}>{formatNumber(display)}</div>
                    </div>
                </div>
                <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${mainViewMode === 'converter' ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="h-full flex flex-col p-6 text-right">
                        <div className="mb-4 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {(Object.keys(conversionData) as UnitCategoryKey[]).map((catKey) => (<button key={catKey} onClick={() => { setCategory(catKey); const units = Object.keys(conversionData[catKey].units); setFromUnit(units[0]); setToUnit(units[1] || units[0]); setDisplay('1'); }} className={`flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 transition-colors ${category === catKey ? 'bg-primary text-text-on-primary' : 'bg-surface text-text-muted hover:bg-text-color/10 hover:text-text-color'}`}><span className="material-symbols-outlined text-xl">{conversionData[catKey].icon}</span><span className="text-base font-semibold">{t(`unit_${catKey}` as TranslationKey)}</span></button>))}
                        </div>
                        <div className="relative flex flex-1 w-full flex-col gap-4 text-left">
                           <div className={`z-10 flex-1 flex w-full items-center justify-between cursor-pointer rounded-3xl p-4 bg-surface transition-all duration-400 ease-out-back ${isSwapping ? 'translate-y-[calc(50%_+_0.5rem)] scale-90' : ''}`}>
                                <div onClick={(e) => { e.stopPropagation(); setIsSelectingUnit('from'); }} className={`p-1 -m-1 rounded-lg transition-opacity duration-150 ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>
                                    <div className="flex items-center gap-1">
                                        <span className="text-2xl font-semibold">{t(`unit_${fromUnit}` as TranslationKey)}</span>
                                        <span className="material-symbols-outlined !text-2xl text-text-muted">expand_more</span>
                                    </div>
                                </div>
                                <p className={`text-3xl font-medium text-right transition-all duration-150 break-all ${isClearing ? 'animate-clear-out' : ''} ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>{formatNumber(display)}</p>
                            </div>

                            <div className={`flex-1 flex w-full items-center justify-between rounded-3xl p-4 bg-surface transition-all duration-400 ease-out-back ${isSwapping ? '-translate-y-[calc(50%_+_0.5rem)] scale-90' : ''}`}>
                                <div onClick={(e) => { e.stopPropagation(); setIsSelectingUnit('to'); }} className={`cursor-pointer p-1 -m-1 rounded-lg transition-opacity duration-150 ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>
                                    <div className="flex items-center gap-1">
                                        <span className="text-2xl font-semibold">{t(`unit_${toUnit}` as TranslationKey)}</span>
                                        <span className="material-symbols-outlined !text-2xl text-text-muted">expand_more</span>
                                    </div>
                                </div>
                                <p className={`text-3xl font-medium text-primary text-right transition-all duration-150 break-all ${isClearing ? 'animate-clear-out' : ''} ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>{formatNumber(outputValue)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer ref={keypadRef} className="relative bg-keypad rounded-t-3xl overflow-hidden transition-all" style={{ height: '46.66dvh' }}>
                {allButtons.map(btn => {
                    const finalStyle = buttonStyles[btn.value] || { opacity: 0, transform: 'scale(0)', pointerEvents: 'none' };
                    let finalConfig = btn;
                    const sciBtn = scientificButtons.find(b => b.value === btn.value);
                    if (calculatorMode === 'scientific' && isShifted && sciBtn?.shiftedDisplay) {
                        finalConfig = { ...btn, display: sciBtn.shiftedDisplay, value: sciBtn.shiftedValue || btn.value, };
                    }
                    let buttonSpecificClass = '';
                    if (btn.value === 'shift' && isShifted) buttonSpecificClass = '!bg-primary !text-text-on-primary';
                    else if (sciBtn?.shiftedDisplay && isShifted) buttonSpecificClass = '!bg-surface brightness-125 dark:brightness-150';
                    return <CalculatorButton key={btn.value} config={finalConfig} onClick={handleButtonClick} style={finalStyle} className={`${buttonSpecificClass} will-change-transform`} />;
                })}
            </footer>
            <UnitSelectionModal isOpen={isSelectingUnit !== null} units={Object.keys(conversionData[category].units).map(unitKey => t(`unit_${unitKey}` as TranslationKey))} selectedUnit={t(`unit_${isSelectingUnit === 'from' ? fromUnit : toUnit}` as TranslationKey)} onSelect={(unit) => { const unitKey = (Object.keys(t) as (string | number | symbol)[]).find(key => t(key as TranslationKey) === unit); if (unitKey) { handleUnitSelect(String(unitKey).replace('unit_', '')); } }} onClose={() => setIsSelectingUnit(null)} category={t(`unit_${category}` as TranslationKey)} />
        </div>
    );
};

export default MainView;