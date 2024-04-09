import * as yup from 'yup';

const getResponse = async (link, state) => {
  return fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .catch((error) => {
    state.form = {
      isValid: false,
      validationResult: 'networkError',
    }
  });
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
        .then((content) => {
          console.log('content', content)
          const RssValidatResult = isRss(content);
          if (RssValidatResult) {
            state.form = {
              isValid: true,
              validationResult: 'urlAdded',
            };
            state.RssLinks.push(inputUrlObj.url)
          } else {
            state.form = {
              isValid: false,
              validationResult: 'notRss',
            }
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {
      state.form = {
        isValid: false,
        validationResult: 'urlValidationError',
      }
    });
}