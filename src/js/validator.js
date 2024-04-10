import * as yup from 'yup';

const getResponse = async (link, state) => {
  return fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
};

const isRss = (response) => {
  const parser = new DOMParser();
  const content = response.contents
  const doc = parser.parseFromString(content, "text/html");
  if (doc.querySelector('channel')) {
    return true;
  }
  return false;
};

const validateIsRss = (content, state, link) => {
  if (isRss(content)) {
    state.form = {
      isValid: true,
      validationResult: 'urlAdded',
    }
    state.RssLinksContent.push(content);
    state.RssLinks.push(link);
  } else {
    state.form = {
      isValid: false,
      validationResult: 'notRss',
    }
  }
}


export default async (inputUrlObj, state) => {
  const schema = yup.object({
    url: yup.string().url().nullable(),
  });
  schema.validate(inputUrlObj)
    .then(async () => {
      if (state.RssLinks.includes(inputUrlObj.url)) {
        state.form = {
          isValid: false,
          validationResult: 'urlExist',
        }
      } else {
        getResponse(inputUrlObj.url, state)
        .then((response) => {
          validateIsRss(response, state, inputUrlObj.url)
        })
        .catch(() => {
          state.form = {
            isValid: false,
            validationResult: 'networkError',
          }
        })
      }
    })
    .catch(() => {
      state.form = {
        isValid: false,
        validationResult: 'urlValidationError',
      }
    });
}