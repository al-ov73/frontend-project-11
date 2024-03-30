export default (state) => {
    const form = document.querySelector('form');
    if (state.form.isValid === false) {
      const inputEl = form.querySelector('input')
      inputEl.classList.add('is-invalid')
      const parentDivEl = form.closest('div');
      const errorEl = document.createElement('p');
      errorEl.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-danger');
      errorEl.textContent = state.form.validationErrors;
      parentDivEl.appendChild(errorEl);
    } else {
      console.log('clear and focus')
      const inputEl = form.querySelector('input');
      inputEl.value = '';
      inputEl.focus();
    }
  };