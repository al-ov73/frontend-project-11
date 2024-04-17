import * as yup from 'yup';

const validateIsRss = (response) => {
  const parser = new DOMParser();
  const content = response.contents;
  const doc = parser.parseFromString(content, 'text/html');
  if (doc.querySelector('channel')) {
    return true;
  }
  return false;
};

const validateUrl = async (inputUrlObj) => {
  const schema = yup.object({
    url: yup.string().url().nullable(),
  });
  return schema.validate(inputUrlObj)
    .then(() => true)
    .catch(() => false);
};

export { validateUrl, validateIsRss };
