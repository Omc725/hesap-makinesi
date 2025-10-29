import React from 'react';
import { UnitData } from '../types';

export const MAX_EXPRESSION_LENGTH = 40;
export const MAX_HISTORY_ITEMS = 50;
export const ANIMATION_DURATION = 400;

export interface ButtonConfig {
    display: string | React.ReactNode;
    shiftedDisplay?: string | React.ReactNode;
    value: string;
    shiftedValue?: string;
    type?: 'special' | 'operator';
    wide?: boolean;
}

export const scientificButtons: ButtonConfig[] = [
    { display: '|x|', value: 'abs(' },
    { display: '⌊x⌋', value: 'floor(' },
    { display: '⌈x⌉', value: 'ceil(' },
    { display: 'rand', value: 'random()' },
    { display: 'round', value: 'round(' },
    { display: 'sin', shiftedDisplay: 'sin⁻¹', value: 'sin(', shiftedValue: 'asin(' },
    { display: 'cos', shiftedDisplay: 'cos⁻¹', value: 'cos(', shiftedValue: 'acos(' },
    { display: 'tan', shiftedDisplay: 'tan⁻¹', value: 'tan(', shiftedValue: 'atan(' },
    { display: '√', shiftedDisplay: '³√', value: 'sqrt(', shiftedValue: 'cbrt(' },
    { display: 'ln', shiftedDisplay: 'log₁₀', value: 'log(', shiftedValue: 'log10(' },
    { display: 'x²', shiftedDisplay: 'x³', value: '^2', shiftedValue: '^3' },
    { display: 'AC', value: 'AC', type: 'special' }, { display: '±', value: '+/-', type: 'special' }, { display: React.createElement('span', { className: "material-symbols-outlined" }, 'backspace'), value: 'backspace', type: 'special' }, { display: '÷', value: '/', type: 'operator' },
    { display: 'xʸ', shiftedDisplay: 'ʸ√x', value: '^', shiftedValue: '^(1/' },
    { display: '7', value: '7' }, { display: '8', value: '8' }, { display: '9', value: '9' }, { display: '×', value: '*', type: 'operator' },
    { display: 'π', value: 'pi' }, { display: '4', value: '4' }, { display: '5', value: '5' }, { display: '6', value: '6' }, { display: '−', value: '-', type: 'operator' },
    { display: 'e', value: 'e' }, { display: '1', value: '1' }, { display: '2', value: '2' }, { display: '3', 'value': '3' }, { display: '+', value: '+', type: 'operator' },
    { display: '()', value: '()', type: 'special' },
    { display: '0', value: '0' },
    { display: '.', value: '.' },
    // FIX: Replaced JSX with React.createElement to avoid parsing errors in .ts file.
    { display: React.createElement('span', { className: "material-symbols-outlined !text-2xl" }, 'swap_horiz'), value: 'shift', type: 'special' },
    { display: '=', value: '=', type: 'special' },
];

export const basicButtons: ButtonConfig[] = [
    { display: 'AC', value: 'AC', type: 'special' }, { display: '±', value: '+/-', type: 'special' }, { display: React.createElement('span', { className: "material-symbols-outlined" }, 'backspace'), value: 'backspace', type: 'special' }, { display: '÷', value: '/', type: 'operator' },
    { display: '7', value: '7' }, { display: '8', value: '8' }, { display: '9', value: '9' }, { display: '×', value: '*', type: 'operator' },
    { display: '4', value: '4' }, { display: '5', value: '5' }, { display: '6', value: '6' }, { display: '−', value: '-', type: 'operator' },
    { display: '1', value: '1' }, { display: '2', value: '2' }, { display: '3', 'value': '3' }, { display: '+', value: '+', type: 'operator' },
    { display: '0', value: '0', wide: true }, { display: '.', value: '.' }, { display: '=', value: '=', type: 'special' },
];

const baseButtons = [...scientificButtons, ...basicButtons].reduce((acc, btn) => {
    if (!acc.find(b => b.value === btn.value)) acc.push(btn);
    return acc;
}, [] as ButtonConfig[]);

export const allButtons = baseButtons;


export const conversionData: UnitData = {
    Length: { icon: 'straighten', units: { Kilometer: 1000, Meter: 1, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.34, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 }, baseUnit: 'Meter' },
    Weight: { icon: 'weight', units: { Tonne: 1000, Kilogram: 1, Gram: 0.001, Milligram: 0.000001, Pound: 0.453592, Ounce: 0.0283495 }, baseUnit: 'Kilogram' },
    Volume: { icon: 'science', units: { Liter: 1, Milliliter: 0.001, CubicMeter: 1000, CubicCentimeter: 0.001, Gallon: 3.78541, Quart: 0.946353 }, baseUnit: 'Liter' },
    Speed: { icon: 'speed', units: { Kps: 1000, Mps: 1, Kph: 0.277778, Mph: 0.44704 }, baseUnit: 'Mps' },
    Temperature: { icon: 'thermostat', units: { Celsius: 0, Fahrenheit: 0, Kelvin: 0 }, baseUnit: 'Celsius' },
};