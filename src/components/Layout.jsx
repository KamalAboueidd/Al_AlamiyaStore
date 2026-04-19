import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, ChevronDown, Menu, X } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import useSettingsStore from '../store/settingsStore';

const Layout = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, language, setLanguage } = useSettingsStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const brandText = language === 'ar' ? 'العالمية ستور' : 'Al Alamiyah Store';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-72 bg-white dark:bg-[#0a0a0a] shadow-2xl border-l border-gray-100 dark:border-white/10"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tighter">{brandText}</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 opacity-50">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Main Link */}
                <Link
                  to="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-4 px-5 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-center font-black shadow-xl"
                >
                  {t('nav.create')}
                </Link>

                {/* Language Toggles (Black & White Only) */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">
                    {t('settings.language')}
                  </p>
                  <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl">
                    <button 
                      onClick={() => changeLanguage('en')} 
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                        language === 'en' 
                        ? 'bg-white text-black dark:bg-white/10 dark:text-white shadow-sm' 
                        : 'text-gray-400 opacity-50'
                      }`}
                    >
                      ENGLISH
                    </button>
                    <button 
                      onClick={() => changeLanguage('ar')} 
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                        language === 'ar' 
                        ? 'bg-white text-black dark:bg-white/10 dark:text-white shadow-sm' 
                        : 'text-gray-400 opacity-50'
                      }`}
                    >
                      العربية
                    </button>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">
                    {t('settings.theme')}
                  </p>
                  <button 
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between py-4 px-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 transition-all"
                  >
                    <span className="font-bold text-sm">
                      {theme === 'dark' ? t('settings.dark') : t('settings.light')}
                    </span>
                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tighter hover:opacity-60 transition-opacity">
            {brandText}
          </Link>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-3 rtl:space-x-reverse">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl border border-gray-100 bg-white dark:border-white/10 dark:bg-white/5 transition-all shadow-sm"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="relative group">
              <button className="inline-flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-3 text-xs font-black tracking-widest dark:border-white/10 dark:bg-white/5 transition-all">
                {language.toUpperCase()}
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform opacity-40" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-2xl border border-gray-100 bg-white dark:bg-[#0a0a0a] dark:border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => changeLanguage('en')}
                  className="w-full px-5 py-4 text-left text-xs font-bold transition-colors"
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage('ar')}
                  className="w-full px-5 py-4 text-left text-xs font-bold transition-colors"
                >
                  العربية
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-3 rounded-2xl border border-gray-100 dark:border-white/10 dark:bg-white/5 active:scale-95 transition-all"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;