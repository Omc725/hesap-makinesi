import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Language, TranslationKey } from '../types';

const translations = {
    tr: {
        historyTitle: 'Hesaplama Geçmişi', settingsTitle: 'Ayarlar', noHistory: 'Henüz hesaplama yok.', clearHistory: 'Geçmişi Temizle', appearance: 'Görünüm', darkMode: 'Koyu Mod', language: 'Dil', about: 'Hakkında', appVersion: 'Uygulama Versiyonu', close: 'Kapat', unitSelectionTitle: '{category} Birimleri', unit_Length: 'Uzunluk', unit_Weight: 'Ağırlık', unit_Volume: 'Hacim', unit_Speed: 'Hız', unit_Temperature: 'Sıcaklık', unit_Kilometer: 'Kilometre', unit_Meter: 'Metre', unit_Centimeter: 'Santimetre', unit_Millimeter: 'Milimetre', unit_Mile: 'Mil', unit_Yard: 'Yard', unit_Foot: 'Fit', unit_Inch: 'İnç', unit_Tonne: 'Ton', unit_Kilogram: 'Kilogram', unit_Gram: 'Gram', unit_Milligram: 'Miligram', unit_Pound: 'Pound', unit_Ounce: 'Ons', unit_Liter: 'Litre', unit_Milliliter: 'Mililitre', unit_CubicMeter: 'Metreküp', unit_CubicCentimeter: 'Santimetreküp', unit_Gallon: 'Galon', unit_Quart: 'Kuart', unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mil/h', unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', colorTheme: 'Renk Teması',
    },
    en: {
        historyTitle: 'Calculation History', settingsTitle: 'Settings', noHistory: 'No calculations yet.', clearHistory: 'Clear History', appearance: 'Appearance', darkMode: 'Dark Mode', language: 'Language', about: 'About', appVersion: 'App Version', close: 'Close', unitSelectionTitle: '{category} Units', unit_Length: 'Length', unit_Weight: 'Weight', unit_Volume: 'Volume', unit_Speed: 'Speed', unit_Temperature: 'Temperature', unit_Kilometer: 'Kilometer', unit_Meter: 'Meter', unit_Centimeter: 'Centimeter', unit_Millimeter: 'Millimeter', unit_Mile: 'Mile', unit_Yard: 'Yard', unit_Foot: 'Foot', unit_Inch: 'Inch', unit_Tonne: 'Tonne', unit_Kilogram: 'Kilogram', unit_Gram: 'Gram', unit_Milligram: 'Milligram', unit_Pound: 'Pound', unit_Ounce: 'Ounce', unit_Liter: 'Liter', unit_Milliliter: 'Milliliter', unit_CubicMeter: 'Cubic Meter', unit_CubicCentimeter: 'Cubic Centimeter', unit_Gallon: 'Gallon', unit_Quart: 'Quart', unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', colorTheme: 'Color Theme',
    },
    es: {
        historyTitle: 'Historial de Cálculos', settingsTitle: 'Ajustes', noHistory: 'Aún no hay cálculos.', clearHistory: 'Limpiar Historial', appearance: 'Apariencia', darkMode: 'Modo Oscuro', language: 'Idioma', about: 'Acerca de', appVersion: 'Versión de la App', close: 'Cerrar', unitSelectionTitle: 'Unidades de {category}', unit_Length: 'Longitud', unit_Weight: 'Peso', unit_Volume: 'Volumen', unit_Speed: 'Velocidad', unit_Temperature: 'Temperatura', unit_Kilometer: 'Kilómetro', unit_Meter: 'Metro', unit_Centimeter: 'Centímetro', unit_Millimeter: 'Milímetro', unit_Mile: 'Milla', unit_Yard: 'Yarda', unit_Foot: 'Pie', unit_Inch: 'Pulgada', unit_Tonne: 'Tonelada', unit_Kilogram: 'Kilogramo', unit_Gram: 'Gramo', unit_Milligram: 'Miligramo', unit_Pound: 'Libra', unit_Ounce: 'Onza', unit_Liter: 'Litro', unit_Milliliter: 'Mililitro', unit_CubicMeter: 'Metro Cúbico', unit_CubicCentimeter: 'Centímetro Cúbico', unit_Gallon: 'Galón', unit_Quart: 'Cuarto de Galón', unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', colorTheme: 'Tema de Color',
    },
    de: {
        historyTitle: 'Verlauf', settingsTitle: 'Einstellungen', noHistory: 'Noch keine Berechnungen.', clearHistory: 'Verlauf löschen', appearance: 'Erscheinungsbild', darkMode: 'Dunkelmodus', language: 'Sprache', about: 'Über', appVersion: 'App-Version', close: 'Schließen', unitSelectionTitle: 'Einheiten für {category}', unit_Length: 'Länge', unit_Weight: 'Gewicht', unit_Volume: 'Volumen', unit_Speed: 'Geschwindigkeit', unit_Temperature: 'Temperatur', unit_Kilometer: 'Kilometer', unit_Meter: 'Meter', unit_Centimeter: 'Zentimeter', unit_Millimeter: 'Millimeter', unit_Mile: 'Meile', unit_Yard: 'Yard', unit_Foot: 'Fuß', unit_Inch: 'Zoll', unit_Tonne: 'Tonne', unit_Kilogram: 'Kilogramm', unit_Gram: 'Gramm', unit_Milligram: 'Milligramm', unit_Pound: 'Pfund', unit_Ounce: 'Unze', unit_Liter: 'Liter', unit_Milliliter: 'Milliliter', unit_CubicMeter: 'Kubikmeter', unit_CubicCentimeter: 'Kubikzentimeter', unit_Gallon: 'Gallone', unit_Quart: 'Quart', unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', colorTheme: 'Farbthema',
    },
    fr: {
        historyTitle: 'Historique des calculs', settingsTitle: 'Réglages', noHistory: 'Aucun calcul pour le moment.', clearHistory: 'Effacer l’historique', appearance: 'Apparence', darkMode: 'Mode Sombre', language: 'Langue', about: 'À propos', appVersion: 'Version de l’application', close: 'Fermer', unitSelectionTitle: 'Unités de {category}', unit_Length: 'Longueur', unit_Weight: 'Poids', unit_Volume: 'Volume', unit_Speed: 'Vitesse', unit_Temperature: 'Température', unit_Kilometer: 'Kilomètre', unit_Meter: 'Mètre', unit_Centimeter: 'Centimètre', unit_Millimeter: 'Millimètre', unit_Mile: 'Mile', unit_Yard: 'Yard', unit_Foot: 'Pied', unit_Inch: 'Pouce', unit_Tonne: 'Tonne', unit_Kilogram: 'Kilogramme', unit_Gram: 'Gramme', unit_Milligram: 'Milligramme', unit_Pound: 'Livre', unit_Ounce: 'Once', unit_Liter: 'Litre', unit_Milliliter: 'Millilitre', unit_CubicMeter: 'Mètre cube', unit_CubicCentimeter: 'Centimètre cube', unit_Gallon: 'Gallon', unit_Quart: 'Quart', unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', colorTheme: 'Thème de couleur',
    },
    it: {
        historyTitle: 'Cronologia Calcoli', settingsTitle: 'Impostazioni', noHistory: 'Nessun calcolo ancora.', clearHistory: 'Cancella Cronologia', appearance: 'Aspetto', darkMode: 'Modalità Scura', language: 'Lingua', about: 'Informazioni', appVersion: 'Versione App', close: 'Chiudi', unitSelectionTitle: 'Unità di {category}', unit_Length: 'Lunghezza', unit_Weight: 'Peso', unit_Volume: 'Volume', unit_Speed: 'Velocità', unit_Temperature: 'Temperatura', unit_Kilometer: 'Chilometro', unit_Meter: 'Metro', unit_Centimeter: 'Centimetro', unit_Millimeter: 'Millimetro', unit_Mile: 'Miglio', unit_Yard: 'Iarda', unit_Foot: 'Piede', unit_Inch: 'Pollice', unit_Tonne: 'Tonnellata', unit_Kilogram: 'Chilogrammo', unit_Gram: 'Grammo', unit_Milligram: 'Milligrammo', unit_Pound: 'Libbra', unit_Ounce: 'Oncia', unit_Liter: 'Litro', unit_Milliliter: 'Millilitro', unit_CubicMeter: 'Metro Cubo', unit_CubicCentimeter: 'Centimetro Cubo', unit_Gallon: 'Gallone', unit_Quart: 'Quarto', unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', colorTheme: 'Tema Colore',
    },
    pt: {
        historyTitle: 'Histórico de Cálculos', settingsTitle: 'Configurações', noHistory: 'Nenhum cálculo ainda.', clearHistory: 'Limpar Histórico', appearance: 'Aparência', darkMode: 'Modo Escuro', language: 'Idioma', about: 'Sobre', appVersion: 'Versão do App', close: 'Fechar', unitSelectionTitle: 'Unidades de {category}', unit_Length: 'Comprimento', unit_Weight: 'Peso', unit_Volume: 'Volume', unit_Speed: 'Velocidade', unit_Temperature: 'Temperatura', unit_Kilometer: 'Quilômetro', unit_Meter: 'Metro', unit_Centimeter: 'Centímetro', unit_Millimeter: 'Milímetro', unit_Mile: 'Milha', unit_Yard: 'Jarda', unit_Foot: 'Pé', unit_Inch: 'Polegada', unit_Tonne: 'Tonelada', unit_Kilogram: 'Quilograma', unit_Gram: 'Grama', unit_Milligram: 'Miligrama', unit_Pound: 'Libra', unit_Ounce: 'Onça', unit_Liter: 'Litro', unit_Milliliter: 'Mililitro', unit_CubicMeter: 'Metro Cúbico', unit_CubicCentimeter: 'Centímetro Cúbico', unit_Gallon: 'Galão', unit_Quart: 'Quarto', unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', colorTheme: 'Tema de Cores',
    },
    ja: {
        historyTitle: '計算履歴', settingsTitle: '設定', noHistory: '計算履歴はありません。', clearHistory: '履歴を消去', appearance: '外観', darkMode: 'ダークモード', language: '言語', about: '情報', appVersion: 'アプリバージョン', close: '閉じる', unitSelectionTitle: '{category}の単位', unit_Length: '長さ', unit_Weight: '重さ', unit_Volume: '体積', unit_Speed: '速度', unit_Temperature: '温度', unit_Kilometer: 'キロメートル', unit_Meter: 'メートル', unit_Centimeter: 'センチメートル', unit_Millimeter: 'ミリメートル', unit_Mile: 'マイル', unit_Yard: 'ヤード', unit_Foot: 'フィート', unit_Inch: 'インチ', unit_Tonne: 'トン', unit_Kilogram: 'キログラム', unit_Gram: 'グラム', unit_Milligram: 'ミリグラム', unit_Pound: 'ポンド', unit_Ounce: 'オンス', unit_Liter: 'リットル', unit_Milliliter: 'ミリリットル', unit_CubicMeter: '立方メートル', unit_CubicCentimeter: '立方センチメートル', unit_Gallon: 'ガロン', unit_Quart: 'クォート', unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'マイル/時', unit_Celsius: '摂氏', unit_Fahrenheit: '華氏', unit_Kelvin: 'ケルビン', colorTheme: 'カラーテーマ',
    },
    ru: {
        historyTitle: 'История вычислений', settingsTitle: 'Настройки', noHistory: 'Вычислений пока нет.', clearHistory: 'Очистить историю', appearance: 'Внешний вид', darkMode: 'Темный режим', language: 'Язык', about: 'О приложении', appVersion: 'Версия приложения', close: 'Закрыть', unitSelectionTitle: 'Единицы {category}', unit_Length: 'Длина', unit_Weight: 'Вес', unit_Volume: 'Объем', unit_Speed: 'Скорость', unit_Temperature: 'Температура', unit_Kilometer: 'Километр', unit_Meter: 'Метр', unit_Centimeter: 'Сантиметр', unit_Millimeter: 'Миллиметр', unit_Mile: 'Миля', unit_Yard: 'Ярд', unit_Foot: 'Фут', unit_Inch: 'Дюйм', unit_Tonne: 'Тонна', unit_Kilogram: 'Килограмм', unit_Gram: 'Грамм', unit_Milligram: 'Миллиграмм', unit_Pound: 'Фунт', unit_Ounce: 'Унция', unit_Liter: 'Литр', unit_Milliliter: 'Миллилитр', unit_CubicMeter: 'Кубический метр', unit_CubicCentimeter: 'Кубический сантиметр', unit_Gallon: 'Галлон', unit_Quart: 'Кварта', unit_Kps: 'км/с', unit_Mps: 'м/с', unit_Kph: 'км/ч', unit_Mph: 'миль/ч', unit_Celsius: 'Цельсий', unit_Fahrenheit: 'Фаренгейт', unit_Kelvin: 'Кельвин', colorTheme: 'Цветовая тема',
    }
};

export const nativeLanguageNames: Record<Language, string> = {
    tr: 'Türkçe 🇹🇷',
    en: 'English 🇬🇧',
    es: 'Español 🇪🇸',
    de: 'Deutsch 🇩🇪',
    fr: 'Français 🇫🇷',
    it: 'Italiano 🇮🇹',
    pt: 'Português 🇵🇹',
    ja: '日本語 🇯🇵',
    ru: 'Русский 🇷🇺',
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'tr');

     useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = useCallback((key: TranslationKey, replacements?: Record<string, string>): string => {
        let translation = (translations[language] as any)[key] || translations.tr[key];
        if (replacements) {
            Object.entries(replacements).forEach(([placeholder, value]) => {
                translation = translation.replace(`{${placeholder}}`, value);
            });
        }
        return translation;
    }, [language]);

    const languageContextValue = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

    return (
        <LanguageContext.Provider value={languageContextValue}>
            {children}
        </LanguageContext.Provider>
    );
};
