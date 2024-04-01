import onChange from 'on-change';
import i18next from 'i18next';

import ru from '../../locales/ru.js';
import '../scss/styles.scss';
import validate from '../js/validator.js';
import { renderForm, renderLinks } from '../js/render.js';
import parseLinks from '../js/parser.js';


export default async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru
    },
  });

  const state = {
    form: {
      isValid: '',
      validationResult: '',
    },
    links: [],
  };

  const watchedState = onChange(state, async (path, value, previousValue) => {
    if (path === 'form') {
      renderForm(state, i18nextInstance);
    }
    if (path === 'links') {
      parseLinks(state)
      .then((newsList) => renderLinks(newsList));
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputUrlObj = Object.fromEntries(formData);
    validate(inputUrlObj, watchedState);
  });
}
