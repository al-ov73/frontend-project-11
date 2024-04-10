const renderForm = (state, i18nextInstance) => {
  const form = document.querySelector('form');
  const feedbackEl = document.querySelector('.feedback');
  const feedback = state.form.validationResult;
  if (state.form.isValid === false) {
    const inputEl = form.querySelector('input');
    inputEl.classList.add('is-invalid');
    feedbackEl.classList.replace('text-success', 'text-danger');
    feedbackEl.textContent = i18nextInstance.t(`formMsgs.${feedback}`);
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
  const h2El = document.createElement('h2');
  h2El.classList.add('card-title', 'h4');
  h2El.textContent = title;
  cardBodyEl.appendChild(h2El);
  cardBorderEl.appendChild(cardBodyEl);
  container.appendChild(cardBorderEl);
};

const renderPosts = (container, posts) => {
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  posts.forEach((post) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const aEl = document.createElement('a');
    aEl.classList.add('fw-bold');
    aEl.href = post.link;
    aEl.dataset.id = post.id;
    aEl.dataset.bsToggle = 'modal';
    aEl.dataset.bsModal = '#modal';
    aEl.textContent = post.title;
    aEl.target = '_blank';
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

  container.appendChild(ulEl);
};

const renderFeeds = (container, feeds) => {
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((feed) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3El = document.createElement('h3');
    h3El.classList.add('h6', 'm-0');
    h3El.textContent = feed.title;
    const pEl = document.createElement('p');
    pEl.classList.add('m-0', 'small', 'text-black-50');
    pEl.textContent = feed.description;
    liEl.appendChild(h3El);
    liEl.appendChild(pEl);
    ulEl.appendChild(liEl);
  });
  container.appendChild(ulEl);
};

const renderLinks = (content) => {
  const postsEl = document.querySelector('div.posts');
  renderContainer(postsEl, 'Посты');
  const feedsEl = document.querySelector('div.feeds');
  renderContainer(feedsEl, 'Фиды');

  const cardBorderElposts = postsEl.querySelector('.border-0');
  renderPosts(cardBorderElposts, content.posts);

  const cardBorderElfeeds = feedsEl.querySelector('.border-0');
  renderFeeds(cardBorderElfeeds, content.feeds);
  return content;
};

const renderModal = (post) => {
  const currentModal = document.querySelector('.modal');
  currentModal.remove();

  const postsEl = document.querySelector('div.posts');
  const checkedPost = postsEl.querySelector(`a[data-id="${post.id}"]`);
  checkedPost.removeAttribute('class');
  checkedPost.classList.add('fw-normal', 'link-secondary');

  const modalDivEl = document.createElement('div');
  modalDivEl.classList.add('modal', 'fade', 'show');
  modalDivEl.setAttribute('id', 'modal');
  modalDivEl.setAttribute('tabindex', '-1');
  modalDivEl.setAttribute('aria-labelledby', 'modalLabel');
  modalDivEl.setAttribute('aria-hidden', 'true');
  modalDivEl.setAttribute('style', 'display: block;');
  modalDivEl.setAttribute('role', 'dialog');

  const dialogDivEl = document.createElement('div');
  dialogDivEl.classList.add('modal-dialog');

  const contentDivEl = document.createElement('div');
  contentDivEl.classList.add('modal-content');

  const headerDivEl = document.createElement('div');
  headerDivEl.classList.add('modal-header');

  const h5El = document.createElement('h5');
  h5El.classList.add('modal-title');
  h5El.setAttribute('id', 'modalLabel');
  h5El.textContent = post.title;

  const buttonEl = document.createElement('button');
  buttonEl.classList.add('btn-close');
  buttonEl.setAttribute('type', 'button');
  buttonEl.dataset.bsDismiss = 'modal';
  buttonEl.setAttribute('aria-label', 'Close');

  const bodyDivEl = document.createElement('div');
  bodyDivEl.classList.add('modal-body');
  bodyDivEl.textContent = post.description;

  const footerDivEl = document.createElement('div');
  footerDivEl.classList.add('modal-footer');

  const buttonFooterPrimaryEl = document.createElement('a');
  buttonFooterPrimaryEl.classList.add('btn', 'btn-primary', 'full-article');
  buttonFooterPrimaryEl.href = post.link;
  buttonFooterPrimaryEl.target = '_blank';
  buttonFooterPrimaryEl.setAttribute('rel', 'noopener');
  buttonFooterPrimaryEl.setAttribute('rel', 'noreferrer');
  buttonFooterPrimaryEl.setAttribute('role', 'button');
  buttonFooterPrimaryEl.textContent = 'Читать полностью';

  const buttonFooterSecondEl = document.createElement('button');
  buttonFooterSecondEl.classList.add('btn', 'btn-secondary');
  buttonFooterSecondEl.setAttribute('type', 'button');
  buttonFooterSecondEl.dataset.bsDismiss = 'modal';
  buttonFooterSecondEl.textContent = 'Закрыть';

  headerDivEl.appendChild(h5El);
  headerDivEl.appendChild(buttonEl);
  contentDivEl.appendChild(headerDivEl);
  contentDivEl.appendChild(bodyDivEl);
  footerDivEl.appendChild(buttonFooterPrimaryEl);
  footerDivEl.appendChild(buttonFooterSecondEl);
  contentDivEl.appendChild(footerDivEl);
  dialogDivEl.appendChild(contentDivEl);
  modalDivEl.appendChild(dialogDivEl);
  document.body.prepend(modalDivEl);
};

export { renderForm, renderLinks, renderModal };
