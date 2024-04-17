import onChange from 'on-change';
import i18next from 'i18next';

import ru from './locales/ru.js';
import '../scss/styles.scss';
import { validateUrl, validateIsRss } from './validator.js';
import { renderForm, renderLinks, renderModal } from './render.js';
import parseLinks from './parser.js';

const getDataFromLink = (link) => {
  const host = 'https://allorigins.hexlet.app/';
  const params = `get?url=${encodeURIComponent(link)}`;
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
  const links = state.RssLinks;
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

  const findPostById = (posts, id) => {
    let result = null;
    posts.forEach((post) => {
      if (post.id === id) {
        result = post;
      }
    });
    return result;
  };

  const addListenerToModalButtons = () => {
    const modalDivEl = document.querySelector('div.modal');
    const closeButtons = modalDivEl.querySelectorAll('button');
    closeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        modalDivEl.classList.remove('show');
        modalDivEl.removeAttribute('role');
        modalDivEl.setAttribute('style', 'display: none;');
      });
    });
  };

  const addListenerToButtons = (content) => {
    const buttons = document.querySelectorAll('button[data-bs-toggle]');
    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const buttonId = e.target.dataset.id;
        const post = findPostById(content.posts, Number(buttonId));
        renderModal(post);
        addListenerToModalButtons();
      });
    });
  };

  // STATE
  const state = {
    form: {
      isValid: '',
      validationResult: '',
    },
    RssLinks: [],
    RssLinksContent: [],
  };

  // WATCHEDSTATE
  const watchedState = onChange(state, async (path) => {
    console.log(state);
    if (path === 'form') {
      renderForm(state, i18nextInstance);
    }
    if (path === 'RssLinksContent') {
      const pageContent = parseLinks(state.RssLinksContent);
      renderLinks(pageContent);
      addListenerToButtons(pageContent);
    }
    if (path === 'RssLinks') {
      const renderPosts = async () => {
        getDataFromLinks(state)
          .then((data) => parseLinks(data))
          .then((pageContent) => {
            renderLinks(pageContent);
            addListenerToButtons(pageContent);
          })
          .then(() => setTimeout(renderPosts, 5000));
      };
      setTimeout(renderPosts, 5000);
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
          if (state.RssLinks.includes(inputUrlObj.url)) {
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
                  watchedState.RssLinksContent.push(urlResponse);
                  watchedState.RssLinks.push(inputUrlObj.url);
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
