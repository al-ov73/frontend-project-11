import * as yup from 'yup';

const isRss = async (link) => {
  return fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`)
    .then((response) => response.json())
    .then((jsonResult) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(jsonResult.contents, "application/xml");
      if (doc.querySelector('channel')) {
        return true;
      }
      return false;
    })
  };


export default async (inputUrlObj, state) => {

  const schema = yup.object({
    url: yup.string().url().nullable(),
  });
  schema.validate(inputUrlObj)
    .then( async () => {
      if (state.RssLinks.includes(inputUrlObj.url)) {
        state.form = {
          isValid: false,
          validationResult: 'urlExist',
        }
      } else {
        isRss(inputUrlObj.url)
        .then((RssValidatResult) => {
          console.log('RssValidatResult', RssValidatResult)
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

      }
    })
    .catch(() => {
      state.form = {
        isValid: false,
        validationResult: 'urlValidationError',
      }
    });
}