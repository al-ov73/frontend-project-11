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

const renderContainer = (container, title) => {
  container.textContent = '';
  const cardBorderEl = document.createElement('div');
  cardBorderEl.classList.add('card', 'border-0');
  const cardBodyEl = document.createElement('div');
  cardBodyEl.classList.add('card-body');
  const h2El = document.createElement('h2')
  h2El.classList.add('card-title', 'h4');
  h2El.textContent = title;
  cardBodyEl.appendChild(h2El);
  cardBorderEl.appendChild(cardBodyEl)
  container.appendChild(cardBorderEl);
}

const renderPosts = (container, feeds) => {
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((feed) => {
    feed.posts.forEach((post) => {
      const liEl = document.createElement('li');
      liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const aEl = document.createElement('a');
      aEl.classList.add('fw-bold')
      aEl.href = post.link;
      aEl.textContent = post.title;
      aEl.target = '_blank'
      liEl.appendChild(aEl);
      
      const buttonEl = document.createElement('button');
      buttonEl.type = 'button';
      buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      buttonEl.dataset.id = post.id;
      buttonEl.dataset.bsToggle = 'modal';
      buttonEl.dataset.bsModal = '#modal';
      buttonEl.textContent = 'Просмотр';
      liEl.appendChild(buttonEl);
      
      ulEl.appendChild(liEl);
    });
  });
  container.appendChild(ulEl);
}

const renderFeeds = (container, feeds) => {
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((feed) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3El = document.createElement('h3');
    h3El.classList.add('h6', 'm-0');
    h3El.textContent = feed.source;
    liEl.appendChild(h3El);
    ulEl.appendChild(liEl);
  })
  container.appendChild(ulEl)
}

const renderLinks = (feeds) => {
  const postsEl = document.querySelector('div.posts');
  const feedsEl = document.querySelector('div.feeds');
  renderContainer(postsEl, 'Посты');
  renderContainer(feedsEl, 'Фиды');

  const cardBorderElposts = postsEl.querySelector('.border-0');
  renderPosts(cardBorderElposts, feeds);

  const cardBorderElfeeds = feedsEl.querySelector('.border-0')
  renderFeeds(cardBorderElfeeds, feeds);
};

export { renderForm, renderLinks };