const renderForm = (state, i18nextInstance) => {
  const form = document.querySelector('form');
  const feedbackEl = document.querySelector('.feedback');
  const feedback = state.form.urlCheckResult;
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

const renderPosts = (container, state, i18nextInstance) => {
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  let postId = 1;
  state.rssLinksContent.forEach((post) => {
    post.id = postId;
    postId += 1;
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const aEl = document.createElement('a');
    if (state.checkedPosts.includes(post.id)) {
      aEl.classList.add('fw-normal', 'link-secondary');
    } else {
      aEl.classList.add('fw-bold');
    }
    aEl.href = post.querySelector('link').textContent;
    aEl.dataset.id = post.id;
    aEl.dataset.bsToggle = 'modal';
    aEl.dataset.bsModal = '#modal';
    aEl.textContent = post.querySelector('title').textContent;
    aEl.target = '_blank';
    liEl.appendChild(aEl);

    const buttonEl = document.createElement('button');
    buttonEl.type = 'button';
    buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonEl.dataset.id = post.id;
    buttonEl.dataset.bsToggle = 'modal';
    buttonEl.dataset.bsModal = '#modal';
    buttonEl.textContent = i18nextInstance.t('pageText.show');
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
    h3El.textContent = feed.querySelector('title').textContent;
    const pEl = document.createElement('p');
    pEl.classList.add('m-0', 'small', 'text-black-50');
    pEl.textContent = feed.querySelector('description').textContent;
    liEl.appendChild(h3El);
    liEl.appendChild(pEl);
    ulEl.appendChild(liEl);
  });
  container.appendChild(ulEl);
};

const renderLinks = (state, i18nextInstance) => {
  const postsEl = document.querySelector('div.posts');
  const feedsEl = document.querySelector('div.feeds');
  if (state.rssLinksContent.length > 0) {
    const textPost = i18nextInstance.t('pageText.posts');
    const textFeed = i18nextInstance.t('pageText.feeds');
    renderContainer(postsEl, textPost);
    renderContainer(feedsEl, textFeed);
    const cardBorderElposts = postsEl.querySelector('.card');
    renderPosts(cardBorderElposts, state, i18nextInstance);

    const cardBorderElfeeds = feedsEl.querySelector('.card');
    renderFeeds(cardBorderElfeeds, state.rssInfo);
  }
};

const renderModal = (post, i18nextInstance) => {
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
  h5El.textContent = post.querySelector('title').textContent;

  const buttonEl = document.createElement('button');
  buttonEl.classList.add('btn-close');
  buttonEl.setAttribute('type', 'button');
  buttonEl.dataset.bsDismiss = 'modal';
  buttonEl.setAttribute('aria-label', 'Close');

  const bodyDivEl = document.createElement('div');
  bodyDivEl.classList.add('modal-body');
  bodyDivEl.textContent = post.querySelector('description').textContent;

  const footerDivEl = document.createElement('div');
  footerDivEl.classList.add('modal-footer');

  const buttonFooterPrimaryEl = document.createElement('a');
  buttonFooterPrimaryEl.classList.add('btn', 'btn-primary', 'full-article');
  buttonFooterPrimaryEl.href = post.querySelector('link').textContent;
  buttonFooterPrimaryEl.target = '_blank';
  buttonFooterPrimaryEl.setAttribute('rel', 'noopener');
  buttonFooterPrimaryEl.setAttribute('rel', 'noreferrer');
  buttonFooterPrimaryEl.setAttribute('role', 'button');
  buttonFooterPrimaryEl.textContent = i18nextInstance.t('pageText.readFull');

  const buttonFooterSecondEl = document.createElement('button');
  buttonFooterSecondEl.classList.add('btn', 'btn-secondary');
  buttonFooterSecondEl.setAttribute('type', 'button');
  buttonFooterSecondEl.dataset.bsDismiss = 'modal';
  buttonFooterSecondEl.textContent = i18nextInstance.t('pageText.close');

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
  modalDivEl.addEventListener('click', () => {
    modalDivEl.classList.remove('show');
    modalDivEl.removeAttribute('role');
    modalDivEl.setAttribute('style', 'display: none;');
  });
};

const addListenerToButtons = (state, i18nextInstance) => {
  const card = document.querySelector('.card');
  card.addEventListener('click', (e) => {
    const buttonId = e.target.dataset.id;
    state.checkedPosts.push(buttonId);
    const post = findPostById(state.rssLinksContent, buttonId);
    renderModal(post, i18nextInstance);
    addListenerToModalButtons();
  });
};

const renderPageContent = (state, i18nextInstance) => {
  renderLinks(state, i18nextInstance);
  addListenerToButtons(state, i18nextInstance);
};

export {
  renderForm, renderLinks, renderModal, renderPageContent,
};
