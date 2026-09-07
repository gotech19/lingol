import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/firebaseConfig';
import { SUPPORTED_LEARNING_LANGUAGES } from '../data/languages';
import { LearningLanguage } from '../types';
import { Mail, Lock, User, X, AlertCircle, Sparkles, CheckCircle2, Award, Globe } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { user, isAuthModalOpen, setIsAuthModalOpen, updateUser, setActiveView, showNotification } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<LearningLanguage>(user.learningLanguage || 'en');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const userProfile = await authService.loginWithEmail(email, password);
        updateUser(userProfile);
        setIsAuthModalOpen(false);

        if (!userProfile.hasCompletedLevelTest) {
          showNotification(`Bienvenue ${userProfile.name} ! Débutons votre test de niveau obligatoire.`);
          setActiveView('onboarding');
        } else {
          showNotification(`Ravi de vous revoir, ${userProfile.name} !`);
          setActiveView('dashboard');
        }
      } else if (mode === 'register') {
        if (!name.trim()) {
          setError('Veuillez renseigner votre nom complet.');
          setIsLoading(false);
          return;
        }
        const userProfile = await authService.registerWithEmail(name, email, password, targetLanguage);
        updateUser({ ...userProfile, learningLanguage: targetLanguage });
        showNotification(`Compte créé avec succès ! Place au test de niveau obligatoire.`);
        setIsAuthModalOpen(false);
        // Direct transition to mandatory Level Assessment!
        setActiveView('onboarding');
      } else if (mode === 'reset') {
        await authService.resetPassword(email);
        showNotification('Instructions de réinitialisation envoyées par e-mail.');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'Authentification échouée. Veuillez vérifier vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const userProfile = await authService.loginWithGoogle(targetLanguage);
      updateUser({ ...userProfile, learningLanguage: targetLanguage });
      setIsAuthModalOpen(false);

      if (!userProfile.hasCompletedLevelTest) {
        showNotification(`Authentification Google réussie ! Débutons votre test de niveau obligatoire.`);
        setActiveView('onboarding');
      } else {
        showNotification(`Ravi de vous revoir, ${userProfile.name} !`);
        setActiveView('dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'La connexion avec Google n’a pas pu aboutir.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Mandatory Level Test Callout */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/25">
            L
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {mode === 'login' && 'Connexion à LinGoL'}
            {mode === 'register' && 'Inscription Obligatoire'}
            {mode === 'reset' && 'Réinitialiser votre mot de passe'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login' && 'Accédez à votre compagnon IA et à vos parcours de conversation.'}
            {mode === 'register' && 'Créez votre compte pour démarrer votre test de niveau initial.'}
            {mode === 'reset' && 'Renseignez votre e-mail pour recevoir les instructions.'}
          </p>

          {/* Mandatory level assessment banner */}
          <div className="mt-3 py-2 px-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 text-left flex items-start gap-2.5">
            <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-indigo-950 dark:text-indigo-200 leading-tight">
              <span className="font-bold">Test de niveau au démarrage :</span> Après inscription ou connexion Google, vous passerez une évaluation diagnostique CECR (A1–C2) pour calibrer votre parcours.
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign-in button */}
        {mode !== 'reset' && (
          <>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow active:scale-[0.99] mb-4"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
              <span className="px-3 text-[11px] text-slate-400 uppercase font-semibold">ou par e-mail</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
            </div>
          </>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom et Prénom
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Jean Dupont"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Langue à apprendre pour le test de niveau
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORTED_LEARNING_LANGUAGES.slice(0, 4).map((lang) => (
                    <button
                      type="button"
                      key={lang.code}
                      onClick={() => setTargetLanguage(lang.code)}
                      className={`py-2 px-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                        targetLanguage === lang.code
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="truncate">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mot de passe
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {mode === 'login' && 'Se connecter'}
                  {mode === 'register' && 'Créer mon compte & Passer le test'}
                  {mode === 'reset' && 'Envoyer le lien de réinitialisation'}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              Pas encore de compte ?{' '}
              <button
                onClick={() => setMode('register')}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                S’inscrire
              </button>
            </p>
          ) : (
            <p>
              Déjà un compte ?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
