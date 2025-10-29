export enum View {
  CALCULATOR,
  HISTORY,
  SETTINGS,
}

export interface HistoryEntry {
  expression: string;
  result: string;
}

export type UnitCategoryKey = 'Length' | 'Temperature' | 'Weight' | 'Volume' | 'Speed';

export interface ConversionRates {
  [key: string]: number;
}

export type UnitData = {
  [key in UnitCategoryKey]: {
      icon: string;
      units: ConversionRates;
      baseUnit: string;
  };
};

// FIX: Added missing Language and TranslationKey types to be used across the application.
// --- Language Types ---
export type Language = 'tr' | 'en' | 'es' | 'de' | 'fr' | 'it' | 'pt' | 'ja' | 'ru';

export type TranslationKey =
  | 'historyTitle'
  | 'settingsTitle'
  | 'noHistory'
  | 'clearHistory'
  | 'appearance'
  | 'darkMode'
  | 'language'
  | 'about'
  | 'appVersion'
  | 'close'
  | 'unitSelectionTitle'
  | 'colorTheme'
  | 'unit_Length'
  | 'unit_Weight'
  | 'unit_Volume'
  | 'unit_Speed'
  | 'unit_Temperature'
  | 'unit_Kilometer'
  | 'unit_Meter'
  | 'unit_Centimeter'
  | 'unit_Millimeter'
  | 'unit_Mile'
  | 'unit_Yard'
  | 'unit_Foot'
  | 'unit_Inch'
  | 'unit_Tonne'
  | 'unit_Kilogram'
  | 'unit_Gram'
  | 'unit_Milligram'
  | 'unit_Pound'
  | 'unit_Ounce'
  | 'unit_Liter'
  | 'unit_Milliliter'
  | 'unit_CubicMeter'
  | 'unit_CubicCentimeter'
  | 'unit_Gallon'
  | 'unit_Quart'
  | 'unit_Kps'
  | 'unit_Mps'
  | 'unit_Kph'
  | 'unit_Mph'
  | 'unit_Celsius'
  | 'unit_Fahrenheit'
  | 'unit_Kelvin';

// --- Theme Types ---
export type ThemeMode = 'light' | 'dark';
export type ThemeName = 'default' | 'ocean' | 'sunset' | 'forest' | 'graphite' | 'sakura' | 'matrix' | 'royal' | 'mocha' | 'mint' | 'lavender' | 'ruby';

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  keypad: string;
  'number-key': string;
  text: string;
  'text-muted': string;
  'text-on-primary': string;
  'text-on-secondary': string;
}

export interface Theme {
  light: ColorPalette;
  dark: ColorPalette;
}

export interface Themes {
  [key: string]: Theme;
}