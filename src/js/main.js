import onChange from 'on-change';
import i18next from 'i18next';

import ru from './locales/ru.js';
import '../scss/styles.scss';
import { validateUrl, validateIsRss } from './validator.js';
import {
  renderForm, renderPageContent,
} from './render.js';

const getDataFromLink = (link) => {
  const host = 'https://allorigins.hexlet.app/';
  const params = `get?disableCache=true&url=${encodeURIComponent(link)}`;
  const proxyUrl = new URL(params, host);
  return fetch(proxyUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    });
};

const getDataFromLinks = async (state) => {
  const links = state.rssLinks;
  const promises = links.map((link) => getDataFromLink(link)
    .then((v) => ({ result: 'success', data: v }))
    .catch((e) => ({ result: 'error', error: e })));
  return Promise.all(promises)
    .then((feeds) => feeds
      .filter((feed) => feed.result === 'success')
      .map((feed) => feed.data));
};

const app = async () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const updatePageContent = async (state) => {
    getDataFromLinks(state)
      .then((data) => renderPageContent(data, state, i18nextInstance))
      .then(() => setTimeout(() => updatePageContent(state), 5000));
  };

  const state = {
    form: {
      isValid: '',
      validationResult: '',
    },
    rssLinks: [],
    rssLinksContent: [],
    checkedPosts: [],
  };

  setTimeout(() => updatePageContent(state), 5000);

  const watchedState = onChange(state, (path) => {
    console.log(state);
    if (path === 'form') {
      renderForm(state, i18nextInstance);
    }
    if (path === 'rssLinksContent') {
      renderPageContent(state.rssLinksContent, state, i18nextInstance);
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputUrlObj = Object.fromEntries(formData);

    validateUrl(inputUrlObj)
      .then((urlValidationResult) => {
        if (urlValidationResult) {
          if (state.rssLinks.includes(inputUrlObj.url)) {
            watchedState.form = {
              isValid: false,
              validationResult: 'urlExist',
            };
          } else {
            let urlResponse;
            getDataFromLink(inputUrlObj.url)
              .then((response) => {
                urlResponse = response;
                return validateIsRss(urlResponse);
              })
              .then((rssValidationResult) => {
                if (rssValidationResult) {
                  watchedState.form = {
                    isValid: true,
                    validationResult: 'urlAdded',
                  };
                  watchedState.rssLinksContent.push(urlResponse);
                  watchedState.rssLinks.push(inputUrlObj.url);
                } else {
                  watchedState.form = {
                    isValid: false,
                    validationResult: 'notRss',
                  };
                }
              })
              .catch(() => {
                watchedState.form = {
                  isValid: false,
                  validationResult: 'networkError',
                };
              });
          }
        } else {
          watchedState.form = {
            isValid: false,
            validationResult: 'urlValidationError',
          };
        }
      });
  });
};

export default app;
