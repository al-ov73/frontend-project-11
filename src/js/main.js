import onChange from 'on-change';

import '../scss/styles.scss';
import validate from '../js/validator.js';
import renderForm from '../js/render.js';

export default () => {
  const state = {
    form: {
      isValid: true,
      validationErrors: '',
    },
    links: [],
  };

  const watchedState = onChange(state, (path, value, previousValue) => {
    renderForm(state)
    console.log('state changed!');
    console.log(path, 'from', previousValue, 'to', value);
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputUrlObj = Object.fromEntries(formData);
    validate(inputUrlObj, watchedState);
  });
  
}
