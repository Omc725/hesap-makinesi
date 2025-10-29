// components/InstallPrompt.tsx

import React, { useState, useEffect } from 'react';

// Bu tip, 'beforeinstallprompt' olayını TypeScript'te kullanmak için gereklidir.
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed',
        platform: string
    }>;
    prompt(): Promise<void>;
}

const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOs, setIsIOs] = useState(false);

    useEffect(() => {
        // iOS'u tespit et
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOs(isIOSDevice);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-background text-center p-8">
        <span className="material-symbols-outlined !text-8xl text-primary mb-4">
        calculate
        </span>
        <h1 className="text-3xl font-bold mb-2">Gemini AI Calculator</h1>
        <p className="text-lg text-text-muted mb-8 max-w-md">
        En iyi deneyim için lütfen uygulamayı ana ekranınıza ekleyerek kullanın.
        </p>

        {/* iOS için özel talimatlar */}
        {isIOs && (
            <div className="bg-surface rounded-xl p-4 text-left text-sm flex items-center gap-4">
            <span className="material-symbols-outlined !text-3xl">ios_share</span>
            <div>
            Uygulamayı yüklemek için tarayıcınızdaki <strong>Paylaş</strong> düğmesine ve ardından <strong>"Ana Ekrana Ekle"</strong> seçeneğine dokunun.
            </div>
            </div>
        )}

        {/* Diğer platformlar için yükleme butonu (Chrome, Edge vb.) */}
        {!isIOs && deferredPrompt && (
            <button
            onClick={handleInstallClick}
            className="flex items-center justify-center gap-2 w-full max-w-xs rounded-full bg-primary py-4 text-xl font-bold text-text-on-primary transition-transform active:scale-95 shadow-lg hover:brightness-110"
            >
            <span className="material-symbols-outlined">download</span>
            Uygulamayı Yükle
            </button>
        )}
        </div>
    );
};

export default InstallPrompt;
