import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallPwaNotification: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (already installed)
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;

      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // Check iOS Safari
      const ua = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(ua);
      setIsIos(isIosDevice);

      // Check if previously dismissed in this session
      const dismissed = sessionStorage.getItem('lingol_pwa_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
        return;
      }

      // Capture native beforeinstallprompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsVisible(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Also display banner after a short delay for browsers (like mobile chrome/safari/desktop)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setIsVisible(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        clearTimeout(timer);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsVisible(false);
          setIsInstalled(true);
        }
      } catch (err) {
        console.warn('PWA prompt notice:', err);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosInstructions(true);
    } else {
      // For desktop or browsers without deferredPrompt
      alert(
        "Pour installer LinGoL sur votre appareil :\n1. Cliquez sur le menu de votre navigateur (⋮ ou Partager).\n2. Sélectionnez 'Installer l'application' ou 'Ajouter à l'écran d'accueil'."
      );
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lingol_pwa_dismissed', 'true');
    }
  };

  if (isInstalled || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-96 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <img src="/favicon.svg" alt="LinGoL" className="w-full h-full rounded-[10px]" />
          </div>

          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                Application LinGoL
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                Gratuit
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Installez LinGoL sur votre appareil
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Accédez plus rapidement à vos cours, leçons vocales et coachs IA directement depuis votre écran d'accueil.
            </p>
          </div>
        </div>

        {showIosInstructions ? (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Sur iPhone / iPad :</p>
            <p>1. Appuyez sur le bouton <strong>Partager</strong> <span className="text-indigo-500 font-bold">(carré avec flèche vers le haut)</span> en bas de Safari.</p>
            <p>2. Faites défiler et choisissez <strong>« Sur l'écran d'accueil »</strong>.</p>
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Plus tard
            </button>
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Installer l'application</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
