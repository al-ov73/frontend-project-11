import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';

import ru from './locales/ru.js';
import '../scss/styles.scss';
import { validateUrl } from './validator.js';
import {
  renderForm, renderPageContent,
} from './render.js';
import parseLink from './parser.js';

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

const checkLinksContent = async (state, i18nextInstance) => {
  getDataFromLinks(state)
    .then((data) => {
      if (data !== state.rssLinksContent) {
        renderPageContent(state, i18nextInstance);
      }
    })
    .finally(() => setTimeout(() => checkLinksContent(state), 5000));
};

const app = async () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance
    .init({
      lng: 'ru',
      debug: true,
      resources: {
        ru,
      },
    })
    .then((newI18nextInstance) => newI18nextInstance);

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
      renderPageContent(state, i18nextInstance);
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputUrlObj = Object.fromEntries(formData);

    validateUrl(inputUrlObj)
      .then(() => {
        if (state.rssLinks.includes(inputUrlObj.url)) {
          throw new Error('Url exist');
        }
      })
      .then(() => getDataFromLink(inputUrlObj.url))
      .then((response) => parseLink(response))
      .then((response) => {
        watchedState.form = {
          isValid: true,
          urlCheckResult: 'urlAdded',
        };
        watchedState.rssLinks.push(response.feedInfo);
        watchedState.rssLinksContent.push(...response.postsInFeed);
      })
      .catch((error) => {
        switch (error.message) {
          case 'url must be a valid URL':
            watchedState.form = {
              isValid: false,
              urlCheckResult: 'urlValidationError',
            };
            break;
          case 'Url exist':
            watchedState.form = {
              isValid: false,
              urlCheckResult: 'urlExist',
            };
            break;
          case 'Network Error':
            watchedState.form = {
              isValid: false,
              urlCheckResult: 'networkError',
            };
            break;
          case 'not RSS error':
            watchedState.form = {
              isValid: false,
              urlCheckResult: 'notRss',
            };
            break;
          default:
            console.log(error);
        }
      });
  });

  checkLinksContent(state, i18nextInstance);
};

export default app;
