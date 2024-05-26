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
    rssInfo: [],
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

  const checkLinksContent = async (currentState) => {
    const links = currentState.rssLinks;
    const promises = links.map((link) => getDataFromLink(link));
    Promise.all(promises)
      .then((feeds) => feeds.map((feed) => parseLink(feed)))
      .then((response) => {
        const updatedPosts = response.flatMap((channel) => channel.postsInFeed);
        const oldLinks = currentState.rssLinksContent.map((oldPost) => oldPost.querySelector('link').textContent);
        const newLinks = updatedPosts.map((newPost) => newPost.querySelector('link').textContent);
        if (JSON.stringify(oldLinks) !== JSON.stringify(newLinks)) {
          watchedState.rssLinksContent = updatedPosts;
        }
      })
      .finally(() => setTimeout(() => checkLinksContent(state), 5000));
  };

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
        watchedState.rssLinks.push(inputUrlObj.url);
        watchedState.rssInfo.push(response.feedInfo);
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

  checkLinksContent(state);
};

export default app;
