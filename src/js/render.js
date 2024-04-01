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

const renderLinks = (feeds) => {
  const postsEl = document.querySelector('div.posts');
  postsEl.textContent = '';
  const cardBorderElposts = document.createElement('div');
  cardBorderElposts.classList.add('card', 'border-0');
  const cardBodyElposts = document.createElement('div');
  cardBodyElposts.classList.add('card-body');
  const h2Elposts = document.createElement('h2')
  h2Elposts.classList.add('card-title', 'h4');
  h2Elposts.textContent = 'Посты';
  cardBodyElposts.appendChild(h2Elposts);
  cardBorderElposts.appendChild(cardBodyElposts)
  postsEl.appendChild(cardBorderElposts);


  const feedsEl = document.querySelector('div.feeds');
  feedsEl.textContent = '';
  const cardBorderElfeeds = document.createElement('div');
  cardBorderElfeeds.classList.add('card', 'border-0');
  const cardBodyElfeeds = document.createElement('div');
  cardBodyElfeeds.classList.add('card-body');
  const h2Elfeeds = document.createElement('h2')
  h2Elfeeds.classList.add('card-title', 'h4');
  h2Elfeeds.textContent = 'Фиды';
  cardBodyElfeeds.appendChild(h2Elfeeds);
  cardBorderElfeeds.appendChild(cardBodyElfeeds)
  feedsEl.appendChild(cardBorderElfeeds);

  const ulElposts = document.createElement('ul');
  ulElposts.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((feed) => {
    feed.posts.forEach((post) => {
      const liEl = document.createElement('li');
      liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
      const h3El = document.createElement('h3');
      h3El.classList.add('h6', 'm-0');
      h3El.textContent = post.title;
      liEl.appendChild(h3El);
      ulElposts.appendChild(liEl);
    })

  })
  cardBorderElposts.appendChild(ulElposts)


  const ulElfeeds = document.createElement('ul');
  ulElfeeds.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((feed) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3El = document.createElement('h3');
    h3El.classList.add('h6', 'm-0');
    h3El.textContent = feed.source;
    liEl.appendChild(h3El);
    ulElfeeds.appendChild(liEl);
  })
  cardBorderElfeeds.appendChild(ulElfeeds)

  // console.log(postsEl, feedsEl);
  // links[0].posts.forEach((post) => {
  //   console.log(post.title)
  // })
};

export { renderForm, renderLinks };