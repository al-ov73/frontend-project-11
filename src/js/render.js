const renderForm = (state, i18nextInstance) => {
  const form = document.querySelector('form');
  const feedbackEl = document.querySelector('.feedback');
  const feedback = state.form.validationResult;
  if (state.form.isValid === false) {
    const inputEl = form.querySelector('input')
    inputEl.classList.add('is-invalid')
    feedbackEl.classList.replace('text-success', 'text-danger');
    feedbackEl.textContent = i18nextInstance.t(`formMsgs.${feedback}`)
  } else {
    const inputEl = form.querySelector('input');
    inputEl.classList.remove('is-invalid');
    inputEl.value = '';
    inputEl.focus();
    feedbackEl.classList.replace('text-danger', 'text-success');
    feedbackEl.textContent = i18nextInstance.t(`formMsgs.${feedback}`);
  }
};

const renderLinks = (links) => {
  console.log(links[0].source)
  links[0].posts.forEach((post) => {
    console.log(post.title)
  })
};

export { renderForm, renderLinks };