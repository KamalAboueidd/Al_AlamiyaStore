import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Moon, Sun, Globe } from 'lucide-react';
import useSettingsStore from '../store/settingsStore';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, language, setLanguage } = useSettingsStore();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{t('nav.settings')}</h1>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Sun className="mr-2" size={20} />
              {t('settings.theme')}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  theme === 'dark' ? 'border-blue-500 bg-blue-500/10' : 'border-dark-border'
                }`}
              >
                <Moon size={16} />
                <span>{t('settings.dark')}</span>
              </button>
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  theme === 'light' ? 'border-blue-500 bg-blue-500/10' : 'border-dark-border'
                }`}
              >
                <Sun size={16} />
                <span>{t('settings.light')}</span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Globe className="mr-2" size={20} />
              {t('settings.language')}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => changeLanguage('en')}
                className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  language === 'en' ? 'border-blue-500 bg-blue-500/10' : 'border-dark-border'
                }`}
              >
                <span>{t('settings.english')}</span>
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  language === 'ar' ? 'border-blue-500 bg-blue-500/10' : 'border-dark-border'
                }`}
              >
                <span>{t('settings.arabic')}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;