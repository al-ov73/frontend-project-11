import onChange from 'on-change';
import i18next from 'i18next';

import ru from '../../locales/ru.js';
import '../scss/styles.scss';
import validateUrl from './validator.js';
import { renderForm, renderLinks, renderModal } from './render.js';
import parseLinks from './parser.js';

const getDataFromLinks = async (state) => {
  const links = state.RssLinks;
  const promises = links.map((link) => fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }));
  return Promise.all(promises)
    .then((feeds) => {
      const content = [];
      feeds.forEach((feed) => content.push(feed));
      return content;
    });
};

export default async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
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
      console.log('rendering', state);
      const newsList = parseLinks(state.RssLinksContent);
      console.log(newsList);
      renderLinks(newsList);
      addListenerToButtons(newsList);
    }
    if (path === 'RssLinks') {
      const renderPosts = async () => {
        getDataFromLinks(state)
          .then((data) => parseLinks(data))
          .then((newsList) => renderLinks(newsList))
          .then((newsList) => addListenerToButtons(newsList))
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
    validateUrl(inputUrlObj, watchedState);
  });
};
