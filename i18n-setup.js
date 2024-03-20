import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

i18next.use(Backend).init({
  // Укажите языки, которые вы поддерживаете
  lng: 'ru', // Активный язык
  fallbackLng: 'ru', // Язык по умолчанию
  backend: {
    // Путь к вашим файлам локализации
    loadPath: './locales/{{lng}}.json',
  }
});

export default i18next;