// App.tsx (Son Hali)

import React, { useState, useEffect } from 'react';
import { View, HistoryEntry } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import CalculatorView from './components/CalculatorView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import InstallPrompt from './components/InstallPrompt'; // Yeni bileşeni import ettik

type AnimationOrigin = { top: string; right: string; bottom: string; left: string; } | null;

// Bu bileşen HİÇ DEĞİŞMEDİ. Orijinal uygulamanızın kendisidir.
const AppContent: React.FC = () => {
    const [view, setView] = useState<View>(View.CALCULATOR);
    const [animationOrigin, setAnimationOrigin] = useState<AnimationOrigin>(null);
    const [history, setHistory] = useState<HistoryEntry[]>(() => {
        try {
            const savedHistory = localStorage.getItem('calcHistory');
            return savedHistory ? JSON.parse(savedHistory) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('calcHistory', JSON.stringify(history));
    }, [history]);

    const handleNavigate = (targetView: View, event: React.MouseEvent<HTMLButtonElement>) => {
        const islandElement = event.currentTarget.parentElement;
        if (!islandElement) return;
        const rect = islandElement.getBoundingClientRect();
        const container = event.currentTarget.closest('.max-w-lg');
        if (!container) return;
        const containerRect = container.getBoundingClientRect();

        setAnimationOrigin({
            top: `${rect.top - containerRect.top}px`,
            right: `${containerRect.right - rect.right}px`,
            bottom: `${containerRect.bottom - rect.bottom}px`,
            left: `${rect.left - containerRect.left}px`,
        });

        setView(targetView);
    };

    return (
        <>
        <CalculatorView onNavigate={handleNavigate} history={history} setHistory={setHistory} />
        {view === View.HISTORY && (
            <HistoryView
            setView={() => setView(View.CALCULATOR)}
            history={history}
            setHistory={setHistory}
            animationOrigin={animationOrigin}
            />
        )}
        {view === View.SETTINGS && (
            <SettingsView
            setView={() => setView(View.CALCULATOR)}
            animationOrigin={animationOrigin}
            />
        )}
        </>
    );
}

// Orijinal App bileşeni yerine bu YENİ App bileşenini kullanıyoruz.
const App: React.FC = () => {
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Tarayıcının PWA modunda olup olmadığını kontrol et
        const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches;

        // Geliştirme ortamında bu kontrolü atlayarak test etmeyi kolaylaştır
        // 'vite' process.env'yi bu şekilde kullanılabilir yapar
        if (import.meta.env.DEV) {
            setIsStandalone(true);
        } else {
            setIsStandalone(isRunningStandalone);
        }
    }, []);

    return (
        <ThemeProvider>
        <LanguageProvider>
        <div className="h-[100dvh] w-full max-w-lg mx-auto bg-background relative overflow-hidden shadow-2xl">
        {isStandalone ? <AppContent /> : <InstallPrompt />}
        </div>
        </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;
