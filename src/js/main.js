import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';

import ru from './locales/ru.js';
import '../scss/styles.scss';
import { validateUrl, validateIsRss } from './validator.js';
import {
  renderForm, renderPageContent,
} from './render.js';

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const getDataFromLink = (link) => {
  const proxyUrl = addProxy(link);
  return axios.get(proxyUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
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

// const app = async () => {
//   const i18nextInstance = i18next.createInstance();
//   i18nextInstance.init({
//     lng: 'ru',
//     debug: true,
//     resources: {
//       ru,
//     },
//   });

const app = async () => {

  const state = {
    form: {
      isValid: false,
      urlCheckResult: 'urlAdded',
    },
    rssLinks: [],
    rssLinksContent: [],
    checkedPosts: [],
  };

  const watchedState = onChange(state, (path) => {
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
              urlCheckResult: 'urlExist',
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
                    urlCheckResult: 'urlAdded',
                  };
                  watchedState.rssLinksContent.push(urlResponse);
                  watchedState.rssLinks.push(inputUrlObj.url);
                } else {
                  watchedState.form = {
                    isValid: false,
                    urlCheckResult: 'notRss',
                  };
                }
              })
              .catch(() => {
                watchedState.form = {
                  isValid: false,
                  urlCheckResult: 'networkError',
                };
              });
          }
        } else {
          watchedState.form = {
            isValid: false,
            urlCheckResult: 'urlValidationError',
          };
        }
      });
  });

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
  .then((i18nextInstance) => i18nextInstance);
  const updatePageContent = async (state) => {
    console.log('check')
    getDataFromLinks(state)
      .then((data) => renderPageContent(data, state, i18nextInstance))
      .finally(() => setTimeout(() => updatePageContent(state), 5000));
  };
  updatePageContent(state)
};

export default app;
